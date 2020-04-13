//
//  XENDWeatherManager.m
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDWeatherManager.h"
#import "Model/XTWCObservation.h"
#import "Model/XTWCDailyForecast.h"
#import "Model/XTWCHourlyForecast.h"
#import "Model/XTWCAirQualityObservation.h"
#import "Model/XTWCUnits.h"

#import "XENDLogger.h"

FOUNDATION_EXPORT NSLocaleKey const NSLocaleTemperatureUnit  __attribute__((weak_import));

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
@property (nonatomic, strong) NSArray* nightlyPredictionCache;
@property (nonatomic, strong) NSArray* hourlyPredictionCache;
@property (nonatomic, strong) XTWCObservation *observationCache;
@property (nonatomic, strong) XTWCAirQualityObservation *airQualityCache;
@property (nonatomic, strong) NSDictionary* metadataCache;

@end

@implementation XENDWeatherManager

- (instancetype)initWithAPIKey:(NSString*)key locationManager:(XENDLocationManager*)locationManager andDelegate:(id<XENDWeatherManagerDelegate>)delegate {
    
    self = [super init];
    
    if (self) {
        if (!key || [key isEqualToString:@""]) {
            XENDLog(@"ERROR :: Weather manager does not have a valid API key");
        }
        
        // Internal dependencies
        self.apiKey = key;
        self.delegate = delegate;
        self.locationManager = locationManager;
        
        // Initial cache states
        self.networkIsDisconnected = NO;
        self.dailyPredictionCache = @[];
        self.hourlyPredictionCache = @[];
        self.observationCache = [[XTWCObservation alloc] initWithFakeData:[self _units]];
        self.airQualityCache = [[XTWCAirQualityObservation alloc] initWithFakeData];
        self.metadataCache = @{
            @"address": [NSNull null],
            @"updated": [NSNull null],
            @"location": [NSNull null]
        };
        
        // Start update timer
        self.lastUpdateTime = nil;
        [self _restartUpdateTimerWithInterval:UPDATE_INTERVAL * 60];
        
        // Do initial refresh on startup
        [self refreshWeather];
        
        // Monitor for locale changes
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_localeChanged:) name:NSCurrentLocaleDidChangeNotification object:nil];
        
        // Notification from location manager about authorisation changes
        [self.locationManager addAuthorisationStatusListener:^(BOOL available) {
            XENDLog(@"Refreshing weather due to location authorisation changes");
            [self refreshWeather];
        }];
    }
    
    return self;
}

#pragma mark Update state management

- (void)networkWasDisconnected {
    XENDLog(@"networkWasDisconnected");
    self.networkIsDisconnected = YES;
}

- (void)networkWasConnected {
    XENDLog(@"networkWasConnected");
    self.networkIsDisconnected = NO;
    
    // Undertake a refresh if one was queued
    if (self.refreshQueuedDuringNetworkDisconnected) {
        [self refreshWeather];
        self.refreshQueuedDuringNetworkDisconnected = NO;
    }
}

- (void)pauseUpdateTimer {
    self.timerIsPaused = YES;
    
    XENDLog(@"Pausing weather update timer");
    [self.updateTimer invalidate];
    self.updateTimer = nil;
}

- (void)restartUpdateTimer {
    self.timerIsPaused = NO;
    
    // Restarting timer as needed.
    NSTimeInterval nextFireInterval = [self.nextUpdateTime timeIntervalSinceDate:[NSDate date]];
    
    if (nextFireInterval <= 5) { // seconds
        XENDLog(@"Timer would have (or is about to) expire, so requesting update");
        [self refreshWeather];
    } else {
        // Restart the timer for this remaining interval
        XENDLog(@"Restarting weather update timer, with interval: %f minutes", (float)nextFireInterval / 60.0);
        [self _restartUpdateTimerWithInterval:nextFireInterval];
    }
}

