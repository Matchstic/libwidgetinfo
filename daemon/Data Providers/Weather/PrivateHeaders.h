//
//  PrivateHeaders.h
//  libwidgetdata
//
//  Created by Matt Clarke on 23/11/2019.
//

// Weather.framework

@interface City : NSObject

@property (copy) id location;
@property (nonatomic, strong) id wfLocation;
@property (nonatomic) bool isLocalWeatherCity;

@end

@interface WeatherCloudPersistence : NSObject
+ (id)cloudPersistenceWithDelegate:(id)arg1;
@end

@interface WeatherCloudPreferences : NSObject
- (id)initWithLocalPreferences:(id)arg1 persistence:(id)arg2;
- (id)citiesByEnforcingSizeLimitOnResults:(id)arg1;
@end

@interface WeatherPreferences : NSObject

+ (instancetype)sharedPreferences;
- (id)localWeatherCity;
- (id)loadSavedCities;
- (WeatherCloudPreferences *)cloudPreferences;
- (City*)cityFromPreferencesDictionary:(id)arg1;

@end

@interface TWCLocationUpdater : NSObject
+ (instancetype)sharedLocationUpdater;
- (void)updateWeatherForLocation:(id)arg1 city:(id)arg2;
@end

// WeatherFoundation.framework

// iOS 13
@interface WFWeatherChannelRequestFormatterV2 : NSObject

// Adds the Weather.com API key to an NSURLQueryItem
+ (id)forecastRequest:(unsigned long long)arg2 forLocation:(id)arg3 locale:(id)arg4 date:(id)arg5 rules:(id)arg6;

@end

// iOS 10 - 12
@interface WFWeatherChannelRequestFormatter : NSObject
+ (id)forecastRequestForLocation:(id)arg1 date:(id)arg2;
@end

// iOS 10+
@interface WFLocation : NSObject
- (id)init;
- (void)setGeoLocation:(id /* CLLocation */)arg1;
@end
