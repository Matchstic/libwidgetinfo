//
//  XENDIPCConnection.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 09/03/2020.
//

#import "XENDProxyIPCConnection.h"
#import "XENDLogger.h"
#import "../../../deps/libobjcipc/objcipc.h"

@interface XENDProxyIPCConnection ()
- (void)_updateProperties;
- (void)_updateDeviceState;
@end

#define WIDGET_INFO_MESSAGE_PROPERTIES_CHANGED @"com.matchstic.libwidgetinfo/propertiesChanged"
#define WIDGET_INFO_MESSAGE_DEVICE_STATE_CHANGED @"com.matchstic.libwidgetinfo/deviceStateChanged"

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

- (void)_sendTestConnection {
    // Send test connection to server
    XENDLog(@"DEBUG :: Sending test connection...");
    
    [OBJCIPC sendMessageToServerWithMessageName:@"testConnection" dictionary:@{} replyHandler:^(NSDictionary *data) {
        XENDLog(@"INFO :: Daemon connection established");
        
        // Notify providers of connection
        for (XENDProxyDataProvider *dataProvider in self.registeredProxyProviders.allValues) {
            [dataProvider notifyDaemonConnected];
        }
        
        // Current state is included in response
        
        self.currentDeviceState = [data objectForKey:@"deviceState"];
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

- (void)_updateProperties {
    for (NSString *namespace in self.registeredProxyProviders.allKeys) {
        [self requestCurrentPropertiesInNamespace:namespace callback:^(NSDictionary *data) {
            if (data == nil) {
                XENDLog(@"ERROR :: Cannot fetch new properties");
            } else {
                XENDLog(@"DEBUG :: Fetched updated properties in namespace: %@", namespace);
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
        
        XENDLog(@"DEBUG :: Notified of new device state: %@", args);
        
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
