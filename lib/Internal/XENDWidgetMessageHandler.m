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

#import "XENDWidgetMessageHandler.h"
#import "XENDLogger.h"

@interface XENDWidgetMessageHandler ()
@property (nonatomic, weak) id<XENDWidgetMessageHandlerDelegate> delegate;
@end

@implementation XENDWidgetMessageHandler

- (instancetype)initWithDelegate:(id<XENDWidgetMessageHandlerDelegate>)delegate {
    self = [super init];
    
    if (self) {
        self.delegate = delegate;
    }
    
    return self;
}

- (void)userContentController:(WKUserContentController *)userContentController
      didReceiveScriptMessage:(WKScriptMessage *)message {
    
    // Validate message handler
    if (![message.name isEqualToString:@"libwidgetinfo"]) {
        return;
    }
    
    // Handle message - conforms to NativeInterfaceMessage
    if (self.delegate) {
        [self.delegate onMessageReceivedWithPayload:message.body forWebView:message.webView];
    } else {
        XENDLog(@"libwidgetinfo :: Received message, but no delegate is available to handle it");
    }
}

@end
