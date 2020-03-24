//
//  XENDHijackedWebViewDelegate.m
//  libwidgetdata
//
//  Created by Matt Clarke on 05/09/2019.
//

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

///////////////////////////////////////////////////////
// WKNavigationDelegate
///////////////////////////////////////////////////////

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
    
    if ([self.originalDelegate respondsToSelector:@selector(webView:decidePolicyForNavigationAction:decisionHandler:)])
        [self.originalDelegate webView:webView decidePolicyForNavigationAction:navigationAction decisionHandler:decisionHandler];
    else
        decisionHandler(WKNavigationActionPolicyAllow);
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
