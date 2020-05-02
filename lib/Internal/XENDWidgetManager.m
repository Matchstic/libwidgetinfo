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

#import "XENDWidgetManager.h"
#import "../Data Providers/XENDBaseDataProvider.h"
#import "../URL Handlers/XENDBaseURLHandler.h"

// Provider imports
#import "../Data Providers/System/XENDSystemDataProvider.h"
#import "../Data Providers/Media/XENDMediaDataProvider.h"
#import "../Data Providers/Weather/XENDWeatherDataProvider.h"
#import "../Data Providers/Resources/XENDResourcesDataProvider.h"

// URL handler imports
#import "../URL Handlers/XENDWidgetWeatherURLHandler.h"
#import "../URL Handlers/XENDInfoStats1URLHandler.h"
#import "../URL Handlers/XENDLibraryURLHandler.h"

// Horrible internal hacks for NSURLProtocol to work as intended
#import <objc/runtime.h>
@interface WKBrowsingContextController : NSObject
+ (void)registerSchemeForCustomProtocol:(NSString*)arg1;
@end

@interface XENDWidgetManager ()
@property (nonatomic, strong) NSMutableArray<WKWebView*> *managedWebViews;
@property (nonatomic, strong) XENDWidgetMessageHandler *messageHandler;

@property (nonatomic, strong) NSDictionary<NSString*, XENDBaseDataProvider*> *dataProviders;
@property (nonatomic, strong) NSTimer *dynamicFlushTimer;
@end

static NSString *preferencesId = @"com.matchstic.xenhtml.libwidgetinfo";
#define CACHE_BASE_PATH @"/var/mobile/Library/Caches"

@implementation XENDWidgetManager

+ (void)initialiseLibrary {
	[WKWebView load];
}

+ (instancetype)sharedInstance {
    static XENDWidgetManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDWidgetManager alloc] init];
    });
    
    return sharedInstance;
}

- (instancetype)init {
    self = [super init];
    
    if (self) {
        self.managedWebViews = [NSMutableArray array];
        self.messageHandler = [[XENDWidgetMessageHandler alloc] initWithDelegate:self];
        
        self.dataProviders = [self _loadDataProviders];
        
        self.dynamicFlushTimer = [NSTimer scheduledTimerWithTimeInterval:120
                                                                  target:self
                                                                selector:@selector(_flushCurrentDynamicStateToDisk:)
                                                                userInfo:nil
                                                                 repeats:YES];
        
        // These get registered globally
        [self _loadURLHandlers];
        
        // Setup significant time monitoring
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_significantTimeChanged:) name:UIApplicationSignificantTimeChangeNotification object:nil];
    }
    
    return self;
}

- (void)registerWebView:(WKWebView*)webView {
    if (![self.managedWebViews containsObject:webView]) {
        [self.managedWebViews addObject:webView];
    }
}

- (void)deregisterWebView:(WKWebView*)webView {
    if ([self.managedWebViews containsObject:webView]) {
        [self.managedWebViews removeObject:webView];
    }
}

- (void)notifyWebViewLoaded:(WKWebView*)webView {
    // Inject cached data
    
    NSString *updateString = [self _updateString:YES];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [webView evaluateJavaScript:updateString completionHandler:^(id object, NSError *error) {
            if (error) {
                NSLog(@"notifyWebViewLoaded :: ERROR during JS execution: %@", error);
            }
        }];
    });
}

// Exposed for the battery manager
- (void)notifyWidgetUnpaused:(WKWebView*)webView {
    NSString *updateString = [self _updateString:NO];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [webView evaluateJavaScript:updateString completionHandler:^(id object, NSError *error) {
            if (error) {
                NSLog(@"notifyWebViewLoaded :: ERROR during JS execution: %@", error);
            }
        }];
    });
}

- (NSString*)_updateString:(BOOL)isFirstLoad {
    NSString *updateString = @"";
    
    // Add loaded method call
    if (isFirstLoad)
        updateString = [updateString stringByAppendingString:@"api._middleware.onLoad();\n"];
    
    for (NSString *providerNamespace in self.dataProviders.allKeys) {
        XENDBaseDataProvider *provider = [self.dataProviders objectForKey:providerNamespace];
        
        NSDictionary *data = [provider cachedData];
        NSDictionary *payload = @{ @"namespace": providerNamespace, @"payload": data };
        NSDictionary *retval = @{ @"type": @"dataupdate", @"data": payload };
        
        NSString *innerUpdateString = [NSString stringWithFormat:@"api._middleware.onInternalNativeMessage(%@);\n",
                                  [self _parseToJSON:retval]];
        updateString = [updateString stringByAppendingString:innerUpdateString];
    }
    
    return updateString;
}

