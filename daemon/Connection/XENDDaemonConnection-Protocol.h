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
 * Called when a widget message has been received for this provider
 * The callback MUST always be called into
 * @param data The data of the message received
 * @param definition The function definition that this message should be routed to
 * @param callback The callback to be notified when then the message has been handled
 */
- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback;

/**
 * Fetchs the current properties for the given namespace
 */
- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback;


/**
 Requests the current device state to be sent to the calling client
 Reponse format:
 {
    "sleep": boolean,
    "network": boolean
 }
 */
@optional
- (void)requestCurrentDeviceStateWithCallback:(void(^)(NSDictionary*))callback;

@end

/**
 * Implemented by origin process
 */
@protocol XENDOriginDaemonConnection <NSObject>

/**
 * Called into the origin process to update current dynamic properties in its cache.
 */
- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace;

/**
 * Called when the device enters sleep mode
 */
- (void)noteDeviceDidEnterSleep;

/**
 * Called when the device leaves sleep mode
 */
- (void)noteDeviceDidExitSleep;
/**
 * Called when network access is lost
 */
- (void)networkWasDisconnected;

/**
 * Called when network access is restored
 */
- (void)networkWasConnected;

@end