- (void)_restartUpdateTimerWithInterval:(NSTimeInterval)interval {
    // Needs to be scheduled on the main thread
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.updateTimer) {
            [self.updateTimer invalidate];
            self.updateTimer = nil;
        }
        
        XENDLog(@"Restarting weather update timer with interval: %f minutes", (float)interval / 60.0);
        
        self.updateTimer = [NSTimer scheduledTimerWithTimeInterval:interval
                                                            target:self
                                                          selector:@selector(_updateTimerFired:)
                                                          userInfo:nil
                                                           repeats:NO];
        
        self.nextUpdateTime = [[NSDate date] dateByAddingTimeInterval:interval];
    });
}

- (void)_updateTimerFired:(NSTimer*)timer {
    XENDLog(@"*** DEBUG :: Update timer fired");
    [self refreshWeather];
}

- (void)_localeChanged:(NSNotification*)notification {
    // Ask cached data to reload their units
    XENDLog(@"*** [INFO] :: Locale did change, reloading...");
    
    struct XTWCUnits units = [self _units];
    
    if (self.observationCache) {
        [self.observationCache reloadForUnitsChanged:units];
    }
    
    if (self.dailyPredictionCache) {
        for (XTWCDailyForecast *forecast in self.dailyPredictionCache) {
            [forecast reloadForUnitsChanged:units];
        }
    }
    
    if (self.nightlyPredictionCache) {
        for (XTWCDailyForecast *forecast in self.nightlyPredictionCache) {
            [forecast reloadForUnitsChanged:units];
        }
    }
    
    if (self.hourlyPredictionCache) {
        for (XTWCHourlyForecast *forecast in self.hourlyPredictionCache) {
            [forecast reloadForUnitsChanged:units];
        }
    }
    
    // Post update
    NSDictionary *parsed = [self parseWeatherData:@{} airQualityData:@{} metadata:@{} updateCache:NO];
    [self.delegate onUpdatedWeatherConditions:parsed];
}

#pragma mark Update implementation

- (void)refreshWeather {
    // Queue if no network, and update from cached data for now
    if (self.networkIsDisconnected) {
        XENDLog(@"Weather update queued during network disconnection");
        self.refreshQueuedDuringNetworkDisconnected = YES;
        
        // Notify delegate of updates from cached data
        NSDictionary *parsed = [self parseWeatherData:@{} airQualityData:@{} metadata:@{} updateCache:NO];
        [self.delegate onUpdatedWeatherConditions:parsed];
        
        return;
    }
    
    XENDLog(@"Refreshing weather...");
    
    [self _doRefreshWeatherWithCompletion:^{
        // Restart the update timer with the full interval
        [self _restartUpdateTimerWithInterval:UPDATE_INTERVAL * 60];
    }];
}

