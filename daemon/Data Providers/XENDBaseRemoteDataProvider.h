//
//  XENDBaseRemoteDataProvider.h
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import <Foundation/Foundation.h>
#import "../Connection/XENDBaseDaemonListener.h"

@interface XENDBaseRemoteDataProvider : NSObject

// Used to communicate data back to connected processes
@property (nonatomic, weak) XENDBaseDaemonListener *connection;

@property (nonatomic, strong) NSDictionary *cachedStaticProperties;
@property (nonatomic, strong) NSMutableDictionary *cachedDynamicProperties;

- (instancetype)initWithConnection:(XENDBaseDaemonListener*)connection;

/**
 * Called to initialise the data provider. Useful for subclasses
 */
- (void)intialiseProvider;

/**
 * The data namespace provided by the data provider
 */
+ (NSString*)providerNamespace;

/**
 * Called when the device enters sleep mode
 */
- (void)noteDeviceDidEnterSleep;

/**
 * Called when the device leaves sleep mode
 */
- (void)noteDeviceDidExitSleep;

/**
 * Called when the daemon is connected to by a remote process
 * @return Cached data for the provider, in the form: "static": ..., "dynamic": ...
 */
- (NSDictionary*)currentData;

/**
 * Called when a widget message has been received for this provider
 * The callback MUST always be called into
 * @param data The data of the message received
 * @param definition The function definition that this message should be routed to
 * @param callback The callback to be notified when then the message has been handled
 */
- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback;

/**
 * Called when network access is lost
 */
- (void)networkWasDisconnected;

/**
 * Called when network access is restored
 */
- (void)networkWasConnected;

/**
 * URL escapes the provided input
 */
- (NSString*)escapeString:(NSString*)input;

/**
 * Notifies the origin counterpart of updated dynamic data
 */
- (void)notifyRemoteForNewDynamicProperties;

@end
