//
//  XENDApplicationsRemoteDataProvider.m
//  Daemon
//
//  Created by Matt Clarke on 09/05/2020.
//

#import "XENDApplicationsRemoteDataProvider.h"
#import "XENDApplicationsManager.h"

@implementation XENDApplicationsRemoteDataProvider

+ (NSString*)providerNamespace {
    return @"applications";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    
    if ([definition isEqualToString:@"_loadIcon"]) {
        callback([self _loadIcon:data]);
    } else {
        callback(@{});
    }
}

- (NSDictionary*)_loadIcon:(NSDictionary*)data {
    NSData *result = [[XENDApplicationsManager sharedInstance] iconForApplication:[data objectForKey:@"identifier"]];
    return @{
        @"data": result != nil ? result : [NSNull null]
    };
}

@end
