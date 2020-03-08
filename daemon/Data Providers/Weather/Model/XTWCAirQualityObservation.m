//
//  XTWCAirQualityObservation.m
//  Daemon
//
//  Created by Matt Clarke on 22/01/2020.
//

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
		self.pollutants         = @[];
    }
    
    return self;
}

- (void)_parseData:(NSDictionary*)data {
    self.categoryLevel      = [data objectForKey:@"air_quality_cat" defaultValue:[NSNull null]];
    self.categoryIndex      = [data objectForKey:@"air_quality_cat_idx" defaultValue:[NSNull null]];
    self.comment            = [data objectForKey:@"air_quality_cmnt" defaultValue:[NSNull null]];
    self.index              = [data objectForKey:@"air_quality_idx" defaultValue:[NSNull null]];
    self.scale              = [data objectForKey:@"air_quality_scale" defaultValue:[NSNull null]];
    self.source             = [data objectForKey:@"source" defaultValue:[NSNull null]];
    self.validFromUNIXTime  = [[data objectForKey:@"process_tm_gmt" defaultValue:@0] intValue];
    self.pollutants         = [self _parsePollutantData:[data objectForKey:@"pollutants" defaultValue:@[]]];
}

- (NSArray*)_parsePollutantData:(NSArray*)data {
    NSMutableArray *result = [@[] mutableCopy];
    
    for (NSDictionary *item in data) {
        NSDictionary *parsedItem = @{
            @"name":            [item objectForKey:@"pollutant" defaultValue:@""],
            @"amount":          [item objectForKey:@"pollutant_amount" defaultValue:[NSNull null]],
            @"categoryLevel":   [item objectForKey:@"pollutant_cat" defaultValue:[NSNull null]],
            @"categoryIndex":   [item objectForKey:@"pollutant_cat_idx" defaultValue:[NSNull null]],
            @"index":           [item objectForKey:@"pollutant_idx" defaultValue:[NSNull null]],
            @"description":     [item objectForKey:@"pollutant_phrase" defaultValue:[NSNull null]],
            @"units":           [item objectForKey:@"pollutant_unit" defaultValue:[NSNull null]],
        };
        
        [result addObject:parsedItem];
    }
    
    return result;
}

@end
