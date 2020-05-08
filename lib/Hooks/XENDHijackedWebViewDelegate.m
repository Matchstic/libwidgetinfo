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

#import "XENDHijackedWebViewDelegate.h"
#import "../Internal/XENDWidgetManager.h"

@interface XENDHijackedWebViewDelegate ()

@property (nonatomic, strong) id originalDelegate;

@end

@implementation XENDHijackedWebViewDelegate

- (instancetype)initWithOriginalDelegate:(id)delegate {
    self = [super init];
    
    if (self) {
        self.originalDelegate = delegate;
    }
    
    return self;
}

#pragma mark - WKNavigationDelegate

- (void)webView:(WKWebView *)webView
    didStartProvisionalNavigation:(WKNavigation *)navigation {
    
    if ([self.originalDelegate respondsToSelector:@selector(webView:didStartProvisionalNavigation:)])
        [self.originalDelegate webView:webView didStartProvisionalNavigation:navigation];
}

- (void)webView:(WKWebView *)webView
    didFailProvisionalNavigation:(WKNavigation *)navigation
    withError:(NSError *)error {
    
    if ([self.originalDelegate respondsToSelector:@selector(webView:didFailProvisionalNavigation:withError:)])
        [self.originalDelegate webView:webView didFailProvisionalNavigation:navigation withError:error];
}

- (void)webView:(WKWebView *)webView
    didCommitNavigation:(WKNavigation *)navigation {
    
    if ([self.originalDelegate respondsToSelector:@selector(webView:didCommitNavigation:)])
        [self.originalDelegate webView:webView didCommitNavigation:navigation];
}

- (void)webView:(WKWebView *)webView
    didFinishNavigation:(WKNavigation *)navigation {
    
    if ([self.originalDelegate respondsToSelector:@selector(webView:didFinishNavigation:)])
        [self.originalDelegate webView:webView didFinishNavigation:navigation];
    
    // Register to widget manager if required
    NSString *url = [webView.URL absoluteString];
    
    if (![url isEqualToString:@""] && ![url isEqualToString:@"about:blank"]) {
        NSLog(@"DEBUG :: Notify widget has loaded, presenting from: %@", url);
        [[XENDWidgetManager sharedInstance] notifyWebViewLoaded:webView];
    }
}

- (void)webView:(WKWebView *)webView
    didFailNavigation:(WKNavigation *)navigation
    withError:(NSError *)error {
    
    if ([self.originalDelegate respondsToSelector:@selector(webView:didFailNavigation:withError:)])
        [self.originalDelegate webView:webView didFailNavigation:navigation withError:error];
}

- (void)webView:(WKWebView *)webView
    decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction
    decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    
    NSString *url = [[navigationAction.request URL] absoluteString];
    BOOL isXenInfoSpecialCase = [url hasPrefix:@"xeninfo:"] || [url hasPrefix:@"mk1:"];
    
    if ([url hasPrefix:@"file:"]) {
        decisionHandler(WKNavigationActionPolicyAllow);
        return;
    }
    
    if ([url hasPrefix:@"about:"]) {
       decisionHandler(WKNavigationActionPolicyAllow);
       return;
    }
    
    if (!isXenInfoSpecialCase) {
        // Disallow the navigation, but load the URL in appropriate app
        decisionHandler(WKNavigationActionPolicyCancel);
        
        if (@available(iOS 10.0, *)) {
            [[UIApplication sharedApplication] openURL:[navigationAction.request URL] options:@{} completionHandler:nil];
        } else {
            [[UIApplication sharedApplication] openURL:[navigationAction.request URL]];
        }
    } else if ([self.originalDelegate respondsToSelector:@selector(webView:decidePolicyForNavigationAction:decisionHandler:)])
        [self.originalDelegate webView:webView decidePolicyForNavigationAction:navigationAction decisionHandler:decisionHandler];
    else
        decisionHandler(WKNavigationActionPolicyCancel);
}

- (void)webView:(WKWebView *)webView
    decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse
    decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler {
    
    if ([self.originalDelegate respondsToSelector:@selector(webView:decidePolicyForNavigationResponse:decisionHandler:)])
        [self.originalDelegate webView:webView decidePolicyForNavigationResponse:navigationResponse decisionHandler:decisionHandler];
    else
        decisionHandler(WKNavigationActionPolicyAllow);
}

- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView {
    if ([self.originalDelegate respondsToSelector:@selector(webViewWebContentProcessDidTerminate:)])
        [self.originalDelegate webViewWebContentProcessDidTerminate:webView];
}

@end
