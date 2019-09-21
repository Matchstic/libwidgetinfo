//
//  XENDBaseRemoteDataProvider.m
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import "XENDBaseRemoteDataProvider.h"

@implementation XENDBaseRemoteDataProvider

- (instancetype)initWithConnection:(XENDBaseDaemonListener*)connection {
    self = [super init];
    
    if (self) {
        self.connection = connection;
    }
    
    return self;
}

+ (NSString*)providerNamespace {
    return @"_base_";
}

- (void)noteDeviceDidEnterSleep {}
- (void)noteDeviceDidExitSleep {}
- (void)networkWasDisconnected {}
- (void)networkWasConnected {}

- (NSDictionary*)currentData {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    [result setObject:self.cachedDynamicProperties forKey:@"dynamic"];
    [result setObject:self.cachedStaticProperties forKey:@"static"];
    return result;
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    callback(@{});
}

- (NSString*)escapeString:(NSString*)input {
    if (!input)
        return @"";
    
    input = [input stringByReplacingOccurrencesOfString:@"'" withString:@"\\'"];
    input = [input stringByReplacingOccurrencesOfString: @"\"" withString:@"\\\""];
    
    return input;
}

- (void)notifyRemoteForNewDynamicProperties {
    NSString *providerNamespace = [[self class] providerNamespace];
    [self.connection notifyUpdatedDynamicProperties:self.cachedDynamicProperties forNamespace:providerNamespace];
}

@end
