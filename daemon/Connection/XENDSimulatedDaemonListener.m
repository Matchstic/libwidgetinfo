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

#import "XENDSimulatedDaemonListener.h"

@interface XENDSimulatedDaemonListener ()
@property (nonatomic, weak) id<XENDOriginDaemonConnection> delegate;
@end

@implementation XENDSimulatedDaemonListener

- (instancetype)initWithDelegate:(id<XENDOriginDaemonConnection>)delegate {
    self = [super init];
    
    if (self) {
		[self initialise];
        self.delegate = delegate;
    }
    
    return self;
}

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Forward update back - only will ever have one delegate in simulated mode due to it
    // all running in the same process
    [self.delegate notifyUpdatedDynamicProperties:dynamicProperties forNamespace:dataProviderNamespace];
}

- (void)noteDeviceDidEnterSleep {
    [self.delegate noteDeviceDidEnterSleep];
}

- (void)noteDeviceDidExitSleep {
    [self.delegate noteDeviceDidExitSleep];
}

- (void)networkWasConnected {
    [self.delegate networkWasConnected];
}

- (void)networkWasDisconnected {
    [self.delegate networkWasDisconnected];
}

@end