- (void)_doRefreshWeatherWithCompletion:(void(^)(void))completionHandler {
    
    // 1. Get current location from the location manager
    [self.locationManager fetchCurrentLocationWithCompletionHandler:^(NSError *error, CLLocation *location) {
        if (error && error.code == kXENLocationErrorNotInitialised) {
            XENDLog(@"WARN :: Waiting for location manager to gain an authorisation stataus");
            completionHandler();
            return;
        }
        
        if (error && error.code == kXENLocationErrorNotAvailable) {
            location = [self.delegate fallbackWeatherLocation];
        }
        
        if (error && error.code == kXENLocationErrorCachedOnly) {
            XENDLog(@"WARN :: Using old location fix, might be inaccurate");
        }
        
        if (!error) {
            XENDLog(@"DEBUG :: Got new location fix");
        }
        
        // 2. Create necessary requests for forecast and air quality
        
        NSURLRequest *forecastRequest = [self urlRequestForForecast:location];
        NSURLRequest *airQualityRequest = [self urlRequestForAirQuality:location];
        
        // 3. Wait for them to succeed
        NSURLSession *session = [NSURLSession sharedSession];
        
        __block NSDictionary *forecastData = nil;
        __block NSDictionary *airQualityData = nil;
        __block NSDictionary *addressData = nil;
        
        dispatch_group_t serviceGroup = dispatch_group_create();

        dispatch_group_enter(serviceGroup);
        NSURLSessionDataTask *forecastTask = [session dataTaskWithRequest:forecastRequest
                                                        completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
            if (!error) {
                NSError *parseError;
                forecastData = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&parseError];
                
                if (parseError) {
                    XENDLog(@"ERROR (forecast download) :: %@", parseError);
                }
            } else {
                XENDLog(@"ERROR (forecast download) :: %@", error);
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
                    XENDLog(@"ERROR (air download) :: %@", parseError);
                }
            } else {
                XENDLog(@"ERROR (air download) :: %@", error);
            }
            
            // Exit dispatch group
            dispatch_group_leave(serviceGroup);
        }];
        [airQualityTask resume];
        
        dispatch_group_enter(serviceGroup);
        [self.locationManager reverseGeocodeLocation:location completionHandler:^(NSDictionary *data, NSError *error) {
            if (!error) {
                addressData = data;
            }
            
            // Exit dispatch group
            dispatch_group_leave(serviceGroup);
        }];
        
        dispatch_group_notify(serviceGroup, dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),^{
            // 3.a. Setup metadata object
            NSDictionary *metadata = @{
                @"address": addressData != nil ? addressData : [NSNull null],
                @"updated": [NSDate date],
                @"location": location != nil ? location : [NSNull null]
            };
            
            // 4. Now that downloads are done, parse the downloaded data
            @try {
                NSDictionary *parsed = [self parseWeatherData:forecastData
                                               airQualityData:airQualityData
                                                  metadata:metadata
                                                  updateCache:YES];
                
                // 5. Notify delegate of new parsed data
                [self.delegate onUpdatedWeatherConditions:parsed];
            } @catch (NSException *e) {
                XENDLog(@"ERROR (weather parsing) :: %@", e);
                XENDLog(@"%@", e.callStackSymbols);
                XENDLog(@"Weather data: %@", forecastData);
                XENDLog(@"Air data: %@", airQualityData);
            }

            
            // 6. Finish off
            completionHandler();
        });

    }];
}

- (NSString*)_deviceLanguage {
    NSString *firstLanguage = [[NSLocale preferredLanguages] objectAtIndex:0];
    
    if ([[self supportedLongCodes] containsObject:firstLanguage]) {
        return firstLanguage;
    } else if ([[self supportedShortCodes] containsObject:firstLanguage]) {
        return firstLanguage;
    } else if ([[self supportedShortCodes] containsObject:[firstLanguage substringToIndex:2]]) {
        return [firstLanguage substringToIndex:2];
    }
    
    // Fallback to English
    return @"en";
}

- (BOOL)_useMetricWeather {
    if (@available(iOS 10, *)) {
        return [[[NSLocale currentLocale] objectForKey:NSLocaleTemperatureUnit] isEqualToString:@"Celsius"];
    } else {
        return [self _useMetric];
    }
}

- (BOOL)_useMetric {
    return [[[NSLocale currentLocale] objectForKey:NSLocaleUsesMetricSystem] boolValue];
}

