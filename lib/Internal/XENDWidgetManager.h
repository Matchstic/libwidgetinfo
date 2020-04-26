/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
**/

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
