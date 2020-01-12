//
//  TWCObservation.m
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import "TWCObservation.h"
#import "NSDictionary+XENSafeObjectForKey.h"

@implementation TWCObservation

- (instancetype)initWithData:(NSDictionary*)data metric:(BOOL)useMetric {
    self = [super init];
    
    if (self) {
        [self _parseData:data metric:useMetric];
    }
    
    return self;
}

- (instancetype)initWithFakeData:(BOOL)useMetric {
    self = [super init];
    
    if (self) {
        self.cloudCoverDescription = @"SKC";
        self.conditionIcon = [NSNull null];
        self.conditionDescription = @"";
        self.dayIndicator = @"X";
        self.expirationUNIXTime = 0;
        self.validFromUNIXTime = 0;
        self.pressureDescription = @"";
        self.pressureTendency = [NSNull null];
        self.relativeHumidity = [NSNull null];
        self.uvDescription = @"";
        self.uvIndex = [NSNull null];
        self.windDirection = [NSNull null];
        self.windDirectionCardinal = @"N";
        self.dewpoint = [NSNull null];
        self.feelsLike = [NSNull null];
        self.gust = [NSNull null];
        self.heatIndex = [NSNull null];
        self.maxTemp = [NSNull null];
        self.minTemp = [NSNull null];
        self.precipHourly = [NSNull null];
        self.precipTotal = [NSNull null];
        self.pressure = [NSNull null];
        self.snowHourly = [NSNull null];
        self.temperature = [NSNull null];
        self.windChill = [NSNull null];
        self.windSpeed = [NSNull null];
        self.visibility = [NSNull null];
        self.waterTemperature = [NSNull null];
    }
    
    return self;
}

- (void)_parseData:(NSDictionary*)data metric:(BOOL)useMetric {
    
    // Handle all non-metricy stuff first
    self.cloudCoverDescription = [data objectForKey:@"clds" defaultValue:[NSNull null]];
    self.conditionIcon = [data objectForKey:@"wx_icon" defaultValue:[NSNull null]];
    self.conditionDescription = [data objectForKey:@"wx_phrase" defaultValue:[NSNull null]];
    self.dayIndicator = [data objectForKey:@"day_ind" defaultValue:[NSNull null]];
    self.expirationUNIXTime = [[data objectForKey:@"expire_time_gmt"] intValue];
    self.validFromUNIXTime = [[data objectForKey:@"valid_time_gmt"] intValue];
    self.pressureDescription = [data objectForKey:@"pressure_desc" defaultValue:[NSNull null]];
    self.pressureTendency = [data objectForKey:@"pressure_tend" defaultValue:[NSNull null]];
    self.relativeHumidity = [data objectForKey:@"rh" defaultValue:[NSNull null]];
    self.uvDescription = [data objectForKey:@"uv_desc" defaultValue:[NSNull null]];
    self.uvIndex = [data objectForKey:@"uv_index" defaultValue:[NSNull null]];
    self.windDirection = [data objectForKey:@"wdir" defaultValue:[NSNull null]];
    self.windDirectionCardinal = [data objectForKey:@"wdir_cardinal" defaultValue:[NSNull null]];
    
    // Parse units specific things
    NSDictionary *unitSpecificValues = useMetric ? [data objectForKey:@"metric"] : [data objectForKey:@"imperial"];
    
    if (unitSpecificValues) {
        self.dewpoint = [unitSpecificValues objectForKey:@"dewpt" defaultValue:[NSNull null]];
        self.feelsLike = [unitSpecificValues objectForKey:@"feels_like" defaultValue:[unitSpecificValues objectForKey:@"temp" defaultValue:[NSNull null]]];
        self.gust = [unitSpecificValues objectForKey:@"gust" defaultValue:[NSNull null]];
        self.heatIndex = [unitSpecificValues objectForKey:@"heat_index" defaultValue:[NSNull null]];
        self.maxTemp = [unitSpecificValues objectForKey:@"max_temp" defaultValue:[NSNull null]];
        self.minTemp = [unitSpecificValues objectForKey:@"min_temp" defaultValue:[NSNull null]];
        self.precipHourly = [unitSpecificValues objectForKey:@"precip_hrly" defaultValue:[NSNull null]];
        self.precipTotal = [unitSpecificValues objectForKey:@"precip_total" defaultValue:[NSNull null]];
        self.pressure = [unitSpecificValues objectForKey:@"pressure" defaultValue:[NSNull null]];
        self.snowHourly = [unitSpecificValues objectForKey:@"snow_hrly" defaultValue:[NSNull null]];
        self.temperature = [unitSpecificValues objectForKey:@"temp" defaultValue:[NSNull null]];
        self.windChill = [unitSpecificValues objectForKey:@"wc" defaultValue:[NSNull null]];
        self.windSpeed = [unitSpecificValues objectForKey:@"wspd" defaultValue:[NSNull null]];
        self.visibility = [unitSpecificValues objectForKey:@"vis" defaultValue:[NSNull null]];
        self.waterTemperature = [unitSpecificValues objectForKey:@"water_temp" defaultValue:[NSNull null]];
    } else {
        self.dewpoint = [NSNull null];
        self.feelsLike = [NSNull null];
        self.gust = [NSNull null];
        self.heatIndex = [NSNull null];
        self.maxTemp = [NSNull null];
        self.minTemp = [NSNull null];
        self.precipHourly = [NSNull null];
        self.precipTotal = [NSNull null];
        self.pressure = [NSNull null];
        self.snowHourly = [NSNull null];
        self.temperature = [NSNull null];
        self.windChill = [NSNull null];
        self.windSpeed = [NSNull null];
        self.visibility = [NSNull null];
        self.waterTemperature = [NSNull null];
    }
}

@end
