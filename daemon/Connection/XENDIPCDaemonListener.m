//
//  XENDNotifyDaemonListener.m
//  Daemon
//
//  Created by Matt Clarke on 07/03/2020.
//

#import "XENDIPCDaemonListener.h"
#import "XENDLogger.h"
#import "../../deps/libobjcipc/objcipc.h"

#define WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED @"com.matchstic.libwidgetinfo/propertiesChanged"
#define WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED @"com.matchstic.libwidgetinfo/deviceStateChanged"

int libwidgetinfo_main_ipc(void) {
    XENDLog(@"*** [libwidgetinfo] :: Loading up daemon.");
    
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

- (void)broadcastMessage:(NSString*)name data:(NSDictionary*)data {
    XENDLog(@"*** DEBUG :: Broadcast message %@ with data %@", name, data);
    
    // Broadcast notification for new state change
    NSDistributedNotificationCenter *center = [NSDistributedNotificationCenter defaultCenter];
    [center postNotificationName:name object:nil userInfo:data deliverImmediately:YES];
}

#pragma mark Inherited overrides

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Emit notification for changed properties
    NSDictionary *data = @{
        @"namespace": dataProviderNamespace
    };
    
	XENDLog(@"*** Notifying clients of new properties available to fetch");
    [self broadcastMessage:WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED data:data];
}

- (void)noteDeviceDidEnterSleep {
    [super noteDeviceDidEnterSleep];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED data:result];
    }];
}

- (void)noteDeviceDidExitSleep {
    [super noteDeviceDidExitSleep];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED data:result];
    }];
}

- (void)networkWasConnected {
    [super networkWasConnected];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED data:result];
    }];
}

- (void)networkWasDisconnected {
    [super networkWasDisconnected];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED data:result];
    }];
}

@end
