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
     */
    int libwidgetinfo_main_ipc(void);
    
#ifdef __cplusplus
}
#endif

@interface XENDIPCDaemonListener : XENDBaseDaemonListener

@end
