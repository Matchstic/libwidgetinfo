//
//  XTWCDailyForecast.m
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import "XTWCDailyForecast.h"
#import "NSDictionary+XENSafeObjectForKey.h"

@interface TWCDayNightPart : NSObject

@property (nonatomic, strong) NSString *cloudCoverPercentage;
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

@interface XTWCDailyForecast ()
@property (nonatomic, strong) TWCDayNightPart *day;
@property (nonatomic, strong) TWCDayNightPart *night;

@property (nonatomic, readwrite) BOOL nightOverride;
@end

@implementation XTWCDailyForecast

- (instancetype)initWithData:(NSDictionary*)data units:(struct XTWCUnits)units {
    self = [super init];
    
    if (self) {
        self.nightOverride = NO;
        [self _parseData:data units:units];
    }
    
    return self;
}

- (void)overrideToNight:(BOOL)isNight {
    self.nightOverride = isNight;
}

- (void)_parseData:(NSDictionary*)data units:(struct XTWCUnits)units {
    
    // Parse day/night specific information
    
    self.day                    = [self _parseDayNightPart:[data objectForKey:@"day" defaultValue:@{}] units:units];
    self.night                  = [self _parseDayNightPart:[data objectForKey:@"night" defaultValue:@{}] units:units];
    
    self.blurb                  = [data objectForKey:@"blurb" defaultValue:[NSNull null]];
    self.blurbAuthor            = [data objectForKey:@"blurb_author" defaultValue:[NSNull null]];
    self.dayOfWeek              = [data objectForKey:@"dow" defaultValue:[NSNull null]];
    self.forecastDayIndex       = [data objectForKey:@"num" defaultValue:[NSNull null]];
    self.lunarPhaseDay          = [data objectForKey:@"lunar_phase_day" defaultValue:[NSNull null]];
    self.lunarPhaseDescription  = [data objectForKey:@"lunar_phase" defaultValue:[data objectForKey:@"moon_phase" defaultValue:[NSNull null]]];
    self.lunarPhaseCode         = [data objectForKey:@"lunar_phase_code" defaultValue:[data objectForKey:@"moon_phase_code" defaultValue:[NSNull null]]];
    self.moonRiseISOTime        = [data objectForKey:@"moonrise" defaultValue:[NSNull null]];
    self.moonSetISOTime         = [data objectForKey:@"moonset" defaultValue:[NSNull null]];
    self.narrative              = [data objectForKey:@"narrative" defaultValue:[NSNull null]];
    self.snowForecast           = [data objectForKey:@"snow_qpf" defaultValue:[NSNull null]];
    self.snowPhrase             = [data objectForKey:@"snow_phrase" defaultValue:[NSNull null]];
    self.snowRange              = [data objectForKey:@"snow_range" defaultValue:[NSNull null]];
    self.stormLikelihood        = [data objectForKey:@"stormcon" defaultValue:[NSNull null]];
    self.sunRiseISOTime         = [data objectForKey:@"sunrise" defaultValue:[NSNull null]];
    self.sunSetISOTime          = [data objectForKey:@"sunset" defaultValue:[NSNull null]];
    self.tornadoLikelihood      = [data objectForKey:@"torcon" defaultValue:[NSNull null]];
    self.validUNIXTime          = [[data objectForKey:@"fcst_valid"] intValue];
    
    // Parse units specific things
    NSDictionary *unitSpecificValues = units.temperature == METRIC ? [data objectForKey:@"metric"] : [data objectForKey:@"imperial"];
    
    if (unitSpecificValues) {
        self.maxTemp            = [unitSpecificValues objectForKey:@"max_temp" defaultValue:[NSNull null]];
        self.minTemp            = [unitSpecificValues objectForKey:@"min_temp" defaultValue:[NSNull null]];
    } else {
        self.maxTemp            = (id)[NSNull null];
        self.minTemp            = (id)[NSNull null];
    }
}

