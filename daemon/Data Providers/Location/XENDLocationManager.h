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

#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>

#define kXENLocationErrorNotAvailable 100 // No location data is available e.g. due to Location Services being disabled
#define kXENLocationErrorCachedOnly   101 // Cached data is provided in place of new data

#define kXENLocationErrorNotInitialised   102 // Wait, dude

@interface XENDLocationManager : NSObject <CLLocationManagerDelegate>

/**
 * Provides a shared instance of the location manager, creating if necessary
 */
+ (instancetype)sharedInstance;

/**
 * Retrieves the user's current location, calling the provided completion handler when it has been found
 * This may take a few seconds, especially when finding the first location after initialisation.
 */
- (void)fetchCurrentLocationWithCompletionHandler:(void(^)(NSError *error, CLLocation *location))completionHandler;

/**
 * Registers a callback for when the authorisation status of the internal location manager changes.
 * This can be to update data in light of location state changes.
 */
- (void)addAuthorisationStatusListener:(void(^)(BOOL available))listener;

/**
 * Reverse geocodes the provided location.
 * A cached geocode response may be provided.
 *
 * Response format:
 *
 * {
     "street": "123 Something Lane",
     "neighbourhood": "Somewhere close",
     "city": "Big city",
     "postalCode": "ABC 123",
     "state": "West Upwards",
     "country": "LaLaLand",
     "countryISOCode": "LLA"
 * }
 */
- (void)reverseGeocodeLocation:(CLLocation*)location completionHandler:(void(^)(NSDictionary *data, NSError *error))completionHandler;

@end
