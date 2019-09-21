//
//  XENDProxyDataProvider.m
//  libwidgetdata
//
//  Created by Matt Clarke on 16/09/2019.
//

#import "XENDProxyDataProvider.h"
#import "XENDProxyManager.h"

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
    [[[XENDProxyManager sharedInstance] connection] requestCurrentPropertiesInNamespace:[self _subclassNamespace] callback:^(NSDictionary *res) {
        self.cachedStaticProperties = [res objectForKey:@"static"];
        self.cachedDynamicProperties = [res objectForKey:@"dynamic"];
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
    [[[XENDProxyManager sharedInstance] connection] noteDeviceDidEnterSleepInNamespace:[self _subclassNamespace]];
}

- (void)noteDeviceDidExitSleep {
    [[[XENDProxyManager sharedInstance] connection] noteDeviceDidExitSleepInNamespace:[self _subclassNamespace]];
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
    [[[XENDProxyManager sharedInstance] connection] networkWasDisconnectedInNamespace:[self _subclassNamespace]];
}

- (void)networkWasConnected {
    [[[XENDProxyManager sharedInstance] connection] networkWasConnectedInNamespace:[self _subclassNamespace]];
}

@end
