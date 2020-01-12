//
//  XENDWeatherManager.m
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDWeatherManager.h"
#import "Model/TWCObservation.h"
#import "Model/TWCDailyForecast.h"

#define UPDATE_INTERVAL 15 // minutes

@interface XENDWeatherManager ()

// Internal dependencies
@property (nonatomic, weak) id<XENDWeatherManagerDelegate> delegate;
@property (nonatomic, strong) NSString *apiKey;
@property (nonatomic, weak) XENDLocationManager *locationManager;

// State management
@property (nonatomic, strong) NSTimer *updateTimer;
@property (nonatomic, strong) NSDate *lastUpdateTime;
@property (nonatomic, strong) NSDate *nextUpdateTime;
@property (nonatomic, readwrite) BOOL timerIsPaused;
@property (nonatomic, readwrite) BOOL networkIsDisconnected;
@property (nonatomic, readwrite) BOOL refreshQueuedDuringNetworkDisconnected;

// Caching
@property (nonatomic, strong) NSArray* dailyPredictionCache;
@property (nonatomic, strong) NSArray* hourlyPredictionCache;
@property (nonatomic, strong) TWCObservation *observationCache;

@end

@implementation XENDWeatherManager

- (instancetype)initWithAPIKey:(NSString*)key locationManager:(XENDLocationManager*)locationManager andDelegate:(id<XENDWeatherManagerDelegate>)delegate {
    
    self = [super init];
    
    if (self) {
        if (!key || [key isEqualToString:@""]) {
            NSLog(@"ERROR :: Weather manager does not have a valid API key");
        }
        
        // Internal dependencies
        self.apiKey = key;
        self.delegate = delegate;
        self.locationManager = locationManager;
        
        // Start update timer
        self.lastUpdateTime = nil;
        [self _restartUpdateTimerWithInterval:UPDATE_INTERVAL * 60];
        
        // Do initial refresh on startup
        [self refreshWeather];
    }
    
    return self;
}

#pragma mark Update state management

- (void)networkWasDisconnected {
    self.networkIsDisconnected = YES;
}

- (void)networkWasConnected {
    self.networkIsDisconnected = NO;
    
    // Undertake a refresh if one was queued
    if (self.refreshQueuedDuringNetworkDisconnected) {
        [self refreshWeather];
        self.refreshQueuedDuringNetworkDisconnected = NO;
    }
}

- (void)pauseUpdateTimer {
    self.timerIsPaused = YES;
    
    NSLog(@"Pausing weather update timer");
    [self.updateTimer invalidate];
}

- (void)restartUpdateTimer {
    self.timerIsPaused = NO;
    
    // Restarting timer as needed.
    NSTimeInterval nextFireInterval = [self.nextUpdateTime timeIntervalSinceDate:[NSDate date]];
    
    if (nextFireInterval <= 5) { // seconds
        NSLog(@"Timer would have (or is about to) expire, so requesting update");
        [self refreshWeather];
    } else {
        // Restart the timer for this remaining interval
        NSLog(@"Restarting weather update timer, with interval: %f minutes", (float)nextFireInterval / 60.0);
        [self _restartUpdateTimerWithInterval:nextFireInterval];
    }
}

- (void)_restartUpdateTimerWithInterval:(NSTimeInterval)interval {
    if (self.updateTimer)
        [self.updateTimer invalidate];
    
    NSLog(@"Restarting weather update timer with interval: %f minutes", (float)interval / 60.0);
    
    self.updateTimer = [NSTimer scheduledTimerWithTimeInterval:interval
                                                        target:self
                                                      selector:@selector(_updateTimerFired:)
                                                      userInfo:nil
                                                       repeats:NO];
    
    self.nextUpdateTime = [[NSDate date] dateByAddingTimeInterval:interval];
}

- (void)_updateTimerFired:(NSTimer*)timer {
    [self refreshWeather];
}

#pragma mark Update implementation

- (void)refreshWeather {
    // Queue if no network
    if (self.networkIsDisconnected) {
        self.refreshQueuedDuringNetworkDisconnected = YES;
        return;
    }
    
    NSLog(@"Refreshing weather...");
    
    [self _doRefreshWeatherWithCompletion:^{
        // Restart the update timer with the full interval
        [self _restartUpdateTimerWithInterval:UPDATE_INTERVAL * 60];
    }];
}

