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

#import "XENDProxySimulatedConnection.h"
#import "../../../daemon/Connection/XENDSimulatedDaemonListener.h"
#import <objc/runtime.h>

@interface XENDProxySimulatedConnection ()
@property (nonatomic, strong) XENDSimulatedDaemonListener *connection;
@end

@implementation XENDProxySimulatedConnection

- (instancetype)init {
    self = [super init];
    
    if (self) {
        self.connection = [[objc_getClass("XENDSimulatedDaemonListener") alloc] initWithDelegate:self];
    }
    
    return self;
}

- (void)registerDataProvider:(XENDProxyDataProvider*)provider inNamespace:(NSString*)providerNamespace {
    [super registerDataProvider:provider inNamespace:providerNamespace];
    
    // Automatically notify of daemon connection - its simulated!
    [provider notifyDaemonConnected];
}

//////////////////////////////////////////////////////////////
// Protocol stuff - overrides
//////////////////////////////////////////////////////////////

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    [self.connection didReceiveWidgetMessage:data functionDefinition:definition inNamespace:providerNamespace callback:callback];
}

- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    [self.connection requestCurrentPropertiesInNamespace:providerNamespace callback:^(NSDictionary *res) {
        callback(res);
    }];
}

@end
