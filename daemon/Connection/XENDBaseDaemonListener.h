//
//  XENDBaseDaemonListener.h
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import <Foundation/Foundation.h>
#import "XENDDaemonConnection-Protocol.h"

@interface XENDBaseDaemonListener : NSObject <XENDRemoteDaemonConnection>

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace;

@end
