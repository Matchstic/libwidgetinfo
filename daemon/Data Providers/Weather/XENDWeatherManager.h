//
//  XENDWeatherManager.h
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "../Location/XENDLocationManager.h"
#import <Foundation/Foundation.h>

@protocol XENDWeatherManagerDelegate <NSObject>

- (void)onUpdatedWeatherConditions:(NSDictionary*)transformedConditions;
- (CLLocation*)fallbackWeatherLocation;

@end

@interface XENDWeatherManager : NSObject

/**
 * Configures the weather manager with all the required dependencies
 */
- (instancetype)initWithAPIKey:(NSString*)key locationManager:(XENDLocationManager*)locationManager andDelegate:(id<XENDWeatherManagerDelegate>)delegate;

/**
 * Pauses the internal weather update timer
 */
- (void)pauseUpdateTimer;

/**
 * Restarts the internal weather update timer, causing a refresh if necessary
 */
- (void)restartUpdateTimer;

/**
 * Called when network access is restored
 */
- (void)networkWasConnected;

/**
 * Called when network access is lost
 */
- (void)networkWasDisconnected;

- (void)noteSignificantTimeChange;

@end