- (NSURLRequest*)urlRequestForForecast:(CLLocation*)location {
    // https://api.weather.com/v1/geocode/<lat>/<lon>/aggregate.json?
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

- (NSDictionary*)parseWeatherData:(NSDictionary*)forecastData
                   airQualityData:(NSDictionary*)airQualityData
                         metadata:(NSDictionary*)metadata
                      updateCache:(BOOL)updateCache {
    if (updateCache)
        [self updateForecastCache:forecastData
                                 :airQualityData
                                 :metadata];
    
    struct XTWCUnits units = [self _units];
    
    return @{
        @"units": @{
            @"isMetric": [NSNumber numberWithBool:[self _useMetric]],
            @"temperature": units.temperature == METRIC ? @"C" : @"F",
            @"speed": units.speed == METRIC ? @"km/h" : @"mph",
            @"distance": units.distance == METRIC ? @"km" : @"mile",
            @"pressure": units.pressure == METRIC ? @"hPa" : @"inHg",
            @"amount": units.amount == METRIC ? @"cm" : @"in",
        },
        @"now": [self nowFieldFromCache],
        @"hourly": [self hourlyFieldFromCache],
        @"daily": [self dailyFieldFromCache],
        @"nightly": [self nightlyFieldFromCache],
        @"metadata": @{
            @"address": ![[self.metadataCache objectForKey:@"address"] isEqual:[NSNull null]] ?
                            [self.metadataCache objectForKey:@"address"] :
                            @{
                                @"house": @"",
                                @"street": @"",
                                @"neighbourhood": @"",
                                @"city": @"",
                                @"postalCode": @"",
                                @"county": @"",
                                @"state": @"",
                                @"country": @"",
                                @"countryISOCode": @""
                            },
            @"updateTimestamp": [NSNumber numberWithLong:[(NSDate*)[self.metadataCache objectForKey:@"updated"] timeIntervalSince1970] * 1000],
            @"location": ![[self.metadataCache objectForKey:@"location"] isEqual:[NSNull null]] ?
                            @{
                                @"latitude": [NSNumber numberWithDouble:
                                              [(CLLocation*)[self.metadataCache objectForKey:@"location"] coordinate].latitude],
                                @"longitude": [NSNumber numberWithDouble:
                                              [(CLLocation*)[self.metadataCache objectForKey:@"location"] coordinate].longitude],
                            } :
                            @{
                                @"latitude": @0.0,
                                @"longitude": @0.0
                            }
        }
    };
}

- (struct XTWCUnits)_units {
    struct XTWCUnits units;
    
    BOOL isHybridBritish = [[self _deviceLanguage] isEqualToString:@"en-GB"] ||
                           [[self _deviceLanguage] isEqualToString:@"en_GB"] ||
                           [[self _deviceLanguage] isEqualToString:@"en-AU"] ||
                           [[self _deviceLanguage] isEqualToString:@"en_AU"];
    
    XENDLog(@"Checking locale: %@, isMetric: %d, isMetricWeather: %d, isHybridBritish: %d", [self _deviceLanguage], [self _useMetric], [self _useMetricWeather], isHybridBritish);
    
    if (isHybridBritish) {
        units.speed = IMPERIAL;
        units.temperature = [self _useMetricWeather] ? METRIC : IMPERIAL;
        units.distance = IMPERIAL;
        units.pressure = METRIC;
        units.amount = METRIC;
    } else {
        units.speed = [self _useMetric] ? METRIC : IMPERIAL;
        units.temperature = [self _useMetricWeather] ? METRIC : IMPERIAL;
        units.distance = [self _useMetric] ? METRIC : IMPERIAL;
        units.pressure = [self _useMetric] ? METRIC : IMPERIAL;
        units.amount = [self _useMetric] ? METRIC : IMPERIAL;
    }
    
    return units;
}

- (void)updateForecastCache:(NSDictionary*)forecastData
                           :(NSDictionary*)airQualityData
                           :(NSDictionary*)metadata {
    struct XTWCUnits units = [self _units];
    
    // Observation
    if (forecastData) {
        NSDictionary *observationData = [[forecastData objectForKey:@"conditionsshort"] objectForKey:@"observation"];
        XTWCObservation *observation = [[XTWCObservation alloc] initWithData:observationData units:units];
        
        self.observationCache = observation;

        // Daily forecasts
        
        NSMutableArray *dailyCache = [@[] mutableCopy];
        NSArray *predictions = [[forecastData objectForKey:@"fcstdaily10short"] objectForKey:@"forecasts"];
        for (NSDictionary *data in predictions) {
            XTWCDailyForecast *prediction = [[XTWCDailyForecast alloc] initWithData:data units:units];
            [dailyCache addObject:prediction];
        }
        
        self.dailyPredictionCache = dailyCache;
        
        // Nightly forecasts
        NSMutableArray *nightlyCache = [@[] mutableCopy];
        for (NSDictionary *data in predictions) {
            XTWCDailyForecast *prediction = [[XTWCDailyForecast alloc] initWithData:data units:units];
            [prediction overrideToNight:YES];
            [nightlyCache addObject:prediction];
        }
        
        self.nightlyPredictionCache = nightlyCache;
        
        // Hourly forecasts
        NSMutableArray *hourlyCache = [@[] mutableCopy];
        NSArray *hourlyPredictions = [[forecastData objectForKey:@"fcsthourly24short"] objectForKey:@"forecasts"];
        for (NSDictionary *data in hourlyPredictions) {
            XTWCHourlyForecast *prediction = [[XTWCHourlyForecast alloc] initWithData:data units:units];
            [hourlyCache addObject:prediction];
        }
        
        self.hourlyPredictionCache = hourlyCache;
    }
    
    // Air quality
    if (airQualityData) {
        NSArray *airqualitySingleItemArray = [airQualityData objectForKey:@"globalairquality"];
        NSDictionary *airqualityDataItem = @{};
        if (airqualitySingleItemArray.count > 0)
            airqualityDataItem = airqualitySingleItemArray[0];
        
        XTWCAirQualityObservation *airQualityObservation = [[XTWCAirQualityObservation alloc]
                                                                initWithData:airqualityDataItem];
        self.airQualityCache = airQualityObservation;
    }

    self.metadataCache = metadata;
}

- (BOOL)_validateObservation:(XTWCObservation*)observation {
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    return observation.validFromUNIXTime + (60 * 60 * 24) >= now;
}

- (XTWCDailyForecast*)_cachedDailyPredictionForNow {
    // From cached data, fetch the daily prediction that is for today
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    
    // TODO: Factor in GMT offset
    for (XTWCDailyForecast *prediction in self.dailyPredictionCache) {
        if (prediction.validUNIXTime <= now &&
            prediction.validUNIXTime + (60 * 60 * 24) > now)
            return prediction;
    }
    
    return [self.dailyPredictionCache count] > 0 ? [self.dailyPredictionCache firstObject] : nil;
}

- (NSArray*)_cachedDailyPredictionSinceNow {
    // From cached data, fetch the predictions that include and follow today's
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    
    NSMutableArray *result = [NSMutableArray array];
    
    // TODO: Factor in GMT offset to validUNIXTime
    for (XTWCDailyForecast *prediction in self.dailyPredictionCache) {
        if (prediction.validUNIXTime + (60 * 60 * 24) > now)
            [result addObject:prediction];
    }
    
    return result;
}

- (NSArray*)_cachedNightlyPredictionSinceNow {
    // From cached data, fetch the predictions that include and follow today's
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    
    NSMutableArray *result = [NSMutableArray array];
    
    // TODO: Factor in GMT offset to validUNIXTime?
    for (XTWCDailyForecast *prediction in self.nightlyPredictionCache) {
        if (prediction.validUNIXTime + (60 * 60 * 24) > now)
            [result addObject:prediction];
    }
    
    return result;
}

- (NSArray*)_cachedHourlyPredictionSinceNow {
    // From cached data, fetch the predictions that include and follow the current hour
    uint64_t now = [[NSDate date] timeIntervalSince1970];
    
    NSMutableArray *result = [NSMutableArray array];
    
    // TODO: Factor in GMT offset to validUNIXTime
    for (XTWCHourlyForecast *prediction in self.hourlyPredictionCache) {
        if (prediction.validUNIXTime + (60 * 60) > now)
            [result addObject:prediction];
    }
    
    return result;
}

- (NSDictionary*)nowFieldFromCache {
    
    XTWCObservation *observation = self.observationCache;
    XTWCAirQualityObservation *airQuality = self.airQualityCache;
    XTWCDailyForecast *prediction = [self _cachedDailyPredictionForNow];
    
    // Validate the observation
    BOOL isObservationValid = [self _validateObservation:observation];
    
    // Figure out if its currently daytime
    NSDate *nowDate = [NSDate date];
    NSDate *sunriseDate = [self dateFromISO8601String:prediction.sunRiseISOTime];
    NSDate *sunsetDate = [self dateFromISO8601String:prediction.sunSetISOTime];
    
    BOOL isDayTime = [nowDate compare:sunriseDate] == NSOrderedDescending &&
                     [nowDate compare:sunsetDate] == NSOrderedAscending;
    
    // See: https://www.worldcommunitygrid.org/lt/images/climate/The_Weather_Company_APIs.pdf
    // This includes full descriptions for every field for documentation
    NSDictionary *now = @{
        @"isValid": [NSNumber numberWithBool:isObservationValid],
        
        @"airQuality": @{
            @"categoryLevel": airQuality.categoryLevel,
            @"categoryIndex": airQuality.categoryIndex,
            @"comment": airQuality.comment,
            @"index": airQuality.index,
            @"scale": airQuality.scale,
            @"source": airQuality.source,
            @"pollutants": airQuality.pollutants
        },
        
        @"cloudCoverPercentage": prediction ? prediction.cloudCoverPercentage : @0,
        
        @"condition": @{
            @"code": observation.conditionIcon,
            @"description": observation.conditionDescription,
        },
        
        @"precipitation": @{
            @"hourly": observation.precipHourly,
            @"total": observation.precipTotal,
            @"type": prediction ? prediction.precipType : @"rain",
        },
        
        @"pressure": @{
            @"current": observation.pressure,
            @"description": observation.pressureDescription,
            @"tendency": observation.pressureTendency,
        },
        
        @"moon": @{
            @"phaseDay": prediction ? prediction.lunarPhaseDay : [NSNull null],
            @"phaseCode": prediction ? prediction.lunarPhaseCode : [NSNull null],
            @"phaseDescription": prediction ? prediction.lunarPhaseDescription : [NSNull null],
            // TODO: This fails if the next moonrise is actually e.g. 1am the next day
            @"moonrise": prediction ? prediction.moonRiseISOTime : [NSNull null],
            @"moonset": prediction ? prediction.moonSetISOTime : [NSNull null],
        },
        
        @"sun": @{
            @"sunset": prediction ? prediction.sunSetISOTime : [NSNull null],
            @"sunrise": prediction ? prediction.sunRiseISOTime : [NSNull null],
            @"isDay": [NSNumber numberWithBool:isDayTime]
        },
        
        @"temperature": @{
            @"current": observation.temperature,
            @"dewpoint": observation.dewpoint,
            @"feelsLike": observation.feelsLike,
            @"maximum": prediction ? prediction.maxTemp : [NSNull null],
            @"minimum": prediction ? prediction.minTemp : [NSNull null],
            @"maximumLast24Hours": observation.maxTemp,
            @"minimumLast24Hours": observation.minTemp,
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

- (NSArray*)_dailyItemsFromArray:(NSArray*)predictions {
    NSMutableArray *result = [NSMutableArray array];
    
    for (XTWCDailyForecast *prediction in predictions) {
        
        NSDictionary *item = @{
            @"cloudCoverPercentage": prediction.cloudCoverPercentage,
            @"timestamp": [NSNumber numberWithLongLong:(long long)prediction.validUNIXTime * 1000],
            
            @"condition": @{
                @"code": prediction.conditionIcon,
                @"description": prediction.conditionDescription,
            },
            
            @"dayOfWeek": prediction.dayOfWeek,
            @"dayIndex": prediction.forecastDayIndex,
            
            @"moon": @{
                @"phaseCode": prediction.lunarPhaseCode,
                @"phaseDay": prediction.lunarPhaseDay,
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

- (NSArray*)dailyFieldFromCache {
    NSArray *predictions = [self _cachedDailyPredictionSinceNow];
    NSMutableArray *result = [NSMutableArray array];
    
    for (XTWCDailyForecast *prediction in predictions) {
        
        NSDictionary *item = @{
            @"cloudCoverPercentage": prediction.cloudCoverPercentage,
            @"timestamp": [NSNumber numberWithLongLong:(long long)prediction.validUNIXTime * 1000],
            
            @"condition": @{
                @"code": prediction.conditionIcon,
                @"description": prediction.conditionDescription,
            },
            
            @"dayOfWeek": prediction.dayOfWeek,
            @"weekdayNumber": prediction.weekdayNumber,
            
            @"moon": @{
                @"phaseCode": prediction.lunarPhaseCode,
                @"phaseDay": prediction.lunarPhaseDay,
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

- (NSArray*)nightlyFieldFromCache {
    NSArray *predictions = [self _cachedNightlyPredictionSinceNow];
    NSMutableArray *result = [NSMutableArray array];
    
    for (XTWCDailyForecast *prediction in predictions) {
        
        NSDictionary *item = @{
            @"cloudCoverPercentage": prediction.cloudCoverPercentage,
            
            @"condition": @{
                @"code": prediction.conditionIcon,
                @"description": prediction.conditionDescription,
            },
            
            @"moon": @{
                @"phaseCode": prediction.lunarPhaseCode,
                @"phaseDay": prediction.lunarPhaseDay,
                @"phaseDescription": prediction.lunarPhaseDescription,
                @"moonrise": prediction.moonRiseISOTime,
                @"moonset": prediction.moonSetISOTime
            },
            
            @"precipitation": @{
                @"probability": prediction.precipProbability,
                @"type": prediction.precipType,
            },
            
            @"temperature": @{
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

- (NSArray*)hourlyFieldFromCache {
    NSMutableArray *result = [NSMutableArray array];
    
    NSArray *predictions = [self _cachedHourlyPredictionSinceNow];
    for (XTWCHourlyForecast *prediction in predictions) {
        
        NSDictionary *item = @{
            @"condition": @{
                @"code": prediction.conditionIcon,
                @"description": prediction.conditionDescription,
            },
            
            @"dayOfWeek": prediction.dayOfWeek,
            @"hourIndex": prediction.forecastHourIndex,
			@"dayIndicator": prediction.dayIndicator,
            @"timestamp": [NSNumber numberWithLongLong:(long long)prediction.validUNIXTime * 1000],
            
            @"precipitation": @{
                @"probability": prediction.precipProbability,
                @"type": prediction.precipType,
            },
            
            @"temperature": @{
                @"forecast": prediction.temperature,
                @"dewpoint": prediction.dewpoint,
                @"feelsLike": prediction.feelsLike,
                @"relativeHumidity": prediction.relativeHumidity,
                @"heatIndex": prediction.heatIndex
            },
            
            @"ultraviolet": @{
                @"index": prediction.uvIndex,
                @"description": prediction.uvDescription,
            },
            
            @"visibility": prediction.visibility,
            
            @"wind": @{
                @"degrees": prediction.windDirection,
                @"cardinal": prediction.windDirectionCardinal,
                @"gust": prediction.gust,
                @"speed": prediction.windSpeed,
            }
        };
        
        [result addObject:item];
    }
    
    return result;
}

- (NSDate*)dateFromISO8601String:(NSString*)input {
    static NSDateFormatter *formatter;
    if (!formatter) {
        formatter = [[NSDateFormatter alloc] init];
        
        [formatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZ"];
        
        // Always use this locale when parsing fixed format date strings
        NSLocale *posix = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US_POSIX"];
        [formatter setLocale:posix];
    }
    
    return [formatter dateFromString:input];
}

#pragma mark Supported language codes

- (NSArray*)supportedLongCodes {
    return @[
        @"ar-AE", @"bn-BD", @"bn-IN", @"ca-ES", @"cs-CZ",
        @"da-DK", @"de-DE", @"de-CH", @"el-GR", @"en-GB",
        @"en-AU", @"en-IN", @"en-US", @"es-AR", @"es-ES",
        @"es-US", @"es-LA", @"es-MX", @"es-UN", @"fa-IR",
        @"fi-FI", @"fr-CA", @"fr-FR", @"fr-CH", @"he-IL",
        @"hi-IN", @"hr-HR", @"hu-HU", @"in-ID", @"it-IT",
        @"it-CH", @"iw-IL", @"ja-JP", @"kk-KZ", @"ko-KR",
        @"ms-MY", @"nl-NL", @"no-NO", @"nn-NO", @"pl-PL",
        @"pt-BR", @"pt-PT", @"ro-RO", @"ru-RU", @"sk-SK",
        @"sv-SE", @"th-TH"
    ];
}

- (NSArray*)supportedShortCodes {
    return @[
        @"ar", @"bn", @"ca", @"cs", @"da",
        @"de", @"el", @"en", @"es", @"fa",
        @"fi", @"fr", @"he", @"hi", @"hr",
        @"hu", @"in", @"it", @"iw", @"ja",
        @"kk", @"ko", @"ms", @"nl", @"no",
        @"nn", @"pl", @"pt", @"ro", @"ru",
        @"sk", @"sv", @"th"
    ];
}

@end
