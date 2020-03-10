//
//  XENDIPCConnection.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 09/03/2020.
//

#import "XENDProxyIPCConnection.h"
#import "../../../deps/libobjcipc/IPC.h"

@implementation XENDProxyIPCConnection

- (void)initialise {
    // Setup client side connection
    [OBJCIPC activate];
    
    // Monitor for incoming messages
    
    [OBJCIPC registerIncomingMessageFromServerHandlerForMessageName:@"providerState" handler:^(NSDictionary *data, void (^callback)(NSDictionary* response)) {
        [self _messagePropertiesRecieved:data];
        
        callback(@{
            @"success": @YES
        });
    }];
    
    [OBJCIPC registerIncomingMessageFromServerHandlerForMessageName:@"deviceState" handler:^(NSDictionary *data, void (^callback)(NSDictionary* response)) {
        [self _messageStateRecieved:data];
        
        callback(@{
            @"success": @YES
        });
    }];
    
    // Send test connection to server
    NSLog(@"Sending test connection...");
    
    [OBJCIPC sendMessageToServerWithMessageName:@"testConnection" dictionary:@{} replyHandler:^(NSDictionary *data) {
        NSLog(@"Daemon connection established");
        
        // Notify providers of connection
        for (XENDProxyDataProvider *dataProvider in self.registeredProxyProviders.allValues) {
            [dataProvider notifyDaemonConnected];
        }
        
        // TODO: Current state is included in response
    }];
}

#pragma mark Subclass overrides

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    
    NSDictionary *args = @{
        @"data": data,
        @"definition": definition,
        @"namespace": providerNamespace
    };
    
    [OBJCIPC sendMessageToServerWithMessageName:@"didReceiveWidgetMessage" dictionary:args replyHandler:^(NSDictionary *data) {
        callback(data);
    }];
}

- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    NSDictionary *args = @{
        @"namespace": providerNamespace
    };
    
    [OBJCIPC sendMessageToServerWithMessageName:@"requestCurrentProperties" dictionary:args replyHandler:^(NSDictionary *data) {
        callback(data);
    }];
}

- (void)requestCurrentDeviceStateWithCallback:(void(^)(NSDictionary*))callback {
    [OBJCIPC sendMessageToServerWithMessageName:@"requestCurrentDeviceState" dictionary:@{} replyHandler:^(NSDictionary *data) {
        callback(data);
    }];
}

- (void)_messagePropertiesRecieved:(NSDictionary*)args {
    NSDictionary *data = [args objectForKey:@"data"];
    NSString *namespace = [args objectForKey:@"namespace"];
    
    NSLog(@"Notified of new properties in namespace: %@", namespace);
    
    [self notifyUpdatedDynamicProperties:data forNamespace:namespace];
}

- (void)_messageStateRecieved:(NSDictionary*)args {
    
    NSNumber *sleep = [args objectForKey:@"sleep"];
    NSNumber *network = [args objectForKey:@"network"];
    
    NSLog(@"Notified of new device state: %@", args);
    
    if ([sleep boolValue]) {
        [self noteDeviceDidEnterSleep];
    } else {
        [self noteDeviceDidExitSleep];
    }
    
    if ([network boolValue]) {
        [self networkWasConnected];
    } else {
        [self networkWasDisconnected];
    }
}

@end
