//
//  XENDBaseDaemonListener.m
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import "XENDBaseDaemonListener.h"
#import "../Data Providers/XENDBaseRemoteDataProvider.h"
#import "../Data Providers/Media/XENDMediaRemoteDataProvider.h"
#import "../Data Providers/Weather/XENDWeatherRemoteDataProvider.h"

@interface XENDBaseDaemonListener ()

@property (nonatomic, strong) NSDictionary<NSString*, XENDBaseRemoteDataProvider*> *dataProviders;

@end

@implementation XENDBaseDaemonListener

- (instancetype)init {
    self = [super init];
    
    if (self) {
        self.dataProviders = [self _loadDataProviders];
    }
    
    return self;
}

- (NSDictionary*)_loadDataProviders {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    
    // Remote data providers are initialised here
    
    XENDMediaRemoteDataProvider *media = [[XENDMediaRemoteDataProvider alloc] initWithConnection:self];
    [result setObject:media forKey:[[media class] providerNamespace]];
    
    XENDWeatherRemoteDataProvider *weather = [[XENDWeatherRemoteDataProvider alloc] initWithConnection:self];
    [result setObject:weather forKey:[[weather class] providerNamespace]];
    
    return result;
}

#pragma mark Daemon connection implementation

- (void)noteDeviceDidEnterSleepInNamespace:(NSString*)providerNamespace {
    XENDBaseRemoteDataProvider *provider = [self.dataProviders objectForKey:providerNamespace];
    [provider noteDeviceDidEnterSleep];
}

- (void)noteDeviceDidExitSleepInNamespace:(NSString*)providerNamespace {
    XENDBaseRemoteDataProvider *provider = [self.dataProviders objectForKey:providerNamespace];
    [provider noteDeviceDidExitSleep];
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    
    XENDBaseRemoteDataProvider *provider = [self.dataProviders objectForKey:providerNamespace];
    [provider didReceiveWidgetMessage:data functionDefinition:definition callback:callback];
    
}

- (void)networkWasDisconnectedInNamespace:(NSString*)providerNamespace {
    XENDBaseRemoteDataProvider *provider = [self.dataProviders objectForKey:providerNamespace];
    [provider networkWasDisconnected];
}

- (void)networkWasConnectedInNamespace:(NSString*)providerNamespace {
    XENDBaseRemoteDataProvider *provider = [self.dataProviders objectForKey:providerNamespace];
    [provider networkWasConnected];
}

- (void)requestCurrentPropertiesInNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    NSDictionary *result = [self.dataProviders.allKeys containsObject:providerNamespace] ?
                           [[self.dataProviders objectForKey:providerNamespace] currentData] :
                           @{};
    callback(result);
}

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Allow subclass to override this
}

@end
