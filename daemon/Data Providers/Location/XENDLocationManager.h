//
//  XENDLocationManager.h
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

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
