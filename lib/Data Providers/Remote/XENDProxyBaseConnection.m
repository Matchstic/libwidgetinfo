//
//  XENDProxyBaseConnection.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 21/09/2019.
//

#import "XENDProxyBaseConnection.h"

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

- (void)noteDeviceDidEnterSleepInNamespace:(NSString*)providerNamespace {}
- (void)noteDeviceDidExitSleepInNamespace:(NSString*)providerNamespace {}
- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    callback(@{});
}
- (void)networkWasDisconnectedInNamespace:(NSString*)providerNamespace {}
- (void)networkWasConnectedInNamespace:(NSString*)providerNamespace {}
- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {}

//////////////////////////////////////////////////////////////
// Callbacks from the connection
//////////////////////////////////////////////////////////////

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    XENDProxyDataProvider *provider = [self.registeredProxyProviders objectForKey:dataProviderNamespace];
    if (provider)
        [provider notifyUpdatedDynamicProperties:dynamicProperties];
}

@end
