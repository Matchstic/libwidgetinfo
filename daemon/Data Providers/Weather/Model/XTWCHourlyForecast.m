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
    self.conditionIcon          = [data objectForKey:@"icon_cd" defaultValue:@44];
    self.conditionDescription   = [data objectForKey:@"phrase_32char" defaultValue:@""];
    self.dayIndicator           = [data objectForKey:@"day_ind" defaultValue:@"X"];
    self.dayOfWeek              = [data objectForKey:@"dow" defaultValue:[NSNull null]];
    self.forecastHourIndex      = [data objectForKey:@"num" defaultValue:[NSNull null]];
    self.precipProbability      = [data objectForKey:@"pop" defaultValue:@0];
    self.precipType             = [data objectForKey:@"precip_type" defaultValue:@"rain"];
    self.relativeHumidity       = [data objectForKey:@"rh" defaultValue:@0];
    self.uvDescription          = [data objectForKey:@"uv_desc" defaultValue:@""];
    self.uvIndex                = [data objectForKey:@"uv_index" defaultValue:@0];
    self.validUNIXTime          = [[data objectForKey:@"fcst_valid"] intValue];
    self.windDirection          = [data objectForKey:@"wdir" defaultValue:@0];
    self.windDirectionCardinal  = [data objectForKey:@"wdir_cardinal" defaultValue:@"N"];
    
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
        
        self.temperature        = [temperatureValues objectForKey:@"temp" defaultValue:[NSNull null]];
        
        self.heatIndex          = [temperatureValues objectForKey:@"hi" defaultValue:self.temperature];
        self.gust               = [speedValues objectForKey:@"gust" defaultValue:[NSNull null]];
        self.visibility         = [distanceValues objectForKey:@"vis" defaultValue:[NSNull null]];
        self.windChill          = [temperatureValues objectForKey:@"wc" defaultValue:self.temperature];
        self.windSpeed          = [speedValues objectForKey:@"wspd" defaultValue:[NSNull null]];
        self.dewpoint           = [temperatureValues objectForKey:@"dewpt" defaultValue:[NSNull null]];
        self.feelsLike          = [temperatureValues objectForKey:@"feels_like" defaultValue:self.temperature];
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
