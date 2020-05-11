//
//  XENDApplicationsManager.m
//  Daemon
//
//  Created by Matt Clarke on 09/05/2020.
//

#import "XENDApplicationsManager.h"
#import "PrivateHeaders.h"
#import <dlfcn.h>

@implementation XENDApplicationsManager

+ (void)load {
    // For icon loading
    dlopen("/System/Library/PrivateFrameworks/IconServices.framework/IconServices", RTLD_NOW);
}

+ (instancetype)sharedInstance {
    static XENDApplicationsManager *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDApplicationsManager alloc] init];
    });
    
    return sharedInstance;
}

- (NSData*)iconForApplication:(NSString*)bundleIdentifier {
    LSApplicationProxy *proxy = [LSApplicationProxy applicationProxyForIdentifier:bundleIdentifier];
    if (!proxy || !bundleIdentifier || [bundleIdentifier isEqualToString:@""]) return nil;
    
    NSDictionary *icons = [proxy iconsDictionary];
    NSString *iconFileName = [[[icons objectForKey:@"CFBundlePrimaryIcon"] objectForKey:@"CFBundleIconFiles"] lastObject];
    
    // Seems to be off by one... Needs validation
    NSNumber *screenScale = (__bridge NSNumber*)MGCopyAnswer(CFSTR("main-screen-scale"));
    NSLog(@"SCREEN SCALE: %@", screenScale);
    
    NSString *suffix = @"";
    if ([screenScale intValue] > 1) {
        suffix = [NSString stringWithFormat:@"@%dx", [screenScale intValue] - 1];
    }
    
    NSString *path = [NSString stringWithFormat:@"%@/%@%@.png", [proxy.bundleURL path], iconFileName, suffix];
    
    // Load image data
    NSLog(@"Loading from %@", path);
    
    // TODO: Apply mask image - See MobileIcons.framework on disk for the mask image PNG
    return [NSData dataWithContentsOfFile:path];
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
    
    BOOL isSystem = [[[proxy bundleURL] absoluteString] hasPrefix:@"/Applications"];
    
    // TODO: Find badge value
    
    return @{
        @"name": [proxy localizedName] ? [proxy localizedName] : @"",
        @"identifier": proxy.applicationIdentifier,
        @"icon": [NSString stringWithFormat:@"xui://application/icon/%@", proxy.applicationIdentifier],
        @"badge": @"",
        @"isInstalling": @(proxy.isPlaceholder),
        @"isSystemApplication": @(isSystem)
    };
}

@end
