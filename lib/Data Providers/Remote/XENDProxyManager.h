//
//  XENDProxyManager.h
//  libwidgetinfo
//
//  Created by Matt Clarke on 21/09/2019.
//

#import <Foundation/Foundation.h>
#import "XENDProxyBaseConnection.h"

/**
 * The proxy manager abstracts away the logic of choosing which connection (simulated or XPC)
 * to use, and owns the connection's instance
 */
@interface XENDProxyManager : NSObject


+ (instancetype)sharedInstance;

/**
 * The connection instance on which to send messages to and from remote data providers
 */
- (XENDProxyBaseConnection*)connection;

@end
