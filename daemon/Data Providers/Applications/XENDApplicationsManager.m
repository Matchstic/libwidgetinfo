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

#import "XENDApplicationsManager.h"
#import "XENDLogger.h"
#import "PrivateHeaders.h"
#import <dlfcn.h>
#import <objc/runtime.h>

@interface XENDApplicationsManager ()
@property (nonatomic, weak) id<XENDApplicationsManagerDelegate> delegate;
@property (nonatomic, strong) NSArray *_currentMap;
@property (nonatomic, strong) NSMutableDictionary *_dataStores;
@property (nonatomic, strong) FBSApplicationDataStoreRepositoryClient *client;
- (void)loadApplicationsMap;
@end

extern CFNotificationCenterRef CFNotificationCenterGetDistributedCenter(void);

static inline void stateChangedCallback(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef userInfo) {
    
    [[XENDApplicationsManager sharedInstance] loadApplicationsMap];
}

@implementation XENDApplicationsManager

+ (void)load {
    // For badge information
    dlopen("/System/Library/PrivateFrameworks/FrontBoardServices.framework/FrontBoardServices", RTLD_NOW);
}

+ (instancetype)sharedInstance {
    static XENDApplicationsManager *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDApplicationsManager alloc] init];
    });
    
    return sharedInstance;
}

- (instancetype)init {
    self = [super init];
    
    if (self) {
        self._dataStores = [NSMutableDictionary dictionary];
        [self loadApplicationsMap];
        
        // Add observer for application state changes
        [[LSApplicationWorkspace defaultWorkspace] addObserver:self];
        
        // Do the same for badge changes
        // Needs to be held strongly - we are responsible for managing it
        self.client = [[objc_getClass("FBSApplicationDataStoreClientFactory") sharedInstance] checkout];
        [self.client addObserver:self];
    }
    
    return self;
}

- (void)_setDelegate:(id<XENDApplicationsManagerDelegate>)delegate {
    self.delegate = delegate;
}

- (FBSApplicationDataStore*)dataStoreForApplication:(NSString*)bundleIdentifier {
    // This store appears to hold some metadata about applications, such as scene and badge states
    FBSApplicationDataStore *store = [self._dataStores objectForKey:bundleIdentifier];
    if (!store) {
        store = [[objc_getClass("FBSApplicationDataStore") alloc] initWithBundleIdentifier:bundleIdentifier];
        
        if (store)
            [self._dataStores setObject:store forKey:bundleIdentifier];
    }
    
    return store;
}

- (void)loadApplicationsMap {
    NSArray *allApplications = [[LSApplicationWorkspace defaultWorkspace] allApplications];
    
    NSMutableArray *applicationMap = [NSMutableArray array];
    
    for (LSApplicationProxy *proxy in allApplications) {
        NSDictionary *metadata = [self metadataForApplication:proxy.applicationIdentifier];
        
        if (metadata)
            [applicationMap addObject:metadata];
    }
    
    // Sort the map alphabetically
    applicationMap = [[applicationMap sortedArrayUsingComparator:^NSComparisonResult(id a, id b) {
        NSString *first = [[a objectForKey:@"name"] lowercaseString];
        NSString *second = [[b objectForKey:@"name"] lowercaseString];
        return [first compare:second];
    }] mutableCopy];
    
    self._currentMap = applicationMap;
    
    // Notify delegate of new map
    if (self.delegate && [self.delegate respondsToSelector:@selector(applicationsMapDidUpdate:)]) {
        [self.delegate applicationsMapDidUpdate:self._currentMap];
    }
}

- (NSArray*)currentApplicationMap {
    return self._currentMap ? self._currentMap : @[];
}

