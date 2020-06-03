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

@protocol XENDStateManagerDelegate <NSObject>

- (void)noteDeviceDidEnterSleep;
- (void)noteDeviceDidExitSleep;
- (void)networkWasConnected;
- (void)networkWasDisconnected;
- (void)noteSignificantTimeChange;
- (void)noteHourChange;

@end

/**
 Keeps track of device states, and provides that back to the delegate on change
 */
@interface XENDStateManager : NSObject

- (instancetype)initWithDelegate:(id<XENDStateManagerDelegate>)delegate;

/**
 Summarises internal device state in a dictionary for clients to process on initial connection
 */
- (NSDictionary*)summariseState;

/**
 The current sleep state of the device
 */
- (BOOL)sleepState;

/**
 The current network state
 */
- (BOOL)networkState;

@end
