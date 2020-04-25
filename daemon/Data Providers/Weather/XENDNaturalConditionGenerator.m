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
        
        NSCalendar *calendar = [NSCalendar currentCalendar];
        [calendar setTimeZone:[NSTimeZone timeZoneWithName:@"UTC"]];
        
        for (int i = 0; i < hourForecasts.count; i++) {
            XTWCHourlyForecast *model = [hourForecasts objectAtIndex:i];
            
            WAHourlyForecast *forecast = [[objc_getClass("WAHourlyForecast") alloc] init];
            
            forecast.hourIndex = i;
            forecast.temperature = [self temperatureForValue:model.temperature units:units];
            forecast.conditionCode = model.conditionIcon.longLongValue;
            forecast.percentPrecipitation = model.precipProbability.floatValue;
            
            NSDate *time = [NSDate dateWithTimeIntervalSince1970:model.validUNIXTime];
            NSDateComponents *forecastComponents = [calendar components:NSCalendarUnitHour fromDate:time];
            forecast.time = forecastComponents.hour > 0 ? [NSString stringWithFormat:@"%2.ld:00", (long)forecastComponents.hour] : @"00:00";
            
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
                                    sunrise:(NSString*)sunrise
                                     sunset:(NSString*)sunset
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

        NSDateComponents *sunriseComponents = [self localTimezoneDateComponentsForString:sunrise];
        NSString *formattedSunrise = [NSString stringWithFormat:@"%ld%@%ld", (long)sunriseComponents.hour, sunriseComponents.minute < 10 ? @"0" : @"", (long)sunriseComponents.minute];
        
        NSDateComponents *sunsetComponents = [self localTimezoneDateComponentsForString:sunset];
        NSString *formattedSunset = [NSString stringWithFormat:@"%ld%@%ld", (long)sunsetComponents.hour, sunsetComponents.minute < 10 ? @"0" : @"", (long)sunsetComponents.minute];
        
        [city setSunriseTime:atol([formattedSunrise UTF8String])];
        [city setSunsetTime:atol([formattedSunset UTF8String])];
        
        // Observation time
        NSDateComponents *observationComponents = [self localObservationDateComponentsWithSample:sunset];
        
        NSString *formattedObservation = [NSString stringWithFormat:@"%ld%@%ld", (long)observationComponents.hour, observationComponents.minute < 10 ? @"0" : @"", (long)observationComponents.minute];
        
        [city setObservationTime:atol([formattedObservation UTF8String])];
        [city setUpdateTime:[NSDate date]];
        [city setTimeZone:[self timezoneFromSample:sunset]];
        [city setTimeZoneUpdateDate:[NSDate date]];
        
        [city setTemperature:[self temperatureForValue:observation.temperature units:units]];
        [city setUVIndex:observation.uvIndex.longLongValue];
        [city setVisibility:observation.visibility.floatValue];
        [city setWindChill:observation.windChill.floatValue];
        [city setWindDirection:observation.windDirection.floatValue];
        [city setWindSpeed:observation.windSpeed.floatValue];
        
        if ([city respondsToSelector:@selector(naturalLanguageDescriptionWithDescribedCondition:)]) {
            long long describedCondition = 0;
            return [city naturalLanguageDescriptionWithDescribedCondition:&describedCondition];
        } else
            return @"";
    } else return @"";
}

- (NSDateComponents*)localTimezoneDateComponentsForString:(NSString*)dateString {
    NSDateComponents *components = [[NSDateComponents alloc] init];
    
    @try {
        NSString *timeComponent = [[dateString componentsSeparatedByString:@"T"] lastObject];
        NSArray *timeIndices = [timeComponent componentsSeparatedByString:@":"];
        
        components.hour = atol([[timeIndices objectAtIndex:0] UTF8String]);
        components.minute = atol([[timeIndices objectAtIndex:1] UTF8String]);
    } @catch (NSException *e) {
        components.hour = 0;
        components.minute = 0;
    }

    return components;
}

- (NSTimeZone*)timezoneFromSample:(NSString*)sampleString {
    @try {
        NSString *timeComponent = [[sampleString componentsSeparatedByString:@"T"] lastObject];
        NSArray *timeIndices = [timeComponent componentsSeparatedByString:@":"];
        NSString *timezone = [[timeIndices lastObject] substringFromIndex:2];
        
        BOOL positiveOffset = [timezone hasPrefix:@"+"];
        int offsetHours = atoi([[timezone substringWithRange:NSMakeRange(1, 2)] UTF8String]) * (positiveOffset ? 1 : -1);
        int offsetMinutes = atoi([[timezone substringWithRange:NSMakeRange(3, 2)] UTF8String]);
        
        int offsetSeconds = offsetMinutes * 60 + (offsetHours * 60 * 60);
        
        return [NSTimeZone timeZoneForSecondsFromGMT:offsetSeconds];
    } @catch (NSException *e) {
        return [NSTimeZone defaultTimeZone];
    }
}

- (NSDateComponents*)localObservationDateComponentsWithSample:(NSString*)sampleString {
    @try {
        NSString *timeComponent = [[sampleString componentsSeparatedByString:@"T"] lastObject];
        NSArray *timeIndices = [timeComponent componentsSeparatedByString:@":"];
        NSString *timezone = [[timeIndices lastObject] substringFromIndex:2];
        
        BOOL positiveOffset = [timezone hasPrefix:@"+"];
        int offsetHours = atoi([[timezone substringWithRange:NSMakeRange(1, 2)] UTF8String]) * (positiveOffset ? 1 : -1);
        int offsetMinutes = atoi([[timezone substringWithRange:NSMakeRange(3, 2)] UTF8String]);
        
        NSCalendar *calendar = [NSCalendar currentCalendar];
        [calendar setTimeZone:[NSTimeZone timeZoneWithName:@"UTC"]];
        NSDateComponents *observationComponents = [calendar components:NSCalendarUnitHour | NSCalendarUnitMinute fromDate:[NSDate date]];
        
        observationComponents.hour += offsetHours;
        if (observationComponents.hour >= 24) observationComponents.hour -= 24;
        observationComponents.minute += offsetMinutes;
        
        return observationComponents;
    } @catch (NSException *e) {
        NSDateComponents *components = [[NSDateComponents alloc] init];
        
        components.hour = 0;
        components.minute = 0;
        
        return components;
    }

}

@end