- (void)_doRefreshWeatherWithCompletion:(void(^)(void))completionHandler {
    
    // 1. Get current location from the location manager
    [self.locationManager fetchCurrentLocationWithCompletionHandler:^(NSError *error, CLLocation *location) {
        if (error && error.code == kXENLocationErrorNotAvailable) {
            location = [self.delegate fallbackWeatherLocation];
        }
        
        if (error && error.code == kXENLocationErrorCachedOnly) {
            NSLog(@"WARN :: Using old location fix, might be inaccurate");
        }
        
        // 2. Create necessary requests for forecast and air quality
        // TODO: Check network availability, and just use existing cached data if necessary
        
        
        NSURLRequest *forecastRequest = [self urlRequestForForecast:location];
        NSURLRequest *airQualityRequest = [self urlRequestForAirQuality:location];
        
        // 3. Wait for them to succeed
        NSURLSession *session = [NSURLSession sharedSession];
        
        __block NSDictionary *forecastData = nil;
        __block NSDictionary *airQualityData = nil;
        
        dispatch_group_t serviceGroup = dispatch_group_create();

        dispatch_group_enter(serviceGroup);
        NSURLSessionDataTask *forecastTask = [session dataTaskWithRequest:forecastRequest
                                                        completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
            if (!error) {
                NSError *parseError;
                forecastData = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&parseError];
                
                if (parseError) {
                    forecastData = @{};
                }
            }
            
            // Exit dispatch group
            dispatch_group_leave(serviceGroup);
        }];
        [forecastTask resume];
        
        dispatch_group_enter(serviceGroup);
        NSURLSessionDataTask *airQualityTask = [session dataTaskWithRequest:airQualityRequest
                                                        completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
            if (!error) {
                NSError *parseError;
                airQualityData = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&parseError];
                
                if (parseError) {
                    airQualityData = @{};
                }
            }
            
            // Exit dispatch group
            dispatch_group_leave(serviceGroup);
        }];
        [airQualityTask resume];
        
        dispatch_group_notify(serviceGroup, dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),^{
            // 4. Now that downloads are done, parse the downloaded data
            NSDictionary *parsed = [self parseWeatherData:forecastData airQualityData:airQualityData updateCache:YES];
            
            // 5. Notify delegate of new parsed data
            [self.delegate onUpdatedWeatherConditions:parsed];
        });

    }];
}

- (NSString*)_deviceLanguage {
    return [[NSLocale preferredLanguages] firstObject];
}

- (BOOL)_useMetric {
    return [[[NSLocale currentLocale] objectForKey:NSLocaleUsesMetricSystem] boolValue];
}

- (NSURLRequest*)urlRequestForForecast:(CLLocation*)location {
    // https://api.weather.com/v1/geocode/37.323002/-122.032204/aggregate.json?
    // products=conditionsshort,fcstdaily10short,fcsthourly24short,nowlinks&apiKey=xxx
    
    NSString *endpoint = @"https://api.weather.com/v1/geocode";
    NSString *queryParams = [NSString stringWithFormat:@"aggregate.json?products=conditionsshort,fcstdaily10short,fcsthourly24short,nowlinks&apiKey=%@&language=%@",
                             self.apiKey,
                             [self _deviceLanguage]];
    
    NSString *qualifiedUrlString = [NSString stringWithFormat:@"%@/%f/%f/%@",
                                    endpoint,
                                    location.coordinate.latitude,
                                    location.coordinate.longitude,
                                    queryParams];
    
    NSURL *url = [NSURL URLWithString:qualifiedUrlString];
    return [NSURLRequest requestWithURL:url];
}

- (NSURLRequest*)urlRequestForAirQuality:(CLLocation*)location {
    // https://api.weather.com/v2/globalairquality?geocode=37.323002,-122.032204&language=en-US&format=json&apiKey=xxx
    
    NSString *endpoint = @"https://api.weather.com/v2";
    NSString *queryParams = [NSString stringWithFormat:@"globalairquality?geocode=%f,%f&language=%@&format=json&apiKey=%@",
                             location.coordinate.latitude,
                             location.coordinate.longitude,
                             [self _deviceLanguage],
                             self.apiKey];
    
    NSString *qualifiedUrlString = [NSString stringWithFormat:@"%@/%@",
                                    endpoint,
                                    queryParams];
    
    NSURL *url = [NSURL URLWithString:qualifiedUrlString];
    return [NSURLRequest requestWithURL:url];
}

- (NSDictionary*)parseWeatherData:(NSDictionary*)forecastData airQualityData:(NSDictionary*)airQualityData updateCache:(BOOL)updateCache {
    if (updateCache)
        [self updateForecastCache:forecastData :airQualityData];
    
    return @{
        @"_useMetric": [NSNumber numberWithBool:[self _useMetric]],
        @"now": [self nowFieldFromCache],
        @"hourly": @{},
        @"daily": [self dailyFieldFromCache]
    };
}

- (void)updateForecastCache:(NSDictionary*)forecastData :(NSDictionary*)airQualityData {
    // Observation
    NSDictionary *observationData = [[forecastData objectForKey:@"conditionsshort"] objectForKey:@"observation"];
    TWCObservation *observation = [[TWCObservation alloc] initWithData:observationData metric:[self _useMetric]];
    
    self.observationCache = observation;
    
    // Daily forecasts
    NSMutableArray *dailyCache = [@[] mutableCopy];
    NSArray *predictions = [[forecastData objectForKey:@"fcstdaily10short"] objectForKey:@"forecasts"];
    for (NSDictionary *data in predictions) {
        TWCDailyForecast *prediction = [[TWCDailyForecast alloc] initWithData:data metric:[self _useMetric]];
        [dailyCache addObject:prediction];
    }
    
    self.dailyPredictionCache = dailyCache;
    
    // TODO: Hourly forecasts
}

