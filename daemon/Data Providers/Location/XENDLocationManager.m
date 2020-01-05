//
//  XENDLocationManager.m
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDLocationManager.h"

@implementation XENDLocationManager

+ (instancetype)sharedInstance {
    static XENDLocationManager *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDLocationManager alloc] init];
    });
    
    return sharedInstance;
}

- (void)fetchCurrentLocationWithCompletionHandler:(void(^)(NSError *error, CLLocation *location))completionHandler {
    // no-op for now, just return a location pointing at Cupertino
    CLLocation *location = [[CLLocation alloc] initWithLatitude:37.323 longitude:-122.0322];
    
    completionHandler(nil, location);
}

@end
