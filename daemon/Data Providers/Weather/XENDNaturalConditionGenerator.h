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
