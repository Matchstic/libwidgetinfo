//
//  XENDWeatherDataProvider.h
//  libwidgetinfo
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDProxyDataProvider.h"

@interface XENDWeatherDataProvider : XENDProxyDataProvider

/**
 Determines whether initial data has been recieved into the weather provider
 */
- (BOOL)hasInitialData;

/**
 * Register a listener to call upon when initial data becomes available.
 * @param listener The listener to register
 */
- (void)registerListenerForInitialData:(void (^)(NSDictionary *cachedData))listener;

@end
