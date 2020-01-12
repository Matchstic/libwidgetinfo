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

@interface XENDLocationManager : NSObject

/**
 * Provides a shared instance of the location manager, creating if necessary
 */
+ (instancetype)sharedInstance;

/**
 * Retrieves the user's current location, calling the provided completion handler when it has been found
 * This may take a few seconds, especially when finding the first location after initialisation.
 */
- (void)fetchCurrentLocationWithCompletionHandler:(void(^)(NSError *error, CLLocation *location))completionHandler;

@end