- (void)injectRuntime:(WKUserContentController*)contentController {
#if TARGET_IPHONE_SIMULATOR==0
    NSString *scriptLocation = @"/Library/Application Support/Widgets/libwidgetinfo.js";
#else
    NSString *scriptLocation = @"/Users/matt/iOS/Projects/Xen-HTML/deps/libwidgetinfo/lib/Middleware/build/libwidgetinfo.js";
#endif
    
    NSString *content = [NSString stringWithContentsOfFile:scriptLocation encoding:NSUTF8StringEncoding error:NULL];
    WKUserScript *runtimeScript = [[WKUserScript alloc] initWithSource:content injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    
    [contentController addUserScript:runtimeScript];
    
    // Setup message handler
    [contentController addScriptMessageHandler:self.messageHandler name:@"libwidgetinfo"];
}

#pragma mark Message handler delegate

- (void)onMessageReceivedWithPayload:(NSDictionary*)payload forWebView:(WKWebView*)webview {
    // Payload is an NSDictionary conforming to NativeInterfaceMessage
    
    // Validate initial payload
    if (!payload || ![payload isKindOfClass:[NSDictionary class]]) {
        NSLog(@"libwidgetinfo :: Received a malformed webview message, ignoring");
        return;
    }
    
    // Validate webview
    if (![self.managedWebViews containsObject:webview]) {
        NSLog(@"libwidgetinfo :: Received a webview message that we don't currently manage, ignoring");
        return;
    }
    
    id callbackId = [payload objectForKey:@"callbackId"];
    NSDictionary *innerPayload = [payload objectForKey:@"payload"];
    
    if (!callbackId || !innerPayload) {
        NSLog(@"libwidgetinfo :: Received a malformed webview message, ignoring");
        return;
    }
    
    NSString *namespace = [innerPayload objectForKey:@"namespace"];
    NSString *functionDefinition = [innerPayload objectForKey:@"functionDefinition"];
    NSDictionary *data = [innerPayload objectForKey:@"data"];
    
    XENDBaseDataProvider *provider = [self.dataProviders objectForKey:namespace];
    if (provider) {
        [provider didReceiveWidgetMessage:data
                       functionDefinition:functionDefinition
                                 callback:^(NSDictionary *result) {
                                     
            if (!result)
                result = @{};
            
            NSDictionary *retval = @{ @"type": @"callback", @"data": result, @"callbackId": callbackId };
            
            NSString *updateString = [NSString stringWithFormat:@"api._middleware.onInternalNativeMessage(%@)",
                                      [self _parseToJSON:retval]];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                [webview evaluateJavaScript:updateString
                          completionHandler:^(id res, NSError * _Nullable error) {
                    if (error) {
                        NSLog(@"onMessageReceivedWithPayload :: ERROR during JS execution: %@", error);
                    }
                }];
            });
        }];
    } else {
        NSLog(@"libwidgetinfo :: Could not find provider for namespace: %@", namespace);
    }
}

-(NSString*)_parseToJSON:(NSDictionary*)dict {
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict
                                                       options:0
                                                         error:&error];
    
    if (!jsonData) {
        NSLog(@"%s: error: %@", __func__, error.localizedDescription);
        return @"{}";
    } else {
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
}

- (void)_flushCurrentDynamicStateToDisk:(NSTimer*)sender {
    NSMutableDictionary *currentState = [NSMutableDictionary dictionary];
    
    for (XENDBaseDataProvider *provider in self.dataProviders.allValues) {
        NSString *namespace = [[provider class] providerNamespace];
        NSDictionary *cachedData = [provider cachedDynamicProperties];
        
        if (namespace && cachedData)
            [currentState setObject:[provider cachedDynamicProperties] forKey:namespace];
    }
    
    // Archive to handle unexpected types
    NSData *archived = [NSKeyedArchiver archivedDataWithRootObject:currentState];
    
    NSString *cachePath = [NSString stringWithFormat:@"%@/%@.plist", CACHE_BASE_PATH, preferencesId];
    
    // Write to cache
    NSMutableDictionary *cache = [NSMutableDictionary dictionaryWithContentsOfFile:cachePath];
    if (!cache) cache = [NSMutableDictionary dictionary];
    
    [cache setObject:archived forKey:@"cachedState"];
    [cache writeToFile:cachePath atomically:YES];
}

- (NSDictionary*)_loadCurrentDynamicStateFromDisk {
    NSString *cachePath = [NSString stringWithFormat:@"%@/%@.plist", CACHE_BASE_PATH, preferencesId];
    
    NSMutableDictionary *cache = [NSMutableDictionary dictionaryWithContentsOfFile:cachePath];
    if (!cache) cache = [NSMutableDictionary dictionary];
    
    NSData *state = [cache objectForKey:@"cachedState"];
    
    return state ? [NSKeyedUnarchiver unarchiveObjectWithData:state] : nil;
}

