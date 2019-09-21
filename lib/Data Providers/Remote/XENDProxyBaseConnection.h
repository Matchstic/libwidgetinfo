//
//  XENDProxyBaseConnection.h
//  libwidgetinfo
//
//  Created by Matt Clarke on 21/09/2019.
//

#import <Foundation/Foundation.h>
#import "XENDProxyDataProvider.h"
#import "../../../daemon/Connection/XENDDaemonConnection-Protocol.h"

@interface XENDProxyBaseConnection : NSObject <XENDOriginDaemonConnection, XENDRemoteDaemonConnection>

@property (nonatomic, strong) NSMutableDictionary<NSString*, XENDProxyDataProvider*> *registeredProxyProviders;

- (void)initialise;
- (void)registerDataProvider:(XENDProxyDataProvider*)provider inNamespace:(NSString*)providerNamespace;

@end
