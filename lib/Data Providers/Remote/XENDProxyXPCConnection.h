//
//  XENDProxyXPCConnection.h
//  libwidgetinfo
//
//  Created by Matt Clarke on 21/09/2019.
//

#import <Foundation/Foundation.h>
#import "XENDProxyBaseConnection.h"

@interface XENDProxyXPCConnection : XENDProxyBaseConnection

/**
 * Override point to set the mach service name of libwidgetinfo
 * @param name The new mach service name
 */
+ (void)setMachServiceName:(NSString*)name;

@end
