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
@property (nonatomic, strong) XENDStateManager *stateManager;

@end

@implementation XENDBaseDaemonListener

- (instancetype)init {
    self = [super init];
    
    if (self) {
        self.dataProviders = [self _loadDataProviders];
        self.stateManager = [[XENDStateManager alloc] initWithDelegate:self];
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

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition inNamespace:(NSString*)providerNamespace callback:(void(^)(NSDictionary*))callback {
    
    XENDBaseRemoteDataProvider *provider = [self.dataProviders objectForKey:providerNamespace];
    [provider didReceiveWidgetMessage:data functionDefinition:definition callback:callback];
    
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

#pragma mark State related things

- (void)requestCurrentDeviceStateWithCallback:(void(^)(NSDictionary*))callback {
    callback([self.stateManager summariseState]);
}

- (void)noteDeviceDidEnterSleep {
    // Allow subclass to override this
}

- (void)noteDeviceDidExitSleep {
    // Allow subclass to override this
}

- (void)networkWasConnected {
    // Allow subclass to override this
}

- (void)networkWasDisconnected {
    // Allow subclass to override this
}

@end