- (NSDictionary*)metadataForApplication:(NSString*)bundleIdentifier {
    LSApplicationProxy *proxy = [LSApplicationProxy applicationProxyForIdentifier:bundleIdentifier];
    if (!proxy || !bundleIdentifier || [bundleIdentifier isEqualToString:@""]) {
        return @{
            @"name": @"",
            @"identifier": @"",
            @"icon": @"",
            @"badge": @"",
            @"isInstalling": @NO,
            @"isSystemApplication": @NO
        };
    }
    
    // Load Info.plist from the bundle.
    // Ignore any apps that the following keys as true:
    // - LSApplicationLaunchProhibited
    // - SBAppTags (array): contains 'hidden'
    // - SBIconVisibilityDefaultVisible == NO
    // - Bundle id === com.apple.webapp
    
    NSString *infoPlistPath = [NSString stringWithFormat:@"%@/Info.plist", [[proxy bundleURL] path]];
    NSDictionary *infoPlist = [NSDictionary dictionaryWithContentsOfFile:infoPlistPath];
    
    BOOL isHiddenApplication = NO;
    if ([infoPlist objectForKey:@"LSApplicationLaunchProhibited"]) {
        
        isHiddenApplication = [[infoPlist objectForKey:@"LSApplicationLaunchProhibited"] boolValue];
        
    } else if ([infoPlist objectForKey:@"SBAppTags"]) {
        
        NSArray *tags = [infoPlist objectForKey:@"SBAppTags"];
        isHiddenApplication = [tags containsObject:@"hidden"] || [tags containsObject:@"SBInternalAppTag"];
        
    } else if ([infoPlist objectForKey:@"SBIconVisibilityDefaultVisible"]) {
        
        if (![[infoPlist objectForKey:@"SBIconVisibilityDefaultVisible"] boolValue])
            isHiddenApplication = YES;
        
    } else if ([bundleIdentifier isEqualToString:@"com.apple.webapp"]) {
        isHiddenApplication = YES;
    }
    
    if (isHiddenApplication) {
        return nil;
    }
    
    BOOL isSystem = [[[proxy bundleURL] path] hasPrefix:@"/Applications"];
    
    // Find badge value - may be a NSString, NSNumber or null
    FBSApplicationDataStore *dataStore = [self dataStoreForApplication:bundleIdentifier];
    NSObject *badgeValue = [dataStore safeObjectForKey:@"SBApplicationBadgeKey" ofType:[NSObject class]];
    
    return @{
        @"name": [proxy localizedName] ? [proxy localizedName] : @"",
        @"identifier": proxy.applicationIdentifier,
        @"icon": [NSString stringWithFormat:@"xui://application/icon/%@", proxy.applicationIdentifier],
        @"badge": badgeValue ? badgeValue : @"",
        @"isInstalling": @(proxy.isPlaceholder),
        @"isSystemApplication": @(isSystem)
    };
}

#pragma mark - State changes

- (void)applicationStateDidChange:(id)arg1 {
    [self loadApplicationsMap];
}

- (void)applicationsDidInstall:(id)arg1 {
    [self loadApplicationsMap];
}

-(void)applicationsDidUninstall:(NSArray*)arg1 {
    [self loadApplicationsMap];
    
    // Argument is an array of LSApplicationProxy instances
    for (LSApplicationProxy *proxy in arg1) {
        if (![[proxy class] isKindOfClass:[LSApplicationProxy class]]) continue;
        
        // Clear our cached data store for this application
        [self._dataStores removeObjectForKey:proxy.applicationIdentifier];
    }
}

-(void)applicationInstallsDidStart:(id)arg1 {
    [self loadApplicationsMap];
}

#pragma mark - FBSApplicationDataStoreRepositoryClientObserver

- (void)applicationDataStoreRepositoryClient:(FBSApplicationDataStoreRepositoryClient*)arg1 application:(id)arg2 changedObject:(NSObject*)arg3 forKey:(NSString *)arg4 {
    
    if ([arg4 isEqualToString:@"SBApplicationBadgeKey"])
        [self loadApplicationsMap];
}

- (void)applicationDataStoreRepositoryClient:(id)arg1 storeInvalidatedForApplication:(id)arg2 {
    XENDLog(@"DEBUG :: applicationDataStoreRepositoryClient:storeInvalidatedForApplication:");
    XENDLog(@"%@", arg2);
}

@end
