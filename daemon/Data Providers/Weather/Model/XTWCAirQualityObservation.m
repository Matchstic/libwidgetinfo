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

#import "XTWCAirQualityObservation.h"
#import "NSDictionary+XENSafeObjectForKey.h"

@implementation XTWCAirQualityObservation

- (instancetype)initWithData:(NSDictionary*)data {
    self = [super init];
    
    if (self) {
        [self _parseData:data];
    }
    
    return self;
}

- (instancetype)initWithFakeData {
    self = [super init];
    
    if (self) {
		self.categoryLevel      = (id)[NSNull null];
		self.categoryIndex      = (id)[NSNull null];
		self.comment            = (id)[NSNull null];
		self.index              = (id)[NSNull null];
		self.scale              = (id)[NSNull null];
		self.source             = (id)[NSNull null];
		self.validFromUNIXTime  = 0;
        self.pollutants         = @{};
    }
    
    return self;
}

- (void)_parseData:(NSDictionary*)data {
    self.categoryLevel      = [data objectForKey:@"air_quality_cat" defaultValue:@""];
    self.categoryIndex      = [data objectForKey:@"air_quality_cat_idx" defaultValue:@0];
    self.comment            = [data objectForKey:@"air_quality_cmnt" defaultValue:@""];
    self.index              = [data objectForKey:@"air_quality_idx" defaultValue:@0];
    self.scale              = [data objectForKey:@"air_quality_scale" defaultValue:@""];
    self.source             = [data objectForKey:@"source" defaultValue:@""];
    self.validFromUNIXTime  = [[data objectForKey:@"process_tm_gmt" defaultValue:@0] intValue];
    self.pollutants         = [self _parsePollutantData:[data objectForKey:@"pollutants" defaultValue:@[]]];
}

- (NSDictionary*)_parsePollutantData:(NSArray*)data {
    NSDictionary *defaultItem = @{
        @"available":       @NO,
        @"amount":          @0,
        @"categoryLevel":   @"",
        @"categoryIndex":   @0,
        @"index":           @0,
        @"description":     @"",
        @"units":           @"",
    };
        
    NSMutableDictionary *result = [@{
            @"ozone": defaultItem,
            @"pm2.5": defaultItem,
            @"pm10": defaultItem,
            @"nitrogendioxide": defaultItem,
            @"carbonmonoxide": defaultItem,
            @"sulfurdioxide": defaultItem,
    } mutableCopy];
    
    for (NSDictionary *item in data) {
        NSString *key = @"";
        NSString *name = [item objectForKey:@"pollutant" defaultValue:@""];
        if ([name isEqualToString:@""]) continue;
        
        if ([name isEqualToString:@"PM2.5"]) key = @"pm2.5";
        else if ([name isEqualToString:@"PM10"]) key = @"pm10";
        else if ([name isEqualToString:@"NO2"]) key = @"nitrogendioxide";
        else if ([name isEqualToString:@"SO2"]) key = @"sulfurdioxide";
        else if ([name isEqualToString:@"OZONE"]) key = @"ozone";
        else if ([name isEqualToString:@"CO"]) key = @"carbonmonoxide";
        
        NSDictionary *parsedItem = @{
            @"available":       @YES,
            @"amount":          [item objectForKey:@"pollutant_amount" defaultValue:@0],
            @"categoryLevel":   [item objectForKey:@"pollutant_cat" defaultValue:@""],
            @"categoryIndex":   [item objectForKey:@"pollutant_cat_idx" defaultValue:@0],
            @"index":           [item objectForKey:@"pollutant_idx" defaultValue:@0],
            @"description":     [item objectForKey:@"pollutant_phrase" defaultValue:@""],
            @"units":           [item objectForKey:@"pollutant_unit" defaultValue:@""],
        };
        
        [result setObject:parsedItem forKey:key];
    }
    
    return result;
}

@end
