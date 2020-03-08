//
//  XENDBaseDaemonListener.h
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import <Foundation/Foundation.h>
#import "XENDDaemonConnection-Protocol.h"
#import "../State/XENDStateManager.h"

@interface XENDBaseDaemonListener : NSObject <XENDRemoteDaemonConnection, XENDStateManagerDelegate>

- (void)initialise;
- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace;

@end
