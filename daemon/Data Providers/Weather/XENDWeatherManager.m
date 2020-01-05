//
//  XENDWeatherManager.m
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDWeatherManager.h"
#import "Model/TWCObservation.h"

#define UPDATE_INTERVAL 15 // minutes

@interface XENDWeatherManager ()

// Internal dependencies
@property (nonatomic, weak) id<XENDWeatherManagerDelegate> delegate;
@property (nonatomic, strong) NSString *apiKey;
@property (nonatomic, weak) XENDLocationManager *locationManager;

// State management
@property (nonatomic, retain) NSTimer *updateTimer;
@property (nonatomic, retain) NSDate *lastUpdateTime;
@property (nonatomic, retain) NSDate *nextUpdateTime;
@property (nonatomic, readwrite) BOOL timerIsPaused;
@property (nonatomic, readwrite) BOOL networkIsDisconnected;
@property (nonatomic, readwrite) BOOL refreshQueuedDuringNetworkDisconnected;

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
        if (error) {
            NSLog(@"ERROR :: Failed to get user's current location!");
            
            completionHandler();
            return;
        }
        
        // 2. Create necessary requests for forecast and air quality
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
            NSLog(@"forecast: %@", data);
            if (!error) {
                NSError *parseError;
                forecastData = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&parseError];
            }
            
            // Exit dispatch group
            dispatch_group_leave(serviceGroup);
        }];
        [forecastTask resume];
        
        dispatch_group_enter(serviceGroup);
        NSURLSessionDataTask *airQualityTask = [session dataTaskWithRequest:airQualityRequest
                                                        completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
            NSLog(@"air quality: %@", data);
            if (!error) {
                NSError *parseError;
                airQualityData = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&parseError];
            }
            
            // Exit dispatch group
            dispatch_group_leave(serviceGroup);
        }];
        [airQualityTask resume];
        
        dispatch_group_notify(serviceGroup, dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),^{
            // 4. Now that downloads are done, parse the downloaded data
            NSDictionary *parsed = [self parseWeatherData:forecastData :airQualityData];
            
            // 5. Notify delegate of new parsed data
            [self.delegate onUpdatedWeatherConditions:parsed];
        });

    }];
}

- (NSString*)_deviceLanguage {
    return @"en-US";
}

- (BOOL)_useMetric {
    return YES;
}

- (NSURLRequest*)urlRequestForForecast:(CLLocation*)location {
    // https://api.weather.com/v1/geocode/37.323002/-122.032204/aggregate.json?
    // products=conditionsshort,fcstdaily10short,fcsthourly24short,nowlinks&apiKey=xxx
    
    NSString *endpoint = @"https://api.weather.com/v1/geocode";
    NSString *queryParams = [NSString stringWithFormat:@"aggregate.json?products=conditionsshort,fcstdaily10short,fcsthourly24short,nowlinks&apiKey=%@", self.apiKey];
    
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
    NSString *queryParams = [NSString stringWithFormat:@"globalairquality?geocode=%f,%f&language=en-US&format=json&apiKey=%@",
                             location.coordinate.latitude,
                             location.coordinate.longitude,
                             self.apiKey];
    
    NSString *qualifiedUrlString = [NSString stringWithFormat:@"%@/%@",
                                    endpoint,
                                    queryParams];
    
    NSURL *url = [NSURL URLWithString:qualifiedUrlString];
    return [NSURLRequest requestWithURL:url];
}

- (NSDictionary*)parseWeatherData:(NSDictionary*)forecastData :(NSDictionary*)airQualityData {
    return @{
        @"_useCelsius": [NSNumber numberWithBool:[self _useMetric]],
        @"now": [self parseNowData:forecastData :airQualityData],
        @"hourly": @{},
        @"daily": @{}
    };
}

- (NSDictionary*)parseNowData:(NSDictionary*)forecastData :(NSDictionary*)airQualityData {
    NSDictionary *observationData = [[forecastData objectForKey:@"conditionsshort"] objectForKey:@"observation"];
    TWCObservation *observation = [[TWCObservation alloc] initWithData:observationData metric:[self _useMetric]];
    
    NSDictionary *prediction = [[[forecastData objectForKey:@"fcstdaily10short"] objectForKey:@"forecasts"] firstObject];
    
    // See: https://www.worldcommunitygrid.org/lt/images/climate/The_Weather_Company_APIs.pdf
    // This includes full descriptions for every field for documentation
    NSDictionary *now = @{
        @"cloudCover": observation.cloudCoverDescription,
        
        @"condition": @{
            @"code": observation.conditionIcon,
            @"description": observation.conditionDescription,
        },
        
        @"precipitation": @{
            @"hourly": observation.precipHourly,
            @"total": observation.precipTotal,
            // @"type": [[prediction objectForKey:@"day"] objectForKey:@"precip_type"],
            @"snowHourly": observation.snowHourly
        },
        
        @"pressure": @{
            @"current": observation.pressure,
            @"description": observation.pressureDescription,
            @"tendency": observation.pressureTendency,
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

@end
