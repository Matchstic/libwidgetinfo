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

#import "XENDWeatherRemoteDataProvider.h"
#import "../Location/XENDLocationManager.h"
#import "PrivateHeaders.h"
#import "XENDLogger.h"
#import <objc/runtime.h>

#include <dlfcn.h>

@interface XENDWeatherRemoteDataProvider ()
@property (nonatomic, readwrite) BOOL hasInitialised;
- (void)springboardRelaunched;
@end

static XENDWeatherRemoteDataProvider *internalSharedInstance;

static void onSpringBoardLaunch(CFNotificationCenterRef center, void *observer, CFStringRef name, const void *object, CFDictionaryRef info) {
    [internalSharedInstance springboardRelaunched];
}

@implementation XENDWeatherRemoteDataProvider

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

- (void)noteSignificantTimeChange {
    [self.weatherManager noteSignificantTimeChange];
}

- (void)noteHourChange {
    [self.weatherManager noteHourChange];
}

#pragma mark - Grab API key from Weather.framework

- (void)intialiseProvider {
    // Only initialise once
    if (self.hasInitialised) return;
    
    internalSharedInstance = self;
    
    // Watch for SpringBoard launched event
    // This is to re-initialise once the user interface is running post-reboot
    CFNotificationCenterAddObserver(CFNotificationCenterGetDarwinNotifyCenter(), NULL, &onSpringBoardLaunch, CFSTR("SBSpringBoardDidLaunchNotification"), NULL, 0);
    
    // Load weather framework
    dlopen("/System/Library/PrivateFrameworks/Weather.framework/Weather", RTLD_NOW);
    
    // Make sure that our private API usage is going to be safe
    if (![self _privateFrameworkUsageIsValid]) {
        XENDLog(@"libwidgetinfo :: Weather provider is using invalid private framework API");
        return;
    }
    
    self.hasInitialised = YES;
    
    CFPreferencesAppSynchronize(CFSTR("com.apple.weather"));
    
    NSURLRequest *request = nil;
    
    // iOS 13+
    if (objc_getClass("WFWeatherChannelRequestFormatterV2")) {
        // Specify a geocode request specifically
        // iOS 13.3 now points to weather-data.apple.com for everything else
        
        WFLocation *location = [[objc_getClass("WFLocation") alloc] init];
        [location setGeoLocation:[self defaultLocation]];
        
        request = [objc_getClass("WFWeatherChannelRequestFormatterV2") forecastRequest:2
                                                                 forLocation:location
                                                                      locale:nil
                                                                        date:[NSDate date]
                                                                       rules:@[]];
    } else if (objc_getClass("WFWeatherChannelRequestFormatter")) {
        WFLocation *location = [[objc_getClass("WFLocation") alloc] init];
        [location setGeoLocation:[self defaultLocation]];
        
        request = [objc_getClass("WFWeatherChannelRequestFormatter") forecastRequestForLocation:location
                                                                                           date:[NSDate date]];
    } else {
        // Fallback approach
        
        // Start waiting on API key notification
        [[NSNotificationCenter defaultCenter] addObserver:self
            selector:@selector(onAPIKeyNotification:)
                name:@"XENDWeatherAPIKeyNotification"
              object:nil];
        
        // Ping off a dummy request to fetch the API key
        // Using geocoder for this, because it also uses the same host internally
        
        [[XENDLocationManager sharedInstance] reverseGeocodeLocation:[self defaultLocation] completionHandler:^(NSDictionary *data, NSError *error) {
            // no-op
        }];
    }
    
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
    
    // Check our request formatters exist for grabbing API key
    if (!objc_getClass("WFWeatherChannelRequestFormatterV2") &&
        !objc_getClass("WFWeatherChannelRequestFormatter") &&
        !objc_getClass("TWCLocationUpdater"))
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

- (void)springboardRelaunched {
    // Try to re-initialise if necessary
    if (!self.hasInitialised) {
        [self intialiseProvider];
    }
}

- (void)onAPIKeyNotification:(NSNotification*)notification {
    // Grab out the API key
    if ([[notification name] isEqualToString:@"XENDWeatherAPIKeyNotification"]) {
        // Ensure we don't get notified for subsequent requests
        [[NSNotificationCenter defaultCenter] removeObserver:self];
        
        XENDLog(@"INFO :: On API key notification. Data: \n%@", [notification userInfo]);
        
        NSString *key = [[notification userInfo] objectForKey:@"apiKey"];
        if ([key isEqualToString:@"(null)"]) key = nil;
        
        [self configureWeatherManager:key];
    }
}

#pragma mark - Weather manager handling

- (void)configureWeatherManager:(NSString*)apiKey {
    if (!apiKey || [apiKey isEqualToString:@""]) {
        XENDLog(@"ERROR :: API key is nil, or zero length");
        return;
    }
    
    self.weatherManager = [[XENDWeatherManager alloc] initWithAPIKey:apiKey
                                                     locationManager:[XENDLocationManager sharedInstance]
                                                         andDelegate:self];
}

- (void)onUpdatedWeatherConditions:(NSDictionary*)transformedConditions {
	self.cachedDynamicProperties = [transformedConditions mutableCopy];
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
    
    XENDLog(@"Falling back to %@, options: %@", result, savedCities);
    
    if (result) {
        return result.location;
    }
    
    // Cupertino
    return [self defaultLocation];
}

@end
