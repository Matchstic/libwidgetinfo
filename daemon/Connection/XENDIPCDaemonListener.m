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

#define ROCKETBOOTSTRAP_LOAD_DYNAMIC
#import "../../deps/LightMessaging/LightMessaging.h"

#define WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED @"com.matchstic.libwidgetinfo/propertiesChanged"
#define WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED @"com.matchstic.libwidgetinfo/deviceStateChanged"

int libwidgetinfo_main_ipc(void) {
    XENDLog(@"*** [libwidgetinfo] :: Loading up daemon.");
    
    // Initialize our daemon
	XENDIPCDaemonListener *listener;
	listener = [[XENDIPCDaemonListener alloc] init];
    
    // Run the run loop forever.
    [[NSRunLoop currentRunLoop] run];
    
    XENDLog(@"*** [libwidgetinfo] :: FATAL :: Runloop exited?!");
    
    return EXIT_SUCCESS;
}

static void exceptionHandler(NSException *exception) {
    NSArray *stack = [exception callStackSymbols];
    XENDLog(@"FATAL :: EXCEPTION!");
    XENDLog(@"%@", exception);
    XENDLog(@"Stack trace: %@", stack);
}

static XENDIPCDaemonListener *internalSharedInstance;

// See: https://github.com/hbang/libcephei/blob/1a8b97709f1dae9f4371e73ac17cb57a8ebaa556/HBPreferencesServer.x#L10
static void HandleReceivedMessage(CFMachPortRef port, void *bytes, CFIndex size, void *info) {
LMMessage *request = bytes;

    // check that we aren’t being given a corrupt message
    if ((size_t)size < sizeof(LMMessage)) {
        XENDLog(@"received a bad message? size = %li", size);

        // send a blank reply, free the buffer, and return
        LMSendReply(request->head.msgh_remote_port, NULL, 0);
        LMResponseBufferFree(bytes);

        return;
    }
    
    NSDictionary <NSString *, id> *userInfo = LMResponseConsumePropertyList((LMResponseBuffer *)request);
    
    NSString *messageName = [userInfo objectForKey:@"messageName"];
    NSDictionary *args = [userInfo objectForKey:@"args"];
    
    void (^callback)(NSDictionary *result) = ^(NSDictionary *result) {
        // Send a reply to the message
        
        // Convert result to NSData
        NSData *message = [NSKeyedArchiver archivedDataWithRootObject:result];
        
        LMSendNSDataReply(request->head.msgh_remote_port, message);
        LMResponseBufferFree(bytes);
    };
    
    // Call appropriate method in the listener
    if ([messageName isEqualToString:@"testConnection"]) {
        [internalSharedInstance requestCurrentDeviceStateWithCallback:^(NSDictionary* state) {
            callback(@{
                @"success": @YES,
                @"deviceState": state
            });
        }];
    } else if ([messageName isEqualToString:@"didReceiveWidgetMessage"]) {
        [internalSharedInstance didReceiveWidgetMessage:[args objectForKey:@"data"] functionDefinition:[args objectForKey:@"definition"] inNamespace:[args objectForKey:@"namespace"] callback:^(NSDictionary *result) {
            callback(result);
        }];
    } else if ([messageName isEqualToString:@"requestCurrentProperties"]) {
        [internalSharedInstance requestCurrentPropertiesInNamespace:[args objectForKey:@"namespace"] callback:^(NSDictionary *result) {
            callback(result);
        }];
    } else if ([messageName isEqualToString:@"requestCurrentDeviceState"]) {
        [internalSharedInstance requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
            callback(result);
        }];
    } else {
        XENDLog(@"ERROR :: Unknown message sent to widgetinfod");
        callback(@{});
    }
}

@interface XENDIPCDaemonListener ()
@property (nonatomic, readwrite) BOOL requiresPropertiesPushAfterSleep;
@end

@implementation XENDIPCDaemonListener

- (instancetype)init {
    self = [super init];
    
    if (self) {
        internalSharedInstance = self;
		[self initialise];
    }
    
    return self;
}

- (void)initialise {
    self.requiresPropertiesPushAfterSleep = NO;
    
    // Exception handler
    NSSetUncaughtExceptionHandler(&exceptionHandler);
    
    // start the data service
    kern_return_t result = LMStartService("com.matchstic.widgetinfod.server", CFRunLoopGetCurrent(), HandleReceivedMessage);

    // if it failed, log it
    if (result != KERN_SUCCESS) {
        XENDLog(@"ERROR :: Failed to start data server, with error %i", result);
    }
    
    // Setup data providers after IPC is initialised
    [super initialise];
}

- (void)broadcastMessage:(NSString*)name {    
    // Broadcast notification for new state change
    CFNotificationCenterPostNotification(CFNotificationCenterGetDarwinNotifyCenter(), (__bridge CFStringRef)name, NULL, NULL, YES);
}

#pragma mark - Inherited overrides

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Emit notification for changed properties
    
    if ([[self stateManagerInstance] sleepState]) {
        // Display is off, do nothing
        // Need to notify clients of new state when coming back from sleep
        
        self.requiresPropertiesPushAfterSleep = YES;
    } else {
        XENDLog(@"*** Notifying clients of new properties available to fetch");
        [self broadcastMessage:WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED];
    }
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
    
    if (self.requiresPropertiesPushAfterSleep) {
        self.requiresPropertiesPushAfterSleep = NO;
        
        XENDLog(@"*** Notifying clients of new properties available to fetch, due to wake event");
        [self broadcastMessage:WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED];
    }
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
