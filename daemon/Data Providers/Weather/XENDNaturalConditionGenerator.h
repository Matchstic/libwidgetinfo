//
//  XENDNaturalConditionGenerator.h
//  Daemon
//
//  Created by Matt Clarke on 19/04/2020.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

#import "Model/XTWCObservation.h"
#import "Model/XTWCUnits.h"

@interface XENDNaturalConditionGenerator : NSObject

/**
 * Provides a shared instance of the generator, creating if necessary
 */
+ (instancetype)sharedInstance;

/**
 * Generates the natural condition string from the stock Weather framework for the given observation
 */
- (NSString*)naturalConditionForObservation:(XTWCObservation*)observation
                               dayForecasts:(NSArray*)dayForecasts
                              hourForecasts:(NSArray*)hourForecasts
                                      isDay:(BOOL)isDay
                                   latitude:(double)latitude
                                  longitude:(double)longitude
                                    sunrise:(NSString*)sunrise
                                     sunset:(NSString*)sunset
                                      units:(struct XTWCUnits)units;

@end
