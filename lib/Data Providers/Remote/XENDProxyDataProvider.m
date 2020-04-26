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

#import "XENDProxyDataProvider.h"
#import "XENDProxyManager.h"
#import "XENDLogger.h"

@implementation XENDProxyDataProvider

- (instancetype)init {
    self = [super init];
    
    if (self) {
        // Register ourselves with the current connection for incoming daemon messages
        [[[XENDProxyManager sharedInstance] connection] registerDataProvider:self inNamespace:[self _subclassNamespace]];
    }
    
    return self;
}

- (void)notifyDaemonConnected {
    // Fetch current properties from the daemon
    XENDLog(@"INFO :: Daemon connected, requesting current properties for: %@", [self _subclassNamespace]);
    [[[XENDProxyManager sharedInstance] connection] requestCurrentPropertiesInNamespace:[self _subclassNamespace] callback:^(NSDictionary *res) {
        
        NSDictionary *staticProperties = res ? [res objectForKey:@"static"] : @{};
        NSDictionary *dynamicProperties = res ? [res objectForKey:@"dynamic"] : @{};
        
        // Only apply properties if they are not empty
        if (![staticProperties isEqualToDictionary:@{}])
            self.cachedStaticProperties = staticProperties;
        if (![dynamicProperties isEqualToDictionary:@{}])
            self.cachedDynamicProperties = [dynamicProperties mutableCopy];
        
        // Notify widget manager of new data, if any was not empty
        if (![staticProperties isEqualToDictionary:@{}] || ![dynamicProperties isEqualToDictionary:@{}])
            [self notifyWidgetManagerForNewProperties];
    }];
}

- (NSString*)_subclassNamespace {
    return [[self class] providerNamespace];
}

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties {
    if ([self.cachedDynamicProperties isEqualToDictionary:dynamicProperties]) {
        XENDLog(@"DEBUG :: Not updating properties in namespace %@ because they haven't changed", [self _subclassNamespace]);
        return;
    }
    
    self.cachedDynamicProperties = [dynamicProperties copy];
    
    // Notify widget manager of new data
    [self notifyWidgetManagerForNewProperties];
}

/////////////////////////////////////////////////////////
// Base class overrides
/////////////////////////////////////////////////////////

- (void)noteDeviceDidEnterSleep {
    // Handle any specific things here in the client-side
}

- (void)noteDeviceDidExitSleep {
    // Handle any specific things here in the client-side
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    [[[XENDProxyManager sharedInstance] connection] didReceiveWidgetMessage:data
                                                         functionDefinition:definition
                                                                inNamespace:[self _subclassNamespace]
                                                                   callback:^(NSDictionary *res) {
                                                                       callback(res);
                                                                   }];
}

- (void)networkWasDisconnected {
    // Handle any specific things here in the client-side
}

- (void)networkWasConnected {
    // Handle any specific things here in the client-side
}

@end
