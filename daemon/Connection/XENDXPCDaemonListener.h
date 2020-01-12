//
//  XENDXPCDaemonListener.h
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import <Foundation/Foundation.h>
#import "XENDBaseDaemonListener.h"

@class NSXPCConnection, NSXPCListener;
@protocol NSXPCListenerDelegate <NSObject>
@optional
- (_Bool)listener:(NSXPCListener *)arg1 shouldAcceptNewConnection:(NSXPCConnection *)arg2;
@end

#ifdef __cplusplus
extern "C" {
#endif
    /**
     * Defines the entrypoint for a daemon to call from main()
     * @param machServiceName A custom mach service name to advertise under. This must match whatever is specified in your launchd plist
     */
    int libwidgetinfo_main(NSString *machServiceName);
    
#ifdef __cplusplus
}
#endif

@interface XENDXPCDaemonListener : XENDBaseDaemonListener <NSXPCListenerDelegate>

@end
