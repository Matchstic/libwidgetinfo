//
//  XENDProxyDataProvider.m
//  libwidgetdata
//
//  Created by Matt Clarke on 16/09/2019.
//

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
