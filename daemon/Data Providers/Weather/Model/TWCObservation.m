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

- (void)_parseData:(NSDictionary*)data metric:(BOOL)useMetric {
    
    // Handle all non-metricy stuff first
    self.cloudCoverDescription = [data objectForKey:@"clds" defaultValue:@"SKC"];
    self.conditionIcon = [data objectForKey:@"wx_icon" defaultValue:@0];
    self.conditionDescription = [data objectForKey:@"wx_phrase" defaultValue:@""];
    self.dayIndicator = [data objectForKey:@"day_ind" defaultValue:@"X"];
    self.expirationUNIXTime = [[data objectForKey:@"expire_time_gmt"] intValue];
    self.pressureDescription = [data objectForKey:@"pressure_desc" defaultValue:@""];
    self.pressureTendency = [data objectForKey:@"pressure_tend" defaultValue:@0];
    self.relativeHumidity = [data objectForKey:@"rh" defaultValue:@0];
    self.uvDescription = [data objectForKey:@"uv_desc" defaultValue:@""];
    self.uvIndex = [data objectForKey:@"uv_index" defaultValue:@0];
    self.windDirection = [data objectForKey:@"wdir" defaultValue:@0];
    self.windDirectionCardinal = [data objectForKey:@"wdir_cardinal" defaultValue:@"N"];
    
    // Parse units specific things
    NSDictionary *unitSpecificValues = useMetric ? [data objectForKey:@"metric"] : [data objectForKey:@"imperial"];
    
    self.dewpoint = [unitSpecificValues objectForKey:@"dewpt" defaultValue:@0];
    self.feelsLike = [unitSpecificValues objectForKey:@"feels_like" defaultValue:[unitSpecificValues objectForKey:@"temp" defaultValue:@0]];
    self.gust = [unitSpecificValues objectForKey:@"gust" defaultValue:@0];
    self.heatIndex = [unitSpecificValues objectForKey:@"heat_index" defaultValue:@0];
    self.maxTemp = [unitSpecificValues objectForKey:@"max_temp" defaultValue:@0];
    self.minTemp = [unitSpecificValues objectForKey:@"min_temp" defaultValue:@0];
    self.precipHourly = [unitSpecificValues objectForKey:@"precip_hrly" defaultValue:@0];
    self.precipTotal = [unitSpecificValues objectForKey:@"precip_total" defaultValue:@0];
    self.pressure = [unitSpecificValues objectForKey:@"pressure" defaultValue:@0];
    self.snowHourly = [unitSpecificValues objectForKey:@"snow_hrly" defaultValue:@0];
    self.temperature = [unitSpecificValues objectForKey:@"temp" defaultValue:@0];
    self.windChill = [unitSpecificValues objectForKey:@"wc" defaultValue:@0];
    self.windSpeed = [unitSpecificValues objectForKey:@"wspd" defaultValue:@0];
    self.visibility = [unitSpecificValues objectForKey:@"vis" defaultValue:@0];
    self.waterTemperature = [unitSpecificValues objectForKey:@"water_temp" defaultValue:@0];
}

@end
