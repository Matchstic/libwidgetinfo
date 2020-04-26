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

#import "XENDProxyBaseConnection.h"
#import "XENDWidgetManager.h"

@interface XENDProxyBaseConnection ()

@end

@implementation XENDProxyBaseConnection

- (void)registerDataProvider:(XENDProxyDataProvider*)provider inNamespace:(NSString*)providerNamespace {
    if (!self.registeredProxyProviders) {
        self.registeredProxyProviders = [NSMutableDictionary dictionary];
    }
    
    [self.registeredProxyProviders setObject:provider forKey:providerNamespace];
}

- (void)initialise {
    // nop
}

//////////////////////////////////////////////////////////////
// Protocol stuff - empty implementation
//////////////////////////////////////////////////////////////

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    callback(@{});
}

- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {}

//////////////////////////////////////////////////////////////
// Callbacks from the connection
//////////////////////////////////////////////////////////////

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    XENDProxyDataProvider *provider = [self.registeredProxyProviders objectForKey:dataProviderNamespace];
    if (provider)
        [provider notifyUpdatedDynamicProperties:dynamicProperties];
}

- (void)noteDeviceDidEnterSleep {
    // Notify widget manager of device state change
    [[XENDWidgetManager sharedInstance] noteDeviceDidEnterSleep];
}

- (void)noteDeviceDidExitSleep {
    // Notify widget manager of device state change
    [[XENDWidgetManager sharedInstance] noteDeviceDidExitSleep];
}

- (void)networkWasDisconnected {
    // Notify widget manager of device state change
    [[XENDWidgetManager sharedInstance] networkWasDisconnected];
}

- (void)networkWasConnected {
    // Notify widget manager of device state change
    [[XENDWidgetManager sharedInstance] networkWasConnected];
}

@end
