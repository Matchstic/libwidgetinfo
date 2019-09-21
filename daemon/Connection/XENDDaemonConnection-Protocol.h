//
//  XENDDaemonConnection-Protocol.h
//  libwidgetdata
//
//  Created by Matt Clarke on 17/09/2019.
//

/**
 * Implemented by the daemon
 */
@protocol XENDRemoteDaemonConnection <NSObject>

/**
 * Called when the device enters sleep mode
 */
- (void)noteDeviceDidEnterSleepInNamespace:(NSString*)providerNamespace;

/**
 * Called when the device leaves sleep mode
 */
- (void)noteDeviceDidExitSleepInNamespace:(NSString*)providerNamespace;

/**
 * Called when a widget message has been received for this provider
 * The callback MUST always be called into
 * @param data The data of the message received
 * @param definition The function definition that this message should be routed to
 * @param callback The callback to be notified when then the message has been handled
 */
- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback;

/**
 * Called when network access is lost
 */
- (void)networkWasDisconnectedInNamespace:(NSString*)providerNamespace;

/**
 * Called when network access is restored
 */
- (void)networkWasConnectedInNamespace:(NSString*)providerNamespace;

/**
 * Fetchs the current properties for the given namespace
 */
- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback;

@end

/**
 * Implemented by origin process
 */
@protocol XENDOriginDaemonConnection <NSObject>

/**
 * Called into the origin process to update current dynamic properties in its cache.
 */
- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace;

@end
