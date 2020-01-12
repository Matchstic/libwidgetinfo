//
//  TWCDailyForecast.m
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import "TWCDailyForecast.h"
#import "NSDictionary+XENSafeObjectForKey.h"

@interface TWCDayNightPart : NSObject

@property (nonatomic, strong) NSString *cloudCoverDescription;
@property (nonatomic, strong) NSNumber *conditionIcon;
@property (nonatomic, strong) NSString *conditionDescription;
@property (nonatomic, strong) NSString *dayIndicator;
@property (nonatomic, strong) NSNumber *heatIndex;
@property (nonatomic, strong) NSNumber *precipProbability;
@property (nonatomic, strong) NSString *precipProbabilityDescription;
@property (nonatomic, strong) NSString *precipType;
@property (nonatomic, strong) NSString *timeframeDescription;
@property (nonatomic, strong) NSNumber *relativeHumidity;
@property (nonatomic, strong) NSNumber *temperature;
@property (nonatomic, strong) NSString *uvDescription;
@property (nonatomic, strong) NSNumber *uvIndex;
@property (nonatomic, readwrite) uint64_t validUNIXTime;
@property (nonatomic, strong) NSNumber *windChill;
@property (nonatomic, strong) NSNumber *windDirection;
@property (nonatomic, strong) NSString *windDirectionCardinal;
@property (nonatomic, strong) NSNumber *windSpeed;

@end

@implementation TWCDayNightPart
@end

@interface TWCDailyForecast ()
@property (nonatomic, strong) TWCDayNightPart *day;
@property (nonatomic, strong) TWCDayNightPart *night;
@end

@implementation TWCDailyForecast

- (instancetype)initWithData:(NSDictionary*)data metric:(BOOL)useMetric {
    self = [super init];
    
    if (self) {
        [self _parseData:data metric:useMetric];
    }
    
    return self;
}

- (BOOL)isForecastCurrentDay {
    return [self.forecastDayIndex intValue] == 1;
}

- (void)_parseData:(NSDictionary*)data metric:(BOOL)useMetric {
    
    // Parse day/night specific information
    
    self.day = [self _parseDayNightPart:[data objectForKey:@"day" defaultValue:@{}] metric:useMetric];
    self.night = [self _parseDayNightPart:[data objectForKey:@"night" defaultValue:@{}] metric:useMetric];
    
    // Non-metricy stuff
    self.blurb = [data objectForKey:@"blurb" defaultValue:[NSNull null]];
    self.blurbAuthor = [data objectForKey:@"blurb_author" defaultValue:[NSNull null]];
    self.dayOfWeek = [data objectForKey:@"dow" defaultValue:[NSNull null]];
    self.expirationUNIXTime = [[data objectForKey:@"expire_time_gmt"] intValue];
    self.forecastDayIndex = [data objectForKey:@"num" defaultValue:[NSNull null]];
    self.lunarPhaseDay = [data objectForKey:@"lunar_phase_day" defaultValue:[NSNull null]];
    self.lunarPhaseDescription = [data objectForKey:@"lunar_phase" defaultValue:[data objectForKey:@"moon_phase" defaultValue:[NSNull null]]];
    self.lunarPhaseCode = [data objectForKey:@"lunar_phase_code" defaultValue:[data objectForKey:@"moon_phase_code" defaultValue:[NSNull null]]];
    self.moonRiseISOTime = [data objectForKey:@"moonrise" defaultValue:[NSNull null]];
    self.moonSetISOTime = [data objectForKey:@"moonset" defaultValue:[NSNull null]];
    self.narrative = [data objectForKey:@"narrative" defaultValue:[NSNull null]];
    self.snowForecast = [data objectForKey:@"snow_qpf" defaultValue:@0];
    self.snowPhrase = [data objectForKey:@"snow_phrase" defaultValue:[NSNull null]];
    self.snowRange = [data objectForKey:@"snow_range" defaultValue:[NSNull null]];
    self.stormLikelihood = [data objectForKey:@"stormcon" defaultValue:[NSNull null]];
    self.sunRiseISOTime = [data objectForKey:@"sunrise" defaultValue:[NSNull null]];
    self.sunSetISOTime = [data objectForKey:@"sunset" defaultValue:[NSNull null]];
    self.tornadoLikelihood = [data objectForKey:@"torcon" defaultValue:[NSNull null]];
    self.validUNIXTime = [[data objectForKey:@"fcst_valid"] intValue];
    
    // Parse units specific things
    NSDictionary *unitSpecificValues = useMetric ? [data objectForKey:@"metric"] : [data objectForKey:@"imperial"];
    
    self.maxTemp = [unitSpecificValues objectForKey:@"max_temp" defaultValue:[NSNull null]];
    self.minTemp = [unitSpecificValues objectForKey:@"min_temp" defaultValue:[NSNull null]];
}

