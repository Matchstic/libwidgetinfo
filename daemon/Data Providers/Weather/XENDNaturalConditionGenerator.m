//
//  XENDNaturalConditionGenerator.m
//  Daemon
//
//  Created by Matt Clarke on 19/04/2020.
//

#import "XENDNaturalConditionGenerator.h"
#import "PrivateHeaders.h"

#import "Model/XTWCHourlyForecast.h"
#import "Model/XTWCDailyForecast.h"

#import <objc/runtime.h>

@implementation XENDNaturalConditionGenerator

+ (instancetype)sharedInstance {
    static XENDNaturalConditionGenerator *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDNaturalConditionGenerator alloc] init];
    });
    
    return sharedInstance;
}

- (WFTemperature*)temperatureForValue:(NSNumber*)value units:(struct XTWCUnits)units {
    WFTemperature *temp = [[objc_getClass("WFTemperature") alloc] init];
    
    if (units.temperature == METRIC)
        [temp setCelsius:value.doubleValue];
    else
        [temp setFahrenheit:value.doubleValue];
        
    return temp;
}

- (NSArray*)dayForecastsFromModel:(NSArray*)dayForecasts units:(struct XTWCUnits)units {
    if (objc_getClass("WADayForecast")) {
        
        NSMutableArray *result = [NSMutableArray array];
        
        for (int i = 0; i < dayForecasts.count; i++) {
            XTWCDailyForecast *model = [dayForecasts objectAtIndex:i];
            
            WADayForecast *forecast = [[objc_getClass("WADayForecast") alloc] init];
            
            forecast.high = [self temperatureForValue:model.maxTemp units:units];
            forecast.low = [self temperatureForValue:model.minTemp units:units];
            forecast.icon = model.conditionIcon.longLongValue;
            forecast.dayOfWeek = model.weekdayNumber.longLongValue;
            forecast.dayNumber = model.forecastDayIndex.longLongValue;
            
            [result addObject:forecast];
        }
        
        return result;
        
    } else return @[];
}

- (NSArray*)hourForecastsFromModel:(NSArray*)hourForecasts units:(struct XTWCUnits)units {
    if (objc_getClass("WAHourlyForecast")) {
        
        NSMutableArray *result = [NSMutableArray array];
        
        for (int i = 0; i < hourForecasts.count; i++) {
            XTWCHourlyForecast *model = [hourForecasts objectAtIndex:i];
            
            WAHourlyForecast *forecast = [[objc_getClass("WAHourlyForecast") alloc] init];
            
            forecast.hourIndex = i;
            forecast.temperature = [self temperatureForValue:model.temperature units:units];
            forecast.conditionCode = model.conditionIcon.longLongValue;
            forecast.percentPrecipitation = model.precipProbability.floatValue;
            
            [result addObject:forecast];
        }
        
        return result;
        
    } else return @[];
}

- (NSString*)naturalConditionForObservation:(XTWCObservation*)observation
                               dayForecasts:(NSArray*)dayForecasts
                              hourForecasts:(NSArray*)hourForecasts
                                      isDay:(BOOL)isDay
                                   latitude:(double)latitude
                                  longitude:(double)longitude
                                    sunrise:(NSDate*)sunrise
                                     sunset:(NSDate*)sunset
                                      units:(struct XTWCUnits)units {
    
    // Setup a City instance from this observation
    if (objc_getClass("City") && objc_getClass("WFTemperature")) {
        City *city = [[objc_getClass("City") alloc] init];
        
        [city setConditionCode:observation.conditionIcon.longLongValue];
        [city setCoordinate:CLLocationCoordinate2DMake(latitude, longitude)];
        [city setDayForecasts:[self dayForecastsFromModel:dayForecasts units:units]];
        [city setDewPoint:observation.dewpoint.floatValue];
        [city setFeelsLike:[self temperatureForValue:observation.feelsLike units:units]];
        [city setHeatIndex:observation.heatIndex.floatValue];
        [city setHourlyForecasts:[self hourForecastsFromModel:hourForecasts units:units]];
        [city setHumidity:observation.relativeHumidity.floatValue];
        [city setLatitude:latitude];
        [city setLongitude:longitude];
        [city setPrecipitationPast24Hours:observation.precipTotal.doubleValue];
        [city setPressure:observation.pressure.floatValue];
        [city setPressureRising:observation.pressureTendency.longLongValue];
        [city setIsDay:isDay];
        
        NSCalendar *calendar = [NSCalendar currentCalendar];
        [calendar setTimeZone:[NSTimeZone timeZoneWithName:@"UTC"]];

        NSDateComponents *sunriseComponents = [calendar components:NSCalendarUnitHour | NSCalendarUnitMinute fromDate:sunrise];
        NSString *formattedSunrise = [NSString stringWithFormat:@"%ld%2.ld", (long)sunriseComponents.hour, (long)sunriseComponents.minute];
        
        NSDateComponents *sunsetComponents = [calendar components:NSCalendarUnitHour | NSCalendarUnitMinute fromDate:sunset];
        NSString *formattedSunset = [NSString stringWithFormat:@"%ld%2.ld", (long)sunsetComponents.hour, (long)sunsetComponents.minute];
        
        [city setSunriseTime:atol([formattedSunrise UTF8String])];
        [city setSunsetTime:atol([formattedSunset UTF8String])];
        
        // Observation time
        NSDateComponents *observationComponents = [calendar components:NSCalendarUnitHour | NSCalendarUnitMinute fromDate:[NSDate date]];
        
        NSString *formattedObservation = [NSString stringWithFormat:@"%ld%2.ld", (long)observationComponents.hour, (long)observationComponents.minute];
        
        [city setObservationTime:atol([formattedObservation UTF8String])];
        
        [city setTemperature:[self temperatureForValue:observation.temperature units:units]];
        [city setUVIndex:observation.uvIndex.longLongValue];
        [city setVisibility:observation.visibility.floatValue];
        [city setWindChill:observation.windChill.floatValue];
        [city setWindDirection:observation.windDirection.floatValue];
        [city setWindSpeed:observation.windSpeed.floatValue];
        
        return [city naturalLanguageDescription];
    } else return @"";
}

@end
