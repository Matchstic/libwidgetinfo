//
//  XENDWeatherRemoteDataProvider.m
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDWeatherRemoteDataProvider.h"
#import "../Location/XENDLocationManager.h"
#import "PrivateHeaders.h"
#import <objc/runtime.h>

#include <dlfcn.h>

@implementation XENDWeatherRemoteDataProvider

+ (void)initialize {
    dlopen("/System/Library/PrivateFrameworks/Weather.framework/Weather", RTLD_NOW);
}

+ (NSString*)providerNamespace {
    return @"weather";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    
    // No messages supported
    callback(@{});
}

- (void)noteDeviceDidEnterSleep {
    [self.weatherManager pauseUpdateTimer];
}

- (void)noteDeviceDidExitSleep {
    [self.weatherManager restartUpdateTimer];
}

- (void)networkWasDisconnected {
    [self.weatherManager networkWasDisconnected];
}

- (void)networkWasConnected {
    [self.weatherManager networkWasConnected];
}

#pragma mark Grab API key from Weather.framework

- (void)intialiseProvider {
    // Make sure that our private API usage is going to be safe
    if (![self _privateFrameworkUsageIsValid]) {
        NSLog(@"libwidgetinfo :: Weather provider is using invalid private framework API");
        return;
    }
    
    // Start waiting on API key notification
    [[NSNotificationCenter defaultCenter] addObserver:self
        selector:@selector(onAPIKeyNotification:)
            name:@"XENDWeatherAPIKeyNotification"
          object:nil];
    
    // Ping off a dummy request to fetch the API key
    City *defaultCity = [self _defaultCity];
    [[objc_getClass("TWCLocationUpdater") sharedLocationUpdater]
        updateWeatherForLocation:defaultCity.location
                            city:defaultCity];
}

- (void)onAPIKeyNotification:(NSNotification*)notification {
    // Grab out the API key
    if ([[notification name] isEqualToString:@"XENDWeatherAPIKeyNotification"]) {
        // Ensure we don't get notified for subsequent requests
        [[NSNotificationCenter defaultCenter] removeObserver:self];
        
        [self configureWeatherManager:[[notification userInfo] objectForKey:@"apiKey"]];
    }
}

- (BOOL)_privateFrameworkUsageIsValid {
    // Checks against all private API used that it all exists and will function as expected
    
    // Validate classes for now
    if (!objc_getClass("WeatherPreferences"))
        return NO;
    
    if (!objc_getClass("TWCLocationUpdater"))
        return NO;
    
    if (!objc_getClass("City"))
        return NO;
    
    // Validate selectors
    if (![objc_getClass("TWCLocationUpdater")
          respondsToSelector:@selector(sharedLocationUpdater)]) {
        return NO;
    }
    
    if (![[objc_getClass("TWCLocationUpdater") sharedLocationUpdater]
          respondsToSelector:@selector(updateWeatherForLocation:city:)]) {
        return NO;
    }
    
    if (![objc_getClass("WeatherPreferences")
          respondsToSelector:@selector(sharedPreferences)]) {
        return NO;
    }
    
    if (![[objc_getClass("WeatherPreferences") sharedPreferences]
          respondsToSelector:@selector(cityFromPreferencesDictionary:)]) {
        return NO;
    }
    
    if (![[objc_getClass("WeatherPreferences") sharedPreferences]
          respondsToSelector:@selector(loadSavedCities)]) {
        return NO;
    }
    
    return YES;
}

- (City*)_defaultCity {
    NSMutableDictionary *newCity = [NSMutableDictionary dictionary];
    
    [newCity setObject:[NSNumber numberWithFloat:37.323] forKey:@"Lat"];
    [newCity setObject:[NSNumber numberWithFloat:-122.0322] forKey:@"Lon"];
    [newCity setObject:@"Cupertino" forKey:@"Name"];
    
    return [[objc_getClass("WeatherPreferences") sharedPreferences] cityFromPreferencesDictionary:newCity];
}

#pragma mark Weather manager handling

- (void)configureWeatherManager:(NSString*)apiKey {
    self.weatherManager = [[XENDWeatherManager alloc] initWithAPIKey:apiKey
                                                     locationManager:[XENDLocationManager sharedInstance]
                                                         andDelegate:self];
}

- (void)onUpdatedWeatherConditions:(NSDictionary*)transformedConditions {
    // Only set the changed properties
    for (NSString *key in transformedConditions.allKeys) {
        [self.cachedDynamicProperties setValue:[transformedConditions objectForKey:key] forKey:key];
    }
    
    [self notifyRemoteForNewDynamicProperties];
}

- (CLLocation*)fallbackWeatherLocation {
    // Fetch the first non-local city from the weather preferences
    NSArray *savedCities = [[objc_getClass("WeatherPreferences") sharedPreferences] loadSavedCities];
    City *result;

    for (City *city in savedCities) {
        if (!city.isLocalWeatherCity) {
            result = city;
            break;
        }
    }
    
    if (result) {
        return result.location;
    }
    
    // Cupertino
    return [[CLLocation alloc] initWithLatitude:37.323 longitude:-122.0322];
}

@end
