//
//  XTWCHourlyForecast.m
//  Daemon
//
//  Created by Matt Clarke on 18/01/2020.
//

#import "XTWCHourlyForecast.h"
#import "NSDictionary+XENSafeObjectForKey.h"

@interface XTWCHourlyForecast()
@property (nonatomic, strong) NSDictionary *rawData;
@end

@implementation XTWCHourlyForecast

- (instancetype)initWithData:(NSDictionary*)data units:(struct XTWCUnits)units {
    self = [super init];
    
    if (self) {
        self.rawData = data;
        [self _parseData:data units:units];
    }
    
    return self;
}

- (void)reloadForUnitsChanged:(struct XTWCUnits)units {
    [self _parseData:self.rawData units:units];
}

- (void)_parseData:(NSDictionary*)data units:(struct XTWCUnits)units {
    self.cloudCoverPercentage  = [data objectForKey:@"clds" defaultValue:[NSNull null]];
    self.conditionIcon          = [data objectForKey:@"icon_cd" defaultValue:[NSNull null]];
    self.conditionDescription   = [data objectForKey:@"phrase_32char" defaultValue:[NSNull null]];
    self.dayIndicator           = [data objectForKey:@"day_ind" defaultValue:[NSNull null]];
    self.dayOfWeek              = [data objectForKey:@"dow" defaultValue:[NSNull null]];
    self.forecastHourIndex      = [data objectForKey:@"num" defaultValue:[NSNull null]];
    self.precipProbability      = [data objectForKey:@"pop" defaultValue:@"rain"];
    self.precipType             = [data objectForKey:@"precip_type" defaultValue:@"rain"];
    self.relativeHumidity       = [data objectForKey:@"rh" defaultValue:[NSNull null]];
    self.uvDescription          = [data objectForKey:@"uv_desc" defaultValue:[NSNull null]];
    self.uvIndex                = [data objectForKey:@"uv_index" defaultValue:[NSNull null]];
    self.validUNIXTime          = [[data objectForKey:@"fcst_valid"] intValue];
    self.windDirection          = [data objectForKey:@"wdir" defaultValue:[NSNull null]];
    self.windDirectionCardinal  = [data objectForKey:@"wdir_cardinal" defaultValue:[NSNull null]];
    
    // Parse units specific things
    NSDictionary *metricValues = [data objectForKey:@"metric"];
    NSDictionary *imperialValues = [data objectForKey:@"imperial"];
    
    if (!metricValues || !imperialValues) {
        self.heatIndex          = (id)[NSNull null];
        self.gust               = (id)[NSNull null];
        self.temperature        = (id)[NSNull null];
        self.visibility         = (id)[NSNull null];
        self.windChill          = (id)[NSNull null];
        self.windSpeed          = (id)[NSNull null];
        self.dewpoint           = (id)[NSNull null];
        self.feelsLike          = (id)[NSNull null];
    } else {
        NSDictionary *temperatureValues = units.temperature == METRIC ? metricValues : imperialValues;
        NSDictionary *speedValues = units.temperature == METRIC ? metricValues : imperialValues;
        NSDictionary *distanceValues = units.temperature == METRIC ? metricValues : imperialValues;
        
        self.heatIndex          = [temperatureValues objectForKey:@"hi" defaultValue:[NSNull null]];
        self.gust               = [speedValues objectForKey:@"gust" defaultValue:[NSNull null]];
        self.temperature        = [temperatureValues objectForKey:@"temp" defaultValue:[NSNull null]];
        self.visibility         = [distanceValues objectForKey:@"vis" defaultValue:[NSNull null]];
        self.windChill          = [temperatureValues objectForKey:@"wc" defaultValue:[NSNull null]];
        self.windSpeed          = [speedValues objectForKey:@"wspd" defaultValue:[NSNull null]];
        self.dewpoint           = [temperatureValues objectForKey:@"dewpt" defaultValue:[NSNull null]];
        self.feelsLike          = [temperatureValues objectForKey:@"feels_like" defaultValue:[NSNull null]];
    }
}

@end

/*
 Example:
 
 {
     class = "fod_long_range_hourly";
     "day_ind" = D;
     dow = Sunday;
     "fcst_valid" = 1579449600;
     "fcst_valid_local" = "2020-01-19T16:00:00+0000";
     "icon_cd" = 32;
     "icon_extd" = 3200;
     imperial =                 {
         dewpt = 34;
         gust = "<null>";
         temp = 43;
         vis = 10;
         wspd = 5;
     };
     metric =                 {
         dewpt = 1;
         gust = "<null>";
         temp = 6;
         vis = "16.09";
         wspd = 8;
     };
     num = 21;
     "phrase_12char" = "";
     "phrase_22char" = "";
     "phrase_32char" = Sunny;
     pop = 5;
     "precip_type" = rain;
     rh = 69;
     "uv_desc" = Low;
     "uv_index" = 0;
     wdir = 339;
     "wdir_cardinal" = NNW;
 }
 */
