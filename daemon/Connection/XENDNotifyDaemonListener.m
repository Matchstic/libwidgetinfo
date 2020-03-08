//
//  XENDNotifyDaemonListener.m
//  Daemon
//
//  Created by Matt Clarke on 07/03/2020.
//

#import "XENDNotifyDaemonListener.h"

@interface NSDistributedNotificationCenter : NSNotificationCenter
+(instancetype)defaultCenter;
@end

@interface XENDNotifyDaemonListener ()
@property (nonatomic, strong) NSDistributedNotificationCenter *center;
@end

#define MESSAGE_NAME 			@"WidgetInfo-server-callable"
#define MESSAGE_NAME_PROPERTIES @"WidgetInfo-server-properties"
#define MESSAGE_NAME_STATE		@"WidgetInfo-server-state"

int libwidgetinfo_main_notify() {
    NSLog(@"*** [libwidgetinfo] :: Loading up daemon.");
    
    // Initialize our daemon
	XENDNotifyDaemonListener *listener;
	listener = [[XENDNotifyDaemonListener alloc] init];
    
    // Run the run loop forever.
    [[NSRunLoop currentRunLoop] run];
    
    return EXIT_SUCCESS;
}

@implementation XENDNotifyDaemonListener

- (instancetype)init {
    self = [super init];
    
    if (self) {
		[self initialise];
    }
    
    return self;
}

- (void)initialise {
	[super initialise];
	
	// Setup the IPC center stuff
	self.center = [NSDistributedNotificationCenter defaultCenter];
	
	[self.center addObserver:self selector:@selector(_messageRecieved:) name:MESSAGE_NAME object:nil];
}

#pragma mark Inherited overrides

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Emit notification for changed properties
	NSDictionary *result = @{
		@"data": dynamicProperties,
		@"namespace": dataProviderNamespace
	};
	
	[self.center postNotificationName:MESSAGE_NAME_PROPERTIES object:nil userInfo:result];
}

- (void)noteDeviceDidEnterSleep {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self.center postNotificationName:MESSAGE_NAME_STATE object:nil userInfo:result];
	}];
}

- (void)noteDeviceDidExitSleep {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self.center postNotificationName:MESSAGE_NAME_STATE object:nil userInfo:result];
	}];
}

- (void)networkWasConnected {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self.center postNotificationName:MESSAGE_NAME_STATE object:nil userInfo:result];
	}];
}

- (void)networkWasDisconnected {
	[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
		[self.center postNotificationName:MESSAGE_NAME_STATE object:nil userInfo:result];
	}];
}

#pragma mark IPC handling

- (void)_messageRecieved:(NSNotification*)notification {
	NSLog(@"MESSAGE RECIEVED! %@", notification);
	
	NSString* command = notification.userInfo[@"command"];
	NSDictionary* args = notification.userInfo[@"args"];
	NSString* replyUUID = notification.userInfo[@"replyUUID"];
	
	void (^callback)(NSDictionary*, NSString *) = ^(NSDictionary* result, NSString *replyUUID) {
		NSString *replyMessageName = [NSString stringWithFormat:@"%@-%@", MESSAGE_NAME, replyUUID];
		[self.center postNotificationName:replyMessageName object:nil userInfo:result];
	};
	
	if ([command isEqualToString:@"didReceiveWidgetMessage"]) {
		
		[self didReceiveWidgetMessage:[args objectForKey:@"data"] functionDefinition:[args objectForKey:@"definition"] inNamespace:[args objectForKey:@"namespace"] callback:^(NSDictionary *result) {
			callback(result, replyUUID);
		}];
		
	} else if ([command isEqualToString:@"requestCurrentProperties"]) {
		
		[self requestCurrentPropertiesInNamespace:[args objectForKey:@"namespace"] callback:^(NSDictionary *result) {
			callback(result, replyUUID);
		}];
		
	} else if ([command isEqualToString:@"requestCurrentDeviceState"]) {
		
		[self requestCurrentDeviceStateWithCallback:^(NSDictionary *result) {
			callback(result, replyUUID);
		}];
		
	} else if ([command isEqualToString:@"testConnection"]) {
		callback(@{}, replyUUID);
	}
}

@end