- (TWCDayNightPart*)_parseDayNightPart:(NSDictionary*)data units:(struct XTWCUnits)units {
    
    TWCDayNightPart *part = [[TWCDayNightPart alloc] init];
    
    // Handle all non-metricy stuff first
    part.cloudCoverPercentage          = [data objectForKey:@"clds" defaultValue:[NSNull null]];
    part.conditionIcon                  = [data objectForKey:@"icon_cd" defaultValue:[NSNull null]];
    part.conditionDescription           = [data objectForKey:@"phrase_32char" defaultValue:[NSNull null]];
    part.dayIndicator                   = [data objectForKey:@"day_ind" defaultValue:[NSNull null]];
    part.precipProbability              = [data objectForKey:@"pop" defaultValue:[NSNull null]];
    part.precipType                     = [data objectForKey:@"precip_type" defaultValue:@"rain"];
    part.timeframeDescription           = [data objectForKey:@"qualifier" defaultValue:[NSNull null]];
    part.relativeHumidity               = [data objectForKey:@"rh" defaultValue:[NSNull null]];
    part.uvDescription                  = [data objectForKey:@"uv_desc" defaultValue:[NSNull null]];
    part.uvIndex                        = [data objectForKey:@"uv_index" defaultValue:[NSNull null]];
    part.windDirection                  = [data objectForKey:@"wdir" defaultValue:[NSNull null]];
    part.windDirectionCardinal          = [data objectForKey:@"wdir_cardinal" defaultValue:[NSNull null]];
    part.validUNIXTime                  = [[data objectForKey:@"fcst_valid"] intValue];
    
    // Parse units specific things
    NSDictionary *metricValues = [data objectForKey:@"metric"];
    NSDictionary *imperialValues = [data objectForKey:@"imperial"];
    
    if (!metricValues || !imperialValues) {
        part.heatIndex                  = (id)[NSNull null];
        part.temperature                = (id)[NSNull null];
        part.windChill                  = (id)[NSNull null];
        part.windSpeed                  = (id)[NSNull null];
    } else {
        part.heatIndex                  = units.temperature == METRIC ?
                                            [metricValues objectForKey:@"hi" defaultValue:[NSNull null]] :
                                            [imperialValues objectForKey:@"hi" defaultValue:[NSNull null]];
        part.temperature                = units.temperature == METRIC ?
                                            [metricValues objectForKey:@"temp" defaultValue:[NSNull null]] :
                                            [imperialValues objectForKey:@"temp" defaultValue:[NSNull null]];
        part.windChill                  = units.temperature == METRIC ?
                                            [metricValues objectForKey:@"wc" defaultValue:[NSNull null]] :
                                            [imperialValues objectForKey:@"wc" defaultValue:[NSNull null]];
        part.windSpeed                  = units.speed == METRIC ?
                                            [metricValues objectForKey:@"wspd" defaultValue:[NSNull null]] :
                                            [imperialValues objectForKey:@"wspd" defaultValue:[NSNull null]];
    }
    
    return part;
}

// Overriden getters for day/night parts
   
- (BOOL)_useDayPart {
    if (self.nightOverride) return NO;
    if (self.day.validUNIXTime == 0) return NO;
    
    // If this day has not yet begun, assume to use day info
    if ([[NSDate date] timeIntervalSince1970] < self.day.validUNIXTime) return YES;
    
    // Otherwise, use day info if it slots into the right timeframe
    return [[NSDate date] timeIntervalSince1970] < self.night.validUNIXTime &&
                [[NSDate date] timeIntervalSince1970] >= self.day.validUNIXTime;
}

- (NSString*)cloudCoverPercentage {
    id result = [self _useDayPart] ? self.day.cloudCoverPercentage : self.night.cloudCoverPercentage;
    return result ? result : @"";
}

- (NSNumber*)conditionIcon {
    id result = [self _useDayPart] ? self.day.conditionIcon : self.night.conditionIcon;
    return result ? result : (id)[NSNull null];
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
    return result ? result : (id)[NSNull null];
}
   
- (NSNumber*)precipProbability {
    id result = [self _useDayPart] ? self.day.precipProbability : self.night.precipProbability;
    return result ? result : (id)[NSNull null];
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
    return result ? result : (id)[NSNull null];
}
   
- (NSString*)uvDescription {
    id result = [self _useDayPart] ? self.day.uvDescription : self.night.uvDescription;
    return result ? result : @"";
}
   
- (NSNumber*)uvIndex {
    id result = [self _useDayPart] ? self.day.uvIndex : self.night.uvIndex;
    return result ? result : (id)[NSNull null];
}
   
- (NSNumber*)windChill {
    id result = [self _useDayPart] ? self.day.windChill : self.night.windChill;
    return result ? result : (id)[NSNull null];
}
   
- (NSNumber*)windDirection {
    id result = [self _useDayPart] ? self.day.windDirection : self.night.windDirection;
    return result ? result : (id)[NSNull null];
}
   
- (NSString*)windDirectionCardinal {
    id result = [self _useDayPart] ? self.day.windDirectionCardinal : self.night.windDirectionCardinal;
    return result ? result : @"N";
}
   
- (NSNumber*)windSpeed {
    id result = [self _useDayPart] ? self.day.windSpeed : self.night.windSpeed;
    return result ? result : (id)[NSNull null];
}

@end
