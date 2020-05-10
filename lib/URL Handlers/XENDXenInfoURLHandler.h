//
//  XENDXenInfoURLHandler.h
//  libwidgetinfo
//
//  Created by Matt Clarke on 10/05/2020.
//

#import "XENDBaseURLHandler.h"

@interface XENDXenInfoURLHandler : XENDBaseURLHandler

/**
 * Exposed for usage by the widget navigation handler.
 *
 * This is where legacy XenInfo `window.location` redirects get piped.
 */
+ (BOOL)handleNavigationRequest:(NSURL*)url;

@end
