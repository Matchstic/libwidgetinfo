//
//  XENDDaemonListener.m
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import "XENDXPCDaemonListener.h"
#import "XENDDaemonConnection-Protocol.h"

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

@interface NSXPCListener : NSObject
@property (nonatomic, weak) id delegate;
- (id)initWithMachServiceName:(id)arg1;

- (void)invalidate;
- (void)resume;
@end

@interface XENDXPCDaemonListener ()

@property (nonatomic, strong) NSMutableArray<NSXPCConnection*> *xpcConnections;
@property (nonatomic, strong) NSMutableArray *pendingXpcConnectionQueue;

- (void)_initialiseListener;

@end

int libwidgetinfo_main(NSString *customMachServiceName) {
    NSLog(@"*** [libwidgetinfo] :: Loading up daemon.");
    
    // initialize our daemon
    XENDXPCDaemonListener *daemon = [[XENDXPCDaemonListener alloc] init];
    
    // Bypass compiler prohibited errors
    Class NSXPCListenerClass = NSClassFromString(@"NSXPCListener");
    
    if (!customMachServiceName || [customMachServiceName isEqualToString:@""])
        customMachServiceName = @"com.matchstic.widgetinfod";
	
	NSLog(@"*** [libwidgetinfo] :: Mach service name: %@", customMachServiceName);
    NSXPCListener *listener = [[NSXPCListenerClass alloc] initWithMachServiceName:customMachServiceName];
    listener.delegate = daemon;
	
	NSLog(@"*** [libwidgetinfo] :: Listener: %@", listener);
	
    [listener resume];
    
    // Run the run loop forever.
    [[NSRunLoop currentRunLoop] run];
    
    return EXIT_SUCCESS;
}

@implementation XENDXPCDaemonListener

- (instancetype)init {
    self = [super init];
    
    if (self) {
        [self _initialiseListener];
    }
    
    return self;
}

- (void)_initialiseListener {
    self.xpcConnections = [NSMutableArray array];
	
	dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0) , ^{
		[self initialise];
	});
}

- (BOOL)listener:(NSXPCListener *)listener shouldAcceptNewConnection:(NSXPCConnection *)newConnection {
    // Configure bi-directional communication
    NSLog(@"*** [libwidgetinfo] :: shouldAcceptNewConnection recieved.");
    
    [newConnection setExportedInterface:[NSXPCInterface interfaceWithProtocol:@protocol(XENDRemoteDaemonConnection)]];
    [newConnection setExportedObject:self];
    
    [self.xpcConnections addObject:newConnection];
    
    // When it is e.g. killed, then the invalidation handler is called
    __weak XENDXPCDaemonListener *weakSelf = self;
    __weak NSXPCConnection *weakConnection = newConnection;
    
    newConnection.interruptionHandler = ^{
        NSLog(@"*** [libwidgetinfo] :: Interruption handler called");
        [weakConnection invalidate];
        [weakSelf.xpcConnections removeObject:weakConnection];
    };
    newConnection.invalidationHandler = ^{
        NSLog(@"*** [libwidgetinfo] :: Invalidation handler called");
        [weakConnection invalidate];
        [weakSelf.xpcConnections removeObject:weakConnection];
    };
    
    newConnection.remoteObjectInterface = [NSXPCInterface interfaceWithProtocol: @protocol(XENDOriginDaemonConnection)];
    [newConnection resume];
    
    return YES;
}

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Forward update back to connections
    for (NSXPCConnection *connection in self.xpcConnections) {
        [connection.remoteObjectProxy notifyUpdatedDynamicProperties:dynamicProperties forNamespace:dataProviderNamespace];
    }
}

- (void)noteDeviceDidEnterSleep {
	[super noteDeviceDidEnterSleep];
	
    for (NSXPCConnection *connection in self.xpcConnections) {
        [connection.remoteObjectProxy noteDeviceDidEnterSleep];
    }
}

- (void)noteDeviceDidExitSleep {
	[super noteDeviceDidExitSleep];
	
    for (NSXPCConnection *connection in self.xpcConnections) {
        [connection.remoteObjectProxy noteDeviceDidExitSleep];
    }
}

- (void)networkWasConnected {
	[super networkWasConnected];
	
    for (NSXPCConnection *connection in self.xpcConnections) {
        [connection.remoteObjectProxy networkWasConnected];
    }
}

- (void)networkWasDisconnected {
	[super networkWasDisconnected];
	
    for (NSXPCConnection *connection in self.xpcConnections) {
        [connection.remoteObjectProxy networkWasDisconnected];
    }
}

@end
