//
//  XENDSimulatedDaemonListener.h
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import <Foundation/Foundation.h>
#import "XENDBaseDaemonListener.h"
#import "XENDDaemonConnection-Protocol.h"

@interface XENDSimulatedDaemonListener : XENDBaseDaemonListener

- (instancetype)initWithDelegate:(id<XENDOriginDaemonConnection>)delegate;

@end
