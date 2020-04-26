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
- (void)noteHourChange;

@end
