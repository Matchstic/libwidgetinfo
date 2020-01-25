//
//  XENDProxySimulatedConnection.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 21/09/2019.
//

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
