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

- (void)broadcastMessage:(NSString*)name {
    XENDLog(@"*** DEBUG :: Broadcast message %@", name);
    
    // Broadcast notification for new state change
    CFNotificationCenterPostNotification(CFNotificationCenterGetDarwinNotifyCenter(), (__bridge CFStringRef)name, NULL, NULL, YES);
}

#pragma mark - Inherited overrides

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Emit notification for changed properties
    
	XENDLog(@"*** Notifying clients of new properties available to fetch");
    [self broadcastMessage:WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED];
}

- (void)noteDeviceDidEnterSleep {
    [super noteDeviceDidEnterSleep];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED];
    }];
}

- (void)noteDeviceDidExitSleep {
    [super noteDeviceDidExitSleep];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED];
    }];
}

- (void)networkWasConnected {
    [super networkWasConnected];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED];
    }];
}

- (void)networkWasDisconnected {
    [super networkWasDisconnected];
    
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
        [self broadcastMessage:WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED];
    }];
}

@end