#pragma mark Data provider handling

- (void)updateWidgetsWithNewData:(NSDictionary*)data forNamespace:(NSString*)providerNamespace {
    NSDictionary *payload = @{ @"namespace": providerNamespace, @"payload": data };
    NSDictionary *retval = @{ @"type": @"dataupdate", @"data": payload };
    
    NSString *updateString = [NSString stringWithFormat:@"api._middleware.onInternalNativeMessage(%@)",
                              [self _parseToJSON:retval]];
    
    // Loop over widget array, and call update as required.
    for (WKWebView *widget in self.managedWebViews) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [widget evaluateJavaScript:updateString completionHandler:^(id object, NSError *error) {
                if (error) {
                    NSLog(@"updateWidgetsWithNewData :: ERROR during JS execution: %@", error);
                }
            }];
        });
    }
}

- (NSDictionary*)_loadDataProviders {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    
    // Load previous dynamics state
    NSDictionary *currentCachedDynamicState = [self _loadCurrentDynamicStateFromDisk];
    
    XENDSystemDataProvider *system = [[XENDSystemDataProvider alloc] init];
    [system registerDelegate:self];
    [result setObject:system forKey:[XENDSystemDataProvider providerNamespace]];
    if (currentCachedDynamicState && [system.cachedDynamicProperties isEqualToDictionary:@{}])
        system.cachedDynamicProperties = [currentCachedDynamicState objectForKey:[XENDSystemDataProvider providerNamespace]];
    
    XENDMediaDataProvider *media = [[XENDMediaDataProvider alloc] init];
    [media registerDelegate:self];
    [result setObject:media forKey:[XENDMediaDataProvider providerNamespace]];
    if (currentCachedDynamicState && [media.cachedDynamicProperties isEqualToDictionary:@{}])
        media.cachedDynamicProperties = [currentCachedDynamicState objectForKey:[XENDMediaDataProvider providerNamespace]];
    
    XENDWeatherDataProvider *weather = [[XENDWeatherDataProvider alloc] init];
    [weather registerDelegate:self];
    [result setObject:weather forKey:[XENDWeatherDataProvider providerNamespace]];
    if (currentCachedDynamicState && [weather.cachedDynamicProperties isEqualToDictionary:@{}])
        weather.cachedDynamicProperties = [currentCachedDynamicState objectForKey:[XENDWeatherDataProvider providerNamespace]];
    
    XENDResourcesDataProvider *resources = [[XENDResourcesDataProvider alloc] init];
    [resources registerDelegate:self];
    [result setObject:resources forKey:[XENDResourcesDataProvider providerNamespace]];
    if (currentCachedDynamicState && [resources.cachedDynamicProperties isEqualToDictionary:@{}])
        resources.cachedDynamicProperties = [currentCachedDynamicState objectForKey:[XENDResourcesDataProvider providerNamespace]];
    
    return result;
}

- (void)_significantTimeChanged:(NSNotification*)notification {
    for (XENDBaseDataProvider *provider in self.dataProviders.allValues) {
        [provider noteSignificantTimeChange];
    }
}

- (void)_loadURLHandlers {
    // First, register available schemes into WebKit
    [objc_getClass("WKBrowsingContextController") registerSchemeForCustomProtocol:@"file"];
    [objc_getClass("WKBrowsingContextController") registerSchemeForCustomProtocol:@"xui"];

    // Now, register them with NSURLProtocol
    [NSURLProtocol registerClass:[XENDWidgetWeatherURLHandler class]];
    [NSURLProtocol registerClass:[XENDLibraryURLHandler class]];
    [NSURLProtocol registerClass:[XENDInfoStats1URLHandler class]];
}

// Used internally by the URL handlers
- (id)providerForNamespace:(NSString*)providerNamespace {
    return [self.dataProviders objectForKey:providerNamespace];
}

- (void)noteDeviceDidEnterSleep {
    for (XENDBaseDataProvider *provider in self.dataProviders.allValues) {
        [provider noteDeviceDidEnterSleep];
    }
}

- (void)noteDeviceDidExitSleep {
    for (XENDBaseDataProvider *provider in self.dataProviders.allValues) {
        [provider noteDeviceDidExitSleep];
    }
}

- (void)networkWasDisconnected {
    for (XENDBaseDataProvider *provider in self.dataProviders.allValues) {
        [provider networkWasDisconnected];
    }
}

- (void)networkWasConnected {
    for (XENDBaseDataProvider *provider in self.dataProviders.allValues) {
        [provider networkWasConnected];
    }
}

@end
