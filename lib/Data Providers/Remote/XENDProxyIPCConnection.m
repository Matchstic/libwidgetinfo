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

#import "XENDProxyIPCConnection.h"
#import "XENDWidgetManager.h"
#import "XENDLogger.h"

#define ROCKETBOOTSTRAP_LOAD_DYNAMIC
#import "../../../deps/LightMessaging/LightMessaging.h"

@interface XENDProxyIPCConnection ()
@property (nonatomic, strong) NSTimer *retryConnectionTimer;
- (void)_updateProperties;
- (void)_updateDeviceState;
@end

@interface XENDWidgetManager (PrivateIPC)
- (void)remoteConnectionInitialised;
@end

#define WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED @"com.matchstic.libwidgetinfo/propertiesChanged"
#define WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED @"com.matchstic.libwidgetinfo/deviceStateChanged"
#define RETRY_TIMEOUT 5

// Only cleared when current process is killed
static XENDProxyIPCConnection *internalConnection;

static inline void deviceStateChangedCallback(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef userInfo) {
    
    // Fetch updated device state
    [internalConnection _updateDeviceState];
}

static inline void propertiesChangedCallback(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef userInfo) {
    
    // Fetch updated properties for proxy providers
    [internalConnection _updateProperties];
}

static LMConnection widgetinfodService = {
    MACH_PORT_NULL,
    "com.matchstic.widgetinfod.server"
};

@implementation XENDProxyIPCConnection

- (void)initialise {
    internalConnection = self;
    
    // Monitor for incoming messages
    
    CFNotificationCenterRef r = CFNotificationCenterGetDarwinNotifyCenter();
    CFNotificationCenterAddObserver(r, NULL, propertiesChangedCallback, (__bridge CFStringRef)WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED, NULL, 0);
    CFNotificationCenterAddObserver(r, NULL, deviceStateChangedCallback, (__bridge CFStringRef)WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED, NULL, 0);
    
    // Send a test connection to the IPC server
    
    [self _sendTestConnection];
}

- (NSDictionary*)_sendMessageWithName:(NSString*)name args:(NSDictionary*)args {
    NSDictionary *data = @{
        @"messageName": name,
        @"args": args
    };
    
    // send the message, and hopefully have it placed in the response buffer
    LMResponseBuffer buffer;
    kern_return_t result = LMConnectionSendTwoWayPropertyList(&widgetinfodService, 0, data, &buffer);

    // if it failed, log and return nil
    if (result != KERN_SUCCESS) {
        XENDLog(@"ERROR :: Failed to contact widgetinfod, with error %i", result);
        return nil;
    }

    // Convert response back to NSDictionary
    
    uint32_t length = LMMessageGetDataLength(&buffer.message);
    
    id dictionary;
    if (length) {
        CFDataRef data = CFDataCreateWithBytesNoCopy(kCFAllocatorDefault, (const UInt8 *)LMMessageGetData(&buffer.message), length, kCFAllocatorNull);
        
        NSData *bridged = LMBridgedCast_(NSData *, data);
        
        dictionary = [NSKeyedUnarchiver unarchiveObjectWithData:bridged];
        CFRelease(data);
    } else {
        result = nil;
    }
    
    LMResponseBufferFree(&buffer);
    
    return dictionary;
}

- (void)_sendTestConnection {
    // Send test connection to server
    
    NSDictionary *response = [self _sendMessageWithName:@"testConnection" args:@{}];
    if (response) {
        XENDLog(@"INFO :: Daemon connection established");
        
        // Notify providers of connection
        for (XENDProxyDataProvider *dataProvider in self.registeredProxyProviders.allValues) {
            [dataProvider notifyDaemonConnected];
        }
        
        // Current state is included in response
        
        self.currentDeviceState = [response objectForKey:@"deviceState"];
        
        // Request widget reload if this connection was delayed
        // Threading sucks
        dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
            [[XENDWidgetManager sharedInstance] remoteConnectionInitialised];
        });
    } else {
        // try again in a few seconds
        if (self.retryConnectionTimer) {
            [self.retryConnectionTimer invalidate];
            self.retryConnectionTimer = nil;
        }
        
        self.retryConnectionTimer = [NSTimer scheduledTimerWithTimeInterval:RETRY_TIMEOUT target:self selector:@selector(_retryTestConnection:) userInfo:nil repeats:NO];
    }
}

- (void)_retryTestConnection:(NSTimer*)timer {
    [self.retryConnectionTimer invalidate];
    self.retryConnectionTimer = nil;
    
    [self _sendTestConnection];
}

#pragma mark - Subclass overrides

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    
    NSDictionary *args = @{
        @"data": data,
        @"definition": definition,
        @"namespace": providerNamespace
    };
    
    NSDictionary *response = [self _sendMessageWithName:@"didReceiveWidgetMessage" args:args];
    callback(response);
}

- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    NSDictionary *args = @{
        @"namespace": providerNamespace
    };
    
    NSDictionary *response = [self _sendMessageWithName:@"requestCurrentProperties" args:args];
    callback(response);
}

- (void)requestCurrentDeviceStateWithCallback:(void(^)(NSDictionary*))callback {
    NSDictionary *response = [self _sendMessageWithName:@"requestCurrentDeviceState" args:@{}];
    callback(response);
}

- (void)_updateProperties {
    for (NSString *namespace in self.registeredProxyProviders.allKeys) {
        [self requestCurrentPropertiesInNamespace:namespace callback:^(NSDictionary *data) {
            if (data == nil) {
                XENDLog(@"ERROR :: Cannot fetch new properties in namespace %@", namespace);
            } else {
                // Only pass through dynamic properties, statics were fetched previously
                [self notifyUpdatedDynamicProperties:[data objectForKey:@"dynamic"] forNamespace:namespace];
            }
        }];
    }
}

- (void)_updateDeviceState {
    [self requestCurrentDeviceStateWithCallback:^(NSDictionary *args) {
        NSNumber *sleep = [args objectForKey:@"sleep"];
        NSNumber *network = [args objectForKey:@"network"];
        
        BOOL currentSleepState = [self.currentDeviceState objectForKey:@"sleep"];
        BOOL currentNetworkState = [self.currentDeviceState objectForKey:@"network"];
        
        if (currentSleepState != [sleep boolValue]) {
            if ([sleep boolValue]) {
                [self noteDeviceDidEnterSleep];
            } else {
                [self noteDeviceDidExitSleep];
            }
        }
        
        if (currentNetworkState != [network boolValue]) {
            if ([network boolValue]) {
                [self networkWasConnected];
            } else {
                [self networkWasDisconnected];
            }
        }
        
        self.currentDeviceState = args;
    }];
}

@end
