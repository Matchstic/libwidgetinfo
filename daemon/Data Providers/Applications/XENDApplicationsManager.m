//
//  XENDApplicationsManager.m
//  Daemon
//
//  Created by Matt Clarke on 09/05/2020.
//

#import "XENDApplicationsManager.h"
#import "PrivateHeaders.h"

@implementation XENDApplicationsManager

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
    
    return [proxy iconDataForVariant:1];
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
