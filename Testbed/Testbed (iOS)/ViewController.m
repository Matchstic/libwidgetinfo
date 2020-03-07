//
//  ViewController.m
//  Testbed
//
//  Created by Matt Clarke on 12/08/2019.
//  Copyright © 2019 Matt Clarke. All rights reserved.
//

#import "ViewController.h"

@interface WKPreferences (Private)
- (void)_setAllowFileAccessFromFileURLs:(BOOL)arg1;
- (void)_setAntialiasedFontDilationEnabled:(BOOL)arg1;
- (void)_setCompositingBordersVisible:(BOOL)arg1;
- (void)_setCompositingRepaintCountersVisible:(BOOL)arg1;
- (void)_setDeveloperExtrasEnabled:(BOOL)arg1;
- (void)_setDiagnosticLoggingEnabled:(BOOL)arg1;
- (void)_setFullScreenEnabled:(BOOL)arg1;
- (void)_setJavaScriptRuntimeFlags:(unsigned int)arg1;
- (void)_setLogsPageMessagesToSystemConsoleEnabled:(BOOL)arg1;
- (void)_setMediaDevicesEnabled:(bool)arg1;
- (void)_setPageVisibilityBasedProcessSuppressionEnabled:(bool)arg1;
- (void)_setOfflineApplicationCacheIsEnabled:(BOOL)arg1;
- (void)_setSimpleLineLayoutDebugBordersEnabled:(BOOL)arg1;
- (void)_setStandalone:(BOOL)arg1;
- (void)_setStorageBlockingPolicy:(int)arg1;
- (void)_setTelephoneNumberDetectionIsEnabled:(BOOL)arg1;
- (void)_setTiledScrollingIndicatorVisible:(BOOL)arg1;
- (void)_setVisibleDebugOverlayRegions:(unsigned int)arg1;

- (void)_setResourceUsageOverlayVisible:(bool)arg1 ;
@end

@interface ViewController ()

@end

@interface WKWebView (libwidgetinfo)
- (instancetype)initWithFrame:(CGRect)frame configuration:(WKWebViewConfiguration *)configuration injectWidgetData:(BOOL)injectWidgetData;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    [self setupWebView];
    
    // Load the webview
    // NSString *testWidget = @"/opt/simject/var/mobile/Library/iWidgets/Xperia Clock DEBUG/Widget.html";
    // NSString *testWidget = @"/opt/simject/var/mobile/Library/iWidgets/AppleishBlur/Widget.html";
    // NSString *testWidget = @"/opt/simject/var/mobile/Library/iWidgets/IS2 Weather Base/Widget.html";
    NSString *testWidget = @"/opt/simject/var/mobile/Library/SBHTML/UniAW2018_Base_Matt/Wallpaper.html";
    NSURL *url = [NSURL fileURLWithPath:testWidget];
    
    [self.webView loadFileURL:url allowingReadAccessToURL:[NSURL fileURLWithPath:@"/" isDirectory:YES]];
}

- (void)setupWebView {
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    
    // Configure some private settings on WKWebView
    WKPreferences *preferences = [[WKPreferences alloc] init];
    [preferences _setAllowFileAccessFromFileURLs:YES];
    [preferences _setFullScreenEnabled:NO];
    [preferences _setOfflineApplicationCacheIsEnabled:YES]; // Local storage is needed for Lock+ etc.
    [preferences _setStandalone:NO];
    [preferences _setTelephoneNumberDetectionIsEnabled:NO];
    [preferences _setTiledScrollingIndicatorVisible:NO];
    [preferences _setLogsPageMessagesToSystemConsoleEnabled:YES];
    //[preferences _setPageVisibilityBasedProcessSuppressionEnabled:YES];
    
    if ([preferences respondsToSelector:@selector(_setMediaDevicesEnabled:)]) {
        [preferences _setMediaDevicesEnabled:YES];
    }
    
    config.preferences = preferences;
    
    WKUserContentController *userContentController = [[WKUserContentController alloc] init];
    
    // This script is utilised to stop the loupé that iOS creates on long-press
    NSString *source1 = @"var style = document.createElement('style'); \
    style.type = 'text/css'; \
    style.innerText = '* { -webkit-user-select: none; -webkit-touch-callout: none; } body { background-color: transparent; }'; \
    var head = document.getElementsByTagName('head')[0];\
    head.appendChild(style);";
    WKUserScript *stopCallouts = [[WKUserScript alloc] initWithSource:source1 injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
    
    // Prevents scaling of the viewport
    NSString *source2 = @"var doc = document.documentElement; \
    var meta = document.createElement('meta'); \
    meta.name = 'viewport'; \
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no'; \
    var head = document.head; \
    if (!head) { head = document.createElement('head'); doc.appendChild(head); } \
    head.appendChild(meta);";
    
    WKUserScript *stopScaling = [[WKUserScript alloc] initWithSource:source2 injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    
    [userContentController addUserScript:stopCallouts];
    [userContentController addUserScript:stopScaling];
    
    config.userContentController = userContentController;
    
    self.webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:config injectWidgetData:YES];
    self.webView.translatesAutoresizingMaskIntoConstraints = NO;
    self.webView.backgroundColor = [UIColor clearColor];
    self.webView.opaque = NO;
    self.webView.scrollView.layer.masksToBounds = NO;
    
    self.webView.scrollView.scrollEnabled = NO;
    self.webView.scrollView.contentSize = self.webView.bounds.size;
    
    self.webView.scrollView.bounces = NO;
    self.webView.scrollView.scrollsToTop = NO;
    self.webView.scrollView.minimumZoomScale = 1.0;
    self.webView.scrollView.maximumZoomScale = 1.0;
    self.webView.scrollView.multipleTouchEnabled = YES;
    
    self.webView.allowsLinkPreview = NO;
    
    [self.view addSubview:self.webView];
}

- (void)viewDidLayoutSubviews {
    self.webView.frame = CGRectMake(0, 20, self.view.frame.size.width, self.view.frame.size.height - 20);
}

@end
