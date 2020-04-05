//
//  XENDWidgetManager.h
//  libwidgetdata
//
//  Created by Matt Clarke on 15/09/2019.
//
// Notes:
// - Custom URL scheme on iOS 9 and 10: https://github.com/wilddylan/WKWebViewWithURLProtocol

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>

#import "XENDWidgetMessageHandler.h"
#import "XENDWidgetManager-Protocol.h"

@interface XENDWidgetManager : NSObject <XENDWidgetMessageHandlerDelegate, XENDWidgetManagerDelegate>

/**
 Call to setup the library
 */
+ (void)initialiseLibrary;

+ (instancetype)sharedInstance;

/**
 Registers a new webview after loading a file URL has begun
 */
- (void)registerWebView:(WKWebView*)webView;

/**
 Removes a webview after it has been notified to stop loading
 */
- (void)deregisterWebView:(WKWebView*)webView;

/**
 Injects api runtime into the provided content controller of a webview
 */
- (void)injectRuntime:(WKUserContentController*)contentController;

/**
 Called when a webview finishes loading for current provider properties to be injected.
 */
- (void)notifyWebViewLoaded:(WKWebView*)webView;

/**
Called by daemon when the device enters sleep mode
 */
- (void)noteDeviceDidEnterSleep;

/**
Called by daemon when the device leaves sleep mode
 */
- (void)noteDeviceDidExitSleep;

/**
Called by daemon when the device gains network connection
*/
- (void)networkWasConnected;

/**
Called by daemon when the device looses network connection
*/
- (void)networkWasDisconnected;

@end
