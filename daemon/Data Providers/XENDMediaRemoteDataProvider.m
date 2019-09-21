//
//  XENDMediaRemoteDataProvider.m
//  Daemon
//
//  Created by Matt Clarke on 21/09/2019.
//

#import "XENDMediaRemoteDataProvider.h"

@implementation XENDMediaRemoteDataProvider

+ (NSString*)providerNamespace {
    return @"media";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    
    if ([definition isEqualToString:@"nextTrack"]) {
        callback([self nextTrack]);
    } else if ([definition isEqualToString:@"previousTrack"]) {
        callback([self previousTrack]);
    } else {
        callback(@{});
    }
}

/////////////////////////////////////////////////
// Message implementation
/////////////////////////////////////////////////

- (NSDictionary*)nextTrack {
    
    
    return @{};
}

- (NSDictionary*)previousTrack {
    
    
    return @{};
}

@end
