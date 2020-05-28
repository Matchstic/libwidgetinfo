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

#import "WKWebView_WidgetData.h"
#import "XENDHijackedWebViewDelegate.h"
#import "../Preprocessors/XENDPreprocessorManager.h"
#import "../Internal/XENDWidgetManager.h"

#import <objc/runtime.h>

@implementation WKWebView (WidgetData)

- (void)setHijackedNavigationDelegate:(id)object {
    objc_setAssociatedObject(self, @selector(hijackedNavigationDelegate), object, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (id)hijackedNavigationDelegate {
    return objc_getAssociatedObject(self, @selector(hijackedNavigationDelegate));
}

- (void)_setHasInjectedRuntime:(BOOL)value {
    objc_setAssociatedObject(self, @selector(_hasInjectedRuntime), [NSNumber numberWithBool:value], OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (BOOL)_hasInjectedRuntime {
    NSNumber *obj = objc_getAssociatedObject(self, @selector(_hasInjectedRuntime));
    return obj ? [obj boolValue] : NO;
}

//////////////////////////////////////////////////////////////////////////////////////////
// Additions for init
//////////////////////////////////////////////////////////////////////////////////////////

- (instancetype)initWithFrame:(CGRect)frame configuration:(WKWebViewConfiguration *)configuration injectWidgetData:(BOOL)injectWidgetData {
    
    // Inject runtime stuff if required
    if (injectWidgetData) {
        [[XENDWidgetManager sharedInstance] injectRuntime:configuration.userContentController];
        [self _setHasInjectedRuntime:YES];
    }
    
    return [self initWithFrame:frame configuration:configuration];
}

//////////////////////////////////////////////////////////////////////////////////////////
// Swizzling
//////////////////////////////////////////////////////////////////////////////////////////

+ (void)load {
    static dispatch_once_t once_token;
    dispatch_once(&once_token, ^{
        // Swizzle loading file URLs
        SEL originalLoadFileURL = @selector(loadFileURL:allowingReadAccessToURL:);
        SEL newLoadFileURL = @selector(xenhtml_loadFileURL:allowingReadAccessToURL:);
        Method originalMethod = class_getInstanceMethod(self, originalLoadFileURL);
        Method extendedMethod = class_getInstanceMethod(self, newLoadFileURL);
        method_exchangeImplementations(originalMethod, extendedMethod);
        
        // Lifecycle events
        SEL originalStopLoading = @selector(stopLoading);
        SEL newStopLoading = @selector(xenhtml_stopLoading);
        Method originalMethod2 = class_getInstanceMethod(self, originalStopLoading);
        Method extendedMethod2 = class_getInstanceMethod(self, newStopLoading);
        method_exchangeImplementations(originalMethod2, extendedMethod2);
    });
}

- (WKNavigation *)xenhtml_loadFileURL:(NSURL *)URL allowingReadAccessToURL:(NSURL *)readAccessURL {
    if (![self _hasInjectedRuntime]) {
        // Return the original implementation
        return [self xenhtml_loadFileURL:URL allowingReadAccessToURL:readAccessURL];
    } else {
        NSString *filePath = [URL path];
        NSURL *baseUrl = [URL URLByDeletingLastPathComponent];
        
        // Setup our hijacked navigation delegate if required
        if (![self hijackedNavigationDelegate]) {
            [self setHijackedNavigationDelegate:[[XENDHijackedWebViewDelegate alloc] initWithOriginalDelegate:self.navigationDelegate]];
            
            self.navigationDelegate = [self hijackedNavigationDelegate];
        }
        
        // Register widget
        [[XENDWidgetManager sharedInstance] registerWebView:self];
        
        if ([[XENDPreprocessorManager sharedInstance] needsPreprocessing:filePath]) {
            NSLog(@"DEBUG :: Pre-processing IS required for %@", filePath);
            
            NSString *preprocessedDocument = [[XENDPreprocessorManager sharedInstance] parseDocument:filePath];
            return [self loadHTMLString:preprocessedDocument baseURL:baseUrl];
        } else {
            NSLog(@"DEBUG :: Pre-processing not required for %@", filePath);
            return [self xenhtml_loadFileURL:URL allowingReadAccessToURL:readAccessURL];
        }
    }
}

- (void)xenhtml_stopLoading {
    NSString *url = [self.URL absoluteString];
    
    [[XENDWidgetManager sharedInstance] deregisterWebView:self];
    
    // Call original stopLoading - not a loop ;P
    [self xenhtml_stopLoading];
}


@end
