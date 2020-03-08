//
//  XENDNotifyDaemonListener.h
//  Daemon
//
//  Created by Matt Clarke on 07/03/2020.
//

#import <Foundation/Foundation.h>
#import "XENDBaseDaemonListener.h"

#ifdef __cplusplus
extern "C" {
#endif
    /**
     * Defines the entrypoint for a daemon to call from main()
     * @param machServiceName A custom mach service name to advertise under. This must match whatever is specified in your launchd plist
     */
    int libwidgetinfo_main_notify();
    
#ifdef __cplusplus
}
#endif

@interface XENDNotifyDaemonListener : XENDBaseDaemonListener

@end
