//
//  XENDXenInfoURLHandler.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 10/05/2020.
//

#import "XENDXenInfoURLHandler.h"

#import "XENDLogger.h"
#import "../Internal/XENDWidgetManager-Internal.h"
#import "../Data Providers/Applications/XENDApplicationsDataProvider.h"
#import "../Data Providers/Media/XENDMediaDataProvider.h"

@implementation XENDXenInfoURLHandler

+ (BOOL)canHandleURL:(NSURL*)url {
    return [[url scheme] isEqualToString:@"file"] &&
            [[url absoluteString] containsString:@"/var/mobile/Documents/Artwork.jpg"];
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    XENDLog(@"*** XenInfo Compatibility: handling URL: %@", url);
    
    // Redirect loading of the artwork file to media provider.
    // it is ALWAYS the now playing artwork

    XENDMediaDataProvider *media = (XENDMediaDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"media"];
    XENDApplicationsDataProvider *apps = (XENDApplicationsDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"applications"];
    
    NSDictionary *cachedData = [media cachedData];
    
    NSDictionary *nowPlaying = [cachedData objectForKey:@"nowPlaying"];
    NSString *artwork = [nowPlaying objectForKey:@"artwork"];
    
    BOOL isApplicationIcon = [artwork hasPrefix:@"xui://application"];
    
    NSString *identifier = [artwork lastPathComponent];
    
    if (isApplicationIcon) {
        [apps requestIconDataForBundleIdentifier:identifier callback:^(NSDictionary *result) {
            NSData *data = [result objectForKey:@"data"];
            if ([data isKindOfClass:[NSNull class]]) data = nil;
            
            completionHandler(nil, data, @"image/png");
        }];
    } else {
        [media requestArtworkForIdentifier:identifier callback:^(NSDictionary *result) {
            NSData *data = [result objectForKey:@"data"];
            if ([data isKindOfClass:[NSNull class]]) data = nil;
            
            completionHandler(nil, data, @"image/jpeg");
        }];
    }
}

// Legacy compatibility
+ (BOOL)handleNavigationRequest:(NSURL*)url {
    XENDLog(@"*** XenInfo compatibility: handling navigation request: %@", url);

    XENDMediaDataProvider *media = (XENDMediaDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"media"];
    
    // Forward requests onto correct provider
    if ([[url absoluteString] isEqualToString:@"xeninfo:playpause"]) {
        [media didReceiveWidgetMessage:@{} functionDefinition:@"togglePlayPause" callback:^(NSDictionary *res) {}];
        return YES;
    } else if ([[url absoluteString] isEqualToString:@"xeninfo:nexttrack"]) {
        [media didReceiveWidgetMessage:@{} functionDefinition:@"nextTrack" callback:^(NSDictionary *res) {}];
        return YES;
    } else if ([[url absoluteString] isEqualToString:@"xeninfo:prevtrack"]) {
        [media didReceiveWidgetMessage:@{} functionDefinition:@"previousTrack" callback:^(NSDictionary *res) {}];
        return YES;
    } else {
        return NO;
    }
}

@end
