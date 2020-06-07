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
@property (nonatomic, strong) FBSApplicationDataStoreRepositoryClient *client;
- (void)loadApplicationsMap;
- (void)springboardRelaunched;
@end

static XENDApplicationsManager *internalSharedInstance;

static void onSpringBoardLaunch(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef info) {
    [internalSharedInstance springboardRelaunched];
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
        internalSharedInstance = self;
        
        // Add observer for application state changes
        [[LSApplicationWorkspace defaultWorkspace] addObserver:self];
        
        // Observe SpringBoard relaunch
        CFNotificationCenterAddObserver(CFNotificationCenterGetDarwinNotifyCenter(), NULL, &onSpringBoardLaunch, CFSTR("SBSpringBoardDidLaunchNotification"), NULL, 0);
        
        // Do the same for badge changes
        // Needs to be held strongly - we are responsible for managing it
        [objc_getClass("FBSApplicationDataStore") setPrefetchedKeys:@[@"SBApplicationBadgeKey"]];
        
        self.client = [[objc_getClass("FBSApplicationDataStoreClientFactory") sharedInstance] checkout];
        [self.client addObserver:self];
        
        // Load application map
        [self loadApplicationsMap];
    }
    
    return self;
}

- (void)springboardRelaunched {
    /*
     Behind the scenes, our client instance will auto-reconnect to the FrontBoardServices server,
     in this case being SpringBoard.
     
     However, that does not handle re-notifying the server that we have requested observation of data
     stores. Therefore, we need to clear the local list of them, and then re-add ourselves to
     cause the re-notification to happen.
     */
    
    // Ensure client observer list is empty
    [self.client removeObserver:self];
    
    [self.client synchronizeWithCompletion:^{
        // Calling this when observers is empty notifies SB of wanting observation
        // XXX: Absolutely necessary, else observation fails after SB restart!
        [self.client addObserver:self];
        
        // Reload map
        [self loadApplicationsMap];
    }];
}

- (void)_setDelegate:(id<XENDApplicationsManagerDelegate>)delegate {
    self.delegate = delegate;
}

- (FBSApplicationDataStore*)dataStoreForApplication:(NSString*)bundleIdentifier {
    // This store appears to hold some metadata about applications, such as scene and badge states
    
    FBSApplicationDataStore *store = [[objc_getClass("FBSApplicationDataStore") alloc] initWithBundleIdentifier:bundleIdentifier];
    
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
        @"badge": badgeValue ? [badgeValue copy] : @"",
        @"isInstalling": @(proxy.isPlaceholder),
        @"isSystemApplication": @(isSystem)
    };
}

- (BOOL)deleteApplication:(NSString*)bundleIdentifier {
    return [[LSApplicationWorkspace defaultWorkspace] uninstallApplication:bundleIdentifier withOptions:nil];
}

#pragma mark - State changes

- (void)applicationsDidInstall:(id)arg1 {
    [self loadApplicationsMap];
}

-(void)applicationsDidUninstall:(NSArray*)arg1 {
    [self loadApplicationsMap];
}

-(void)applicationInstallsDidStart:(id)arg1 {
    [self loadApplicationsMap];
}

#pragma mark - FBSApplicationDataStoreRepositoryClientObserver

- (void)applicationDataStoreRepositoryClient:(FBSApplicationDataStoreRepositoryClient*)arg1 application:(NSString*)arg2 changedObject:(NSObject*)arg3 forKey:(NSString *)arg4 {
    
    if ([arg4 isEqualToString:@"SBApplicationBadgeKey"]) {
        // Recreate map for new badge info
        [self loadApplicationsMap];
    }
}

@end
