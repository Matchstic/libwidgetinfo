//
//  XENDNotifyDaemonListener.m
//  Daemon
//
//  Created by Matt Clarke on 07/03/2020.
//

#import "XENDIPCDaemonListener.h"
#import "../../deps/libobjcipc/IPC.h"

int libwidgetinfo_main_ipc(void) {
    NSLog(@"*** [libwidgetinfo] :: Loading up daemon.");
    
    // Initialize our daemon
	XENDIPCDaemonListener *listener;
	listener = [[XENDIPCDaemonListener alloc] init];
    
    // Run the run loop forever.
    [[NSRunLoop currentRunLoop] run];
    
    return EXIT_SUCCESS;
}

@implementation XENDIPCDaemonListener

- (instancetype)init {
    self = [super init];
    
    if (self) {
		[self initialise];
    }
    
    return self;
}

- (void)initialise {
	[super initialise];
	
    [OBJCIPC activate];
    
    // Setup IPC handlers
    
    [OBJCIPC registerIncomingMessageFromAppHandlerForMessageName:@"testConnection" handler:^(NSDictionary *args, void (^callback)(NSDictionary* response)) {
        [self requestCurrentDeviceStateWithCallback:^(NSDictionary* state) {
            callback(@{
                @"success": @YES,
                @"deviceState": state
            });
        }];
    }];
    
    [OBJCIPC registerIncomingMessageFromAppHandlerForMessageName:@"didReceiveWidgetMessage" handler:^(NSDictionary *args, void (^callback)(NSDictionary* response)) {
        [self didReceiveWidgetMessage:[args objectForKey:@"data"] functionDefinition:[args objectForKey:@"definition"] inNamespace:[args objectForKey:@"namespace"] callback:^(NSDictionary *result) {
            callback(result);
        }];
    }];
    
    [OBJCIPC registerIncomingMessageFromAppHandlerForMessageName:@"requestCurrentProperties" handler:^(NSDictionary *args, void (^callback)(NSDictionary* response)) {
        [self requestCurrentPropertiesInNamespace:[args objectForKey:@"namespace"] callback:^(NSDictionary *result) {
            callback(result);
        }];
    }];
    
    [OBJCIPC registerIncomingMessageFromAppHandlerForMessageName:@"requestCurrentDeviceState" handler:^(NSDictionary *args, void (^callback)(NSDictionary* response)) {
        [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
            callback(result);
        }];
    }];
}

- (void)broadcastMessage:(NSString*)name withData:(NSDictionary*)data {
    // Post to all app connections
    [OBJCIPC broadcastMessageToAppsWithMessageName:name dictionary:data replyHandler:^(NSDictionary *result) {
        // ignore result
    }];
}

#pragma mark Inherited overrides

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Emit notification for changed properties
	NSDictionary *result = @{
		@"data": dynamicProperties,
		@"namespace": dataProviderNamespace
	};
	
	NSLog(@"*** Notifying clients of new properties on namespace %@", dataProviderNamespace);
	
    [self broadcastMessage:@"providerState" withData:result];
}

- (void)noteDeviceDidEnterSleep {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self broadcastMessage:@"deviceState" withData:result];
	}];
}

- (void)noteDeviceDidExitSleep {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self broadcastMessage:@"deviceState" withData:result];
	}];
}

- (void)networkWasConnected {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self broadcastMessage:@"deviceState" withData:result];
	}];
}

- (void)networkWasDisconnected {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self broadcastMessage:@"deviceState" withData:result];
	}];
}

@end
