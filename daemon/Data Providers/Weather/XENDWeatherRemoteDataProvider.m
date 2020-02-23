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
    
    // Specify a geocode request specifically
    // iOS 13.3 now points to weather-data.apple.com for everything else
    WFLocation *location = [[objc_getClass("WFLocation") alloc] init];
    [location setGeoLocation:[self defaultLocation]];
    NSURLRequest *request = [objc_getClass("WFWeatherChannelRequestFormatterV2") forecastRequest:2
                                                             forLocation:location
                                                                  locale:nil
                                                                    date:[NSDate date]
                                                                   rules:@[]];
    
    // Read off the API key
    NSMutableDictionary *queryStringDictionary = [[NSMutableDictionary alloc] init];
    NSArray *urlComponents = [[request URL].query componentsSeparatedByString:@"&"];
    
    for (NSString *keyValuePair in urlComponents) {
        NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
        NSString *key = [[pairComponents firstObject] stringByRemovingPercentEncoding];
        NSString *value = [[pairComponents lastObject] stringByRemovingPercentEncoding];

        [queryStringDictionary setObject:value forKey:key];
    }
    
    NSString *apiKey = [queryStringDictionary objectForKey:@"apiKey"];
    [self configureWeatherManager:apiKey];
}

- (BOOL)_privateFrameworkUsageIsValid {
    // Checks against all private API used that it all exists and will function as expected
    
    // Validate classes for now
    if (!objc_getClass("WeatherPreferences"))
        return NO;
    
    if (!objc_getClass("WFWeatherChannelRequestFormatterV2"))
        return NO;
    
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

- (CLLocation*)defaultLocation {
    return [[CLLocation alloc] initWithLatitude:37.323 longitude:-122.0322];
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
    return [self defaultLocation];
}

@end