- (BOOL)_validateObservation:(TWCObservation*)observation {
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    return observation.validFromUNIXTime + (60 * 60 * 24) >= now;
}

- (TWCDailyForecast*)_cachedDailyPredictionForNow {
    // From cached data, fetch the daily prediction that is for today
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    
    for (TWCDailyForecast *prediction in self.dailyPredictionCache) {
        if (prediction.validUNIXTime <= now &&
            prediction.validUNIXTime + (60 * 60 * 24) > now)
            return prediction;
    }
    
    return nil;
}

- (NSArray*)_cachedDailyPredictionSinceNow {
    // From cached data, fetch the predictions that include and follow today's
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    
    NSMutableArray *result = [NSMutableArray array];
    
    for (TWCDailyForecast *prediction in self.dailyPredictionCache) {
        if (prediction.validUNIXTime + (60 * 60 * 24) > now)
            [result addObject:prediction];
    }
    
    return result;
}

- (NSDictionary*)nowFieldFromCache {
    
    TWCObservation *observation = self.observationCache;
    TWCDailyForecast *prediction = [self _cachedDailyPredictionForNow];
    
    // Validate the observation
    BOOL isObservationValid = [self _validateObservation:observation];
    if (!isObservationValid) {
        observation = [[TWCObservation alloc] initWithFakeData:[self _useMetric]];
    }
    
    // See: https://www.worldcommunitygrid.org/lt/images/climate/The_Weather_Company_APIs.pdf
    // This includes full descriptions for every field for documentation
    NSDictionary *now = @{
        @"_isValid": [NSNumber numberWithBool:isObservationValid],
        
        @"cloudCover": observation.cloudCoverDescription,
        
        @"condition": @{
            @"code": observation.conditionIcon,
            @"description": observation.conditionDescription,
        },
        
        @"precipitation": @{
            @"hourly": observation.precipHourly,
            @"total": observation.precipTotal,
            @"type": prediction ? prediction.precipType : @"rain",
            @"snowHourly": observation.snowHourly
        },
        
        @"pressure": @{
            @"current": observation.pressure,
            @"description": observation.pressureDescription,
            @"tendency": observation.pressureTendency,
        },
        
        @"moon": @{
            @"phaseCode": prediction.lunarPhaseCode,
            @"phaseDescription": prediction.lunarPhaseDescription,
            @"moonrise": prediction.moonRiseISOTime,
            @"moonset": prediction.moonSetISOTime
        },
        
        @"sun": @{
            @"sunset": prediction.sunSetISOTime,
            @"sunrise": prediction.sunRiseISOTime,
        },
        
        @"temperature": @{
            @"current": observation.temperature,
            @"dewpoint": observation.dewpoint,
            @"feelsLike": observation.feelsLike,
            @"maximum": observation.maxTemp,
            @"minimum": observation.minTemp,
            @"relativeHumidity": observation.relativeHumidity,
            @"heatIndex": observation.heatIndex
        },
        
        @"ultraviolet": @{
            @"index": observation.uvIndex,
            @"description": observation.uvDescription,
        },
        
        @"visibility": observation.visibility,
        
        @"wind": @{
            @"degrees": observation.windDirection,
            @"cardinal": observation.windDirectionCardinal,
            @"gust": observation.gust,
            @"speed": observation.windSpeed,
        }
        
    };
    
    return now;
}

- (NSArray*)dailyFieldFromCache {
    NSMutableArray *result = [NSMutableArray array];
    
    NSArray *predictions = [self _cachedDailyPredictionSinceNow];
    for (TWCDailyForecast *prediction in predictions) {
        
        NSDictionary *item = @{
            @"cloudCover": prediction.cloudCoverDescription,
            
            @"condition": @{
                @"code": prediction.conditionIcon,
                @"description": prediction.conditionDescription,
            },
            
            @"dayOfWeek": prediction.dayOfWeek,
            
            @"moon": @{
                @"phaseCode": prediction.lunarPhaseCode,
                @"phaseDescription": prediction.lunarPhaseDescription,
                @"moonrise": prediction.moonRiseISOTime,
                @"moonset": prediction.moonSetISOTime
            },
            
            @"sun": @{
                @"sunset": prediction.sunSetISOTime,
                @"sunrise": prediction.sunRiseISOTime,
            },
            
            @"precipitation": @{
                @"probability": prediction.precipProbability,
                @"description": prediction.precipProbabilityDescription,
                @"type": prediction.precipType,
                @"stormLikelihood": prediction.stormLikelihood,
                @"tornadoLikelihood": prediction.tornadoLikelihood,
            },
            
            @"temperature": @{
                @"maximum": prediction.maxTemp,
                @"minimum": prediction.minTemp,
                @"relativeHumidity": prediction.relativeHumidity,
                @"heatIndex": prediction.heatIndex
            },
            
            @"ultraviolet": @{
                @"index": prediction.uvIndex,
                @"description": prediction.uvDescription,
            },
            
            @"wind": @{
                @"degrees": prediction.windDirection,
                @"cardinal": prediction.windDirectionCardinal,
                @"speed": prediction.windSpeed
            }
        };
        
        [result addObject:item];
    }
    
    return result;
}

@end
