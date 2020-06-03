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
#import "XENDBaseDaemonListener.h"
#import "../Data Providers/XENDBaseRemoteDataProvider.h"
#import "../Data Providers/Media/XENDMediaRemoteDataProvider.h"
#import "../Data Providers/Weather/XENDWeatherRemoteDataProvider.h"
#import "../Data Providers/Resources/XENDResourcesRemoteDataProvider.h"
#import "../Data Providers/Applications/XENDApplicationsRemoteDataProvider.h"

@interface XENDBaseDaemonListener ()

@property (nonatomic, strong) NSDictionary<NSString*, XENDBaseRemoteDataProvider*> *dataProviders;
@property (nonatomic, strong) XENDStateManager *stateManager;

@end

@implementation XENDBaseDaemonListener

- (instancetype)init {
    self = [super init];
    
    if (self) {}
    
    return self;
}

- (void)initialise {
	self.dataProviders = [self _loadDataProviders];
	self.stateManager = [[XENDStateManager alloc] initWithDelegate:self];
}

- (XENDStateManager*)stateManagerInstance {
    return self.stateManager;
}

- (NSDictionary*)_loadDataProviders {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    
    // Remote data providers are initialised here
    
    XENDMediaRemoteDataProvider *media = [[XENDMediaRemoteDataProvider alloc] initWithConnection:self];
    [result setObject:media forKey:[[media class] providerNamespace]];
    
    XENDWeatherRemoteDataProvider *weather = [[XENDWeatherRemoteDataProvider alloc] initWithConnection:self];
    [result setObject:weather forKey:[[weather class] providerNamespace]];
    
    XENDResourcesRemoteDataProvider *resources = [[XENDResourcesRemoteDataProvider alloc] initWithConnection:self];
    [result setObject:resources forKey:[[resources class] providerNamespace]];
    
    XENDApplicationsRemoteDataProvider *apps = [[XENDApplicationsRemoteDataProvider alloc] initWithConnection:self];
    [result setObject:apps forKey:[[apps class] providerNamespace]];
    
    return result;
}

#pragma mark - Daemon connection implementation

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

#pragma mark - State related things

- (void)requestCurrentDeviceStateWithCallback:(void(^)(NSDictionary*))callback {
    callback([self.stateManager summariseState]);
}

- (void)noteDeviceDidEnterSleep {
	for (XENDBaseRemoteDataProvider *remoteProvider in self.dataProviders.allValues) {
		[remoteProvider noteDeviceDidEnterSleep];
	}
}

- (void)noteDeviceDidExitSleep {
	for (XENDBaseRemoteDataProvider *remoteProvider in self.dataProviders.allValues) {
		[remoteProvider noteDeviceDidExitSleep];
	}
}

- (void)networkWasConnected {
	for (XENDBaseRemoteDataProvider *remoteProvider in self.dataProviders.allValues) {
		[remoteProvider networkWasConnected];
	}
}

- (void)networkWasDisconnected {
	for (XENDBaseRemoteDataProvider *remoteProvider in self.dataProviders.allValues) {
		[remoteProvider networkWasDisconnected];
	}
}

- (void)noteSignificantTimeChange {
    for (XENDBaseRemoteDataProvider *remoteProvider in self.dataProviders.allValues) {
        [remoteProvider noteSignificantTimeChange];
    }
}

- (void)noteHourChange {
    for (XENDBaseRemoteDataProvider *remoteProvider in self.dataProviders.allValues) {
        [remoteProvider noteHourChange];
    }
}

@end