- (TWCDayNightPart*)_parseDayNightPart:(NSDictionary*)data metric:(BOOL)useMetric {
    
    TWCDayNightPart *part = [[TWCDayNightPart alloc] init];
    
    // Handle all non-metricy stuff first
    part.cloudCoverDescription = [data objectForKey:@"clds" defaultValue:[NSNull null]];
    part.conditionIcon = [data objectForKey:@"icon_cd" defaultValue:[NSNull null]];
    part.conditionDescription = [data objectForKey:@"phrase_32char" defaultValue:[NSNull null]];
    part.dayIndicator = [data objectForKey:@"day_ind" defaultValue:[NSNull null]];
    part.precipProbability = [data objectForKey:@"pop" defaultValue:[NSNull null]];
    part.precipProbabilityDescription = [data objectForKey:@"pop_phrase" defaultValue:[NSNull null]];
    part.precipType = [data objectForKey:@"precip_type" defaultValue:@"rain"];
    part.timeframeDescription = [data objectForKey:@"qualifier" defaultValue:[NSNull null]];
    part.relativeHumidity = [data objectForKey:@"rh" defaultValue:[NSNull null]];
    part.uvDescription = [data objectForKey:@"uv_desc" defaultValue:[NSNull null]];
    part.uvIndex = [data objectForKey:@"uv_index" defaultValue:[NSNull null]];
    part.windDirection = [data objectForKey:@"wdir" defaultValue:[NSNull null]];
    part.windDirectionCardinal = [data objectForKey:@"wdir_cardinal" defaultValue:[NSNull null]];
    part.validUNIXTime = [[data objectForKey:@"fcst_valid"] intValue];
    
    // Parse units specific things
    NSDictionary *unitSpecificValues = useMetric ? [data objectForKey:@"metric"] : [data objectForKey:@"imperial"];
    
    if (unitSpecificValues) {
        part.heatIndex = [unitSpecificValues objectForKey:@"hi" defaultValue:[NSNull null]];
        part.temperature = [unitSpecificValues objectForKey:@"temp" defaultValue:[NSNull null]];
        part.windChill = [unitSpecificValues objectForKey:@"wc" defaultValue:[NSNull null]];
        part.windSpeed = [unitSpecificValues objectForKey:@"wspd" defaultValue:[NSNull null]];
    } else {
        part.heatIndex = @0;
        part.temperature = @0;
        part.windChill = @0;
        part.windSpeed = @0;
    }
    
    return part;
}

// Overriden getters for day/night parts
   
- (BOOL)_useDayPart {
    if (self.day.validUNIXTime == 0) return NO;
    
    return [[NSDate date] timeIntervalSince1970] < self.night.validUNIXTime &&
           [[NSDate date] timeIntervalSince1970] >= self.day.validUNIXTime;
}

- (NSString*)cloudCoverDescription {
    id result = [self _useDayPart] ? self.day.cloudCoverDescription : self.night.cloudCoverDescription;
    return result ? result : @"";
}

- (NSNumber*)conditionIcon {
    id result = [self _useDayPart] ? self.day.conditionIcon : self.night.conditionIcon;
    return result ? result : @0;
}
   
- (NSString*)conditionDescription {
    id result = [self _useDayPart] ? self.day.conditionDescription : self.night.conditionDescription;
    return result ? result : @"";
}
   
- (NSString*)dayIndicator {
    id result = [self _useDayPart] ? self.day.dayIndicator : self.night.dayIndicator;
    return result ? result : @"X";
}
   
- (NSNumber*)heatIndex {
    id result = [self _useDayPart] ? self.day.heatIndex : self.night.heatIndex;
    return result ? result : @0;
}
   
- (NSNumber*)precipProbability {
    id result = [self _useDayPart] ? self.day.precipProbability : self.night.precipProbability;
    return result ? result : @0;
}
   
- (NSString*)precipProbabilityDescription {
    id result = [self _useDayPart] ? self.day.precipProbabilityDescription : self.night.precipProbabilityDescription;
    return result ? result : @"";
}
   
- (NSString*)precipType {
    id result = [self _useDayPart] ? self.day.precipType : self.night.precipType;
    return result ? result : @"rain";
}
   
- (NSNumber*)relativeHumidity {
    id result = [self _useDayPart] ? self.day.relativeHumidity : self.night.relativeHumidity;
    return result ? result : @0;
}
   
- (NSString*)uvDescription {
    id result = [self _useDayPart] ? self.day.uvDescription : self.night.uvDescription;
    return result ? result : @"";
}
   
- (NSNumber*)uvIndex {
    id result = [self _useDayPart] ? self.day.uvIndex : self.night.uvIndex;
    return result ? result : @0;
}
   
- (NSNumber*)windChill {
    id result = [self _useDayPart] ? self.day.windChill : self.night.windChill;
    return result ? result : @0;
}
   
- (NSNumber*)windDirection {
    id result = [self _useDayPart] ? self.day.windDirection : self.night.windDirection;
    return result ? result : @0;
}
   
- (NSString*)windDirectionCardinal {
    id result = [self _useDayPart] ? self.day.windDirectionCardinal : self.night.windDirectionCardinal;
    return result ? result : @"N";
}
   
- (NSNumber*)windSpeed {
    id result = [self _useDayPart] ? self.day.windSpeed : self.night.windSpeed;
    return result ? result : @0;
}

@end
