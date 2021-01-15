/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
**/

// Weather.framework

#import <CoreLocation/CoreLocation.h>

@interface WFTemperature : NSObject

@property (nonatomic) double celsius;
@property (nonatomic) double fahrenheit;
@property (nonatomic) double kelvin;

- (id)init;
// 0 - celsius, 1 - farenheit, 2 - kelvin
- (id)initWithTemperatureUnit:(int)arg1 value:(double)arg2;

@end

@interface WADayForecast : NSObject

@property (nonatomic,copy) WFTemperature * high;
@property (nonatomic,copy) WFTemperature * low;
@property (assign,nonatomic) unsigned long long icon;
@property (assign,nonatomic) unsigned long long dayOfWeek;
@property (assign,nonatomic) unsigned long long dayNumber;

@end

@interface WAHourlyForecast : NSObject <NSCopying>

@property (nonatomic,copy) NSString * time;
@property (assign,nonatomic) long long hourIndex;
@property (nonatomic,retain) WFTemperature * temperature;
@property (nonatomic,copy) NSString * forecastDetail;
@property (assign,nonatomic) long long conditionCode;
@property (assign,nonatomic) float percentPrecipitation;

@end

@interface City : NSObject

@property (copy) id location;
@property (nonatomic, strong) id wfLocation;
@property (nonatomic) bool isLocalWeatherCity;

- (void)setAirQualityCategory:(NSNumber*)arg1;
- (void)setAirQualityIdx:(NSNumber*)arg1;
- (void)setConditionCode:(long long)arg1;
- (void)setCoordinate:(CLLocationCoordinate2D)arg1;
- (void)setDayForecasts:(NSArray<WADayForecast*>*)arg1;
- (void)setDewPoint:(float)arg1;
- (void)setFeelsLike:(WFTemperature*)arg1;
- (void)setFullName:(NSString*)arg1;
- (void)setHeatIndex:(float)arg1;
- (void)setHourlyForecasts:(NSArray<WAHourlyForecast*>*)arg1;
- (void)setHumidity:(float)arg1;
- (void)setIsDay:(bool)arg1;
- (void)setLatitude:(double)arg1;
- (void)setLongitude:(double)arg1;
- (void)setMoonPhase:(unsigned long long)arg1;
- (void)setObservationTime:(unsigned long long)arg1;
- (void)setPrecipitationPast24Hours:(double)arg1;
- (void)setPressure:(float)arg1;
- (void)setPressureRising:(unsigned long long)arg1;
- (void)setSunriseTime:(unsigned long long)arg1;
- (void)setSunsetTime:(unsigned long long)arg1;
- (void)setTemperature:(WFTemperature*)arg1;
- (void)setUVIndex:(unsigned long long)arg1;
- (void)setVisibility:(float)arg1;
- (void)setWindChill:(float)arg1;
- (void)setWindDirection:(float)arg1;
- (void)setWindSpeed:(float)arg1;
- (void)setUpdateTime:(NSDate *)arg1;
- (void)setTimeZone:(NSTimeZone *)arg1;
- (void)setTimeZoneUpdateDate:(NSDate *)arg1;

- (id)naturalLanguageDescription;
- (id)naturalLanguageDescriptionWithDescribedCondition:(out long long*)arg1;

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

// Adds the Weather.com API key to an NSURLQueryItem
@interface WFWeatherChannelRequestFormatterV2 : NSObject

// iOS 14.3
+ (id)forecastRequest:(unsigned long long)arg1 forLocation:(id)arg2 withUnits:(int)arg3 locale:(id)arg4 date:(id)arg5 rules:(id)arg6 options:(id)arg6;

// iOS 14.0
+ (id)forecastRequest:(unsigned long long)arg1 forLocation:(id)arg2 withUnits:(int)arg3 locale:(id)arg4 date:(id)arg5 rules:(id)arg6;

// iOS 13
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
