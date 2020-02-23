//
//  XENDProxyXPCConnection.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 21/09/2019.
//

#import "XENDProxyXPCConnection.h"
#import "../../../daemon/Connection/XENDDaemonConnection-Protocol.h"

@interface NSXPCConnection (Private)
@property (copy) id /* block */ interruptionHandler;
@property (copy) id /* block */ invalidationHandler;
@property (readonly, retain) id remoteObjectProxy;

- (instancetype)initWithMachServiceName:(NSString*)arg1;
- (void)invalidate;
@end

@interface NSXPCInterface : NSObject
+ (id)interfaceWithProtocol:(id)arg1;
@end

@interface XENDProxyXPCConnection ()
@property (nonatomic, strong) NSXPCConnection *daemonConnection;
@end

static NSString *customMachServiceName = @"com.matchstic.libwidgetinfo";

@implementation XENDProxyXPCConnection

+ (void)setMachServiceName:(NSString*)name {
    customMachServiceName = name;
}

- (void)initialise {
    self.daemonConnection = [[NSXPCConnection alloc] initWithMachServiceName:customMachServiceName];
    self.daemonConnection.remoteObjectInterface = [NSXPCInterface interfaceWithProtocol:@protocol(XENDRemoteDaemonConnection)];
    
    self.daemonConnection.exportedInterface = [NSXPCInterface interfaceWithProtocol:@protocol(XENDOriginDaemonConnection)];
    self.daemonConnection.exportedObject = self;
    
    // Handle connection errors
    __weak XENDProxyXPCConnection *weakSelf = self;
    self.daemonConnection.interruptionHandler = ^{
        [weakSelf.daemonConnection invalidate];
        weakSelf.daemonConnection = nil;
        
        // Re-create connection
        [weakSelf initialise];
    };
    self.daemonConnection.invalidationHandler = ^{
        [weakSelf.daemonConnection invalidate];
        weakSelf.daemonConnection = nil;
        
        // Re-create connection
        [weakSelf initialise];
    };
    
    [self.daemonConnection resume];
    
    // Notify providers of connection
    for (XENDProxyDataProvider *dataProvider in self.registeredProxyProviders) {
        [dataProvider notifyDaemonConnected];
    }
    
    NSLog(@"*** [libwidgetinfo] :: Setup daemon connection: %@", self.daemonConnection);
}

//////////////////////////////////////////////////////////////
// Protocol stuff - overrides
//////////////////////////////////////////////////////////////

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    [self.daemonConnection.remoteObjectProxy didReceiveWidgetMessage:data functionDefinition:definition inNamespace:providerNamespace callback:^(NSDictionary *res) {
        callback(res);
    }];
}

- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    [self.daemonConnection.remoteObjectProxy requestCurrentPropertiesInNamespace:providerNamespace callback:^(NSDictionary *res) {
        callback(res);
    }];
}

@end