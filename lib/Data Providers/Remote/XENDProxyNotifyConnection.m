//
//  XENDNotifyConnection.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 07/03/2020.
//

#import "XENDProxyNotifyConnection.h"

@interface NSDistributedNotificationCenter : NSNotificationCenter
+(instancetype)defaultCenter;
@end

@interface XENDProxyNotifyConnection ()
@property (nonatomic, strong) NSDistributedNotificationCenter *center;
@end

#define MESSAGE_NAME 			@"WidgetInfo-server-callable"
#define MESSAGE_NAME_PROPERTIES @"WidgetInfo-server-properties"
#define MESSAGE_NAME_STATE		@"WidgetInfo-server-state"

@implementation XENDProxyNotifyConnection

- (instancetype)init {
    self = [super init];
    
    if (self) {

	}
    
    return self;
}

- (void)initialise {
	self.center = [NSDistributedNotificationCenter defaultCenter];
	
	[self.center addObserver:self selector:@selector(_messagePropertiesRecieved:) name:MESSAGE_NAME_PROPERTIES object:nil];
	[self.center addObserver:self selector:@selector(_messageStateRecieved:) name:MESSAGE_NAME_STATE object:nil];
	
	NSString *replyUUID = [[NSUUID UUID] UUIDString];
	
	[self _awaitReplyForMessage:MESSAGE_NAME replyUUID:replyUUID callback:^(NSDictionary *result) {
		// Notify providers of connection
		for (XENDProxyDataProvider *dataProvider in self.registeredProxyProviders.allValues) {
			[dataProvider notifyDaemonConnected];
		}
	}];
	
	[self.center postNotificationName:MESSAGE_NAME object:nil userInfo:@{
		@"command": @"testConnection",
		@"args": @{},
		@"replyUUID": replyUUID
	}];
}

#pragma mark Protocol stuff - overrides

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    
	NSDictionary *args = @{
		@"data": data,
		@"definition": definition,
		@"namespace": providerNamespace
	};
	
	NSString *replyUUID = [[NSUUID UUID] UUIDString];
	
	[self _awaitReplyForMessage:MESSAGE_NAME replyUUID:replyUUID callback:^(NSDictionary *result) {
		callback(result);
	}];
	
	[self.center postNotificationName:MESSAGE_NAME object:nil userInfo:@{
		@"command": @"didReceiveWidgetMessage",
		@"args": args,
		@"replyUUID": replyUUID
	}];
}

- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
	NSDictionary *args = @{
		@"namespace": providerNamespace
	};
	
	NSString *replyUUID = [[NSUUID UUID] UUIDString];
	
	[self _awaitReplyForMessage:MESSAGE_NAME replyUUID:replyUUID callback:^(NSDictionary *result) {
		callback(result);
	}];
	
	[self.center postNotificationName:MESSAGE_NAME object:nil userInfo:@{
		@"command": @"requestCurrentProperties",
		@"args": args,
		@"replyUUID": replyUUID
	}];
}

- (void)requestCurrentDeviceStateWithCallback:(void(^)(NSDictionary*))callback {
	NSString *replyUUID = [[NSUUID UUID] UUIDString];
	
	[self _awaitReplyForMessage:MESSAGE_NAME replyUUID:replyUUID callback:^(NSDictionary *result) {
		callback(result);
	}];
	
	[self.center postNotificationName:MESSAGE_NAME object:nil userInfo:@{
		@"command": @"requestCurrentDeviceState",
		@"args": @{},
		@"replyUUID": replyUUID
	}];
}

#pragma mark Incoming IPC messages

- (void)_awaitReplyForMessage:(NSString*)messageName replyUUID:(NSString*)replyUUID callback:(void(^)(NSDictionary*))callback {
	__weak NSDistributedNotificationCenter* weakNotificationCenter = self.center;
	NSOperationQueue* operationQueue = [NSOperationQueue new];
	
	NSString *replyMessageName = [NSString stringWithFormat:@"%@-%@", messageName, replyUUID];
	
	__block id observer = [self.center addObserverForName:replyMessageName object:nil queue:operationQueue usingBlock:^(NSNotification* notification){
		callback(notification.userInfo);
		[weakNotificationCenter removeObserver:observer];
		observer = nil;
	}];
}

- (void)_messagePropertiesRecieved:(NSNotification*)notification {
	NSDictionary *args = [notification userInfo];
	
	NSDictionary *data = [args objectForKey:@"data"];
	NSString *namespace = [args objectForKey:@"namespace"];
	
	[self notifyUpdatedDynamicProperties:data forNamespace:namespace];
}

- (void)_messageStateRecieved:(NSNotification*)notification {
	NSDictionary *args = [notification userInfo];
	
	NSNumber *sleep = [args objectForKey:@"sleep"];
	NSNumber *network = [args objectForKey:@"network"];
	
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
