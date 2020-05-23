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

#import "XENDLocationManager.h"
#import "XENDLogger.h"

@interface XENDLocationManager ()

@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) NSMutableArray *pendingLocationCompletions;
@property (nonatomic, strong) NSMutableArray *authorisationListeners;
@property (nonatomic, strong) NSTimer *locationSettledTimer;
@property (nonatomic, strong) NSDate *expectedSettledTime;
@property (nonatomic, strong) CLLocation *lastKnownLocation;

@property (nonatomic, readwrite) CLAuthorizationStatus authorisationStatus;

@property (nonatomic, strong) CLGeocoder *geocoder;
@property (nonatomic, strong) NSMutableDictionary *cachedGeocodeResponses;

@end

@implementation XENDLocationManager

+ (instancetype)sharedInstance {
    static XENDLocationManager *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDLocationManager alloc] init];
    });
    
    return sharedInstance;
}

- (instancetype)init {
    self = [super init];
    
    if (self) {
        dispatch_async(dispatch_get_main_queue(), ^{
            self.locationManager = [[CLLocationManager alloc] init];
            self.locationManager.delegate = self;
            
            [self.locationManager setDesiredAccuracy:kCLLocationAccuracyHundredMeters];
            
            self.lastKnownLocation = nil;
            self.expectedSettledTime = nil;
            self.authorisationStatus = [CLLocationManager authorizationStatus];
            
            self.geocoder = [CLGeocoder new];
            self.cachedGeocodeResponses = [NSMutableDictionary dictionary];
            
            XENDLog(@"Starting location manager with authorisation: %d", self.authorisationStatus);
            
#if TARGET_OS_SIMULATOR
            [self _requestSimulatorAuthorisation];
#endif
        });
    }
    
    return self;
}

- (void)addAuthorisationStatusListener:(void(^)(BOOL available))listener {
    if (!self.authorisationListeners)
        self.authorisationListeners = [NSMutableArray array];
    
    [self.authorisationListeners addObject:listener];
}

- (BOOL)locationServicesAvailable {
#if TARGET_OS_SIMULATOR
    return self.authorisationStatus != kCLAuthorizationStatusDenied &&
            self.authorisationStatus != kCLAuthorizationStatusNotDetermined;
#else
    return [CLLocationManager locationServicesEnabled] && self.authorisationStatus != kCLAuthorizationStatusNotDetermined;
#endif
}

- (void)fetchCurrentLocationWithCompletionHandler:(void(^)(NSError *error, CLLocation *location))completionHandler {
    if (self.authorisationStatus == kCLAuthorizationStatusNotDetermined) {
        NSError *error = [[NSError alloc] initWithDomain:NSCocoaErrorDomain code:kXENLocationErrorNotInitialised userInfo:nil];
        
        completionHandler(error, nil);
    }
    
    if (![self locationServicesAvailable]) {
        NSError *error = [[NSError alloc] initWithDomain:NSCocoaErrorDomain code:kXENLocationErrorNotAvailable userInfo:nil];
        
        completionHandler(error, nil);
    } else {
        if (!self.pendingLocationCompletions)
            self.pendingLocationCompletions = [NSMutableArray array];
        
        [self.pendingLocationCompletions addObject:completionHandler];
        
        [self.locationManager startUpdatingLocation];
        
        // Add timeout in the event no new location is found
        
        dispatch_async(dispatch_get_main_queue(), ^{
            self.locationSettledTimer = [NSTimer scheduledTimerWithTimeInterval:3 target:self selector:@selector(_locationSettled:) userInfo:@{
                @"location": self.lastKnownLocation ? self.lastKnownLocation : [NSNull null]
            } repeats:NO];
        });
    }
}

- (void)_requestSimulatorAuthorisation {
    // Request authorisation for the simulator
    [self.locationManager requestWhenInUseAuthorization];
}

- (void)_locationSettled:(NSTimer*)sender {
    
    CLLocation *location = [sender.userInfo objectForKey:@"location"];
    [self _locationSettledWithLocation:location];
}

- (void)_locationSettledWithLocation:(CLLocation*)location {
    // Notify callbacks, and clear pending completions
    
    [self.locationManager stopUpdatingLocation];
    
    [self.locationSettledTimer invalidate];
    self.locationSettledTimer = nil;
    self.expectedSettledTime = nil;
    
    if (!location || [location isEqual:[NSNull null]]) {
        NSError *error = [[NSError alloc] initWithDomain:NSCocoaErrorDomain code:kXENLocationErrorNotAvailable userInfo:nil];
    
        [self _notifyPendingCallbacksError:error location:nil];
    } else {
        self.lastKnownLocation = location;
    
        [self _notifyPendingCallbacksError:nil location:location];
    }
}

- (void)_notifyPendingCallbacksError:(NSError*)error location:(CLLocation*)location {
    for (void(^callback)(NSError*, CLLocation*) in self.pendingLocationCompletions) {
        callback(error, location);
    }
    
    [self.pendingLocationCompletions removeAllObjects];
}

- (void)reverseGeocodeLocation:(CLLocation*)location completionHandler:(void(^)(NSDictionary *data, NSError *error))completionHandler {
    NSString *locationKey = [NSString stringWithFormat:@"%f,%f", location.coordinate.latitude, location.coordinate.longitude];
    
    NSDictionary *cachedGeocodeResponse = [self.cachedGeocodeResponses objectForKey:locationKey];
    if (cachedGeocodeResponse) {
        completionHandler(cachedGeocodeResponse, nil);
        return;
    } else {
        [self.geocoder reverseGeocodeLocation:location completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
            if (error) {
                completionHandler(nil, error);
            } else {
                CLPlacemark *placemark = [placemarks objectAtIndex:0];
                
                NSString *streetComponent = @"";
                if (placemark.thoroughfare != nil) {
                    streetComponent = [NSString stringWithFormat:@"%@", placemark.thoroughfare];
                } else if (placemark.subLocality != nil) { // handle no street address somewhat
                    streetComponent = [NSString stringWithFormat:@"%@", placemark.subLocality];
                } else { // fallback
                    streetComponent = @"Unknown street";
                }
                
                // Gradually fallback the city name
                NSString *cityFallback = placemark.locality;
                if (!cityFallback) cityFallback = placemark.subLocality;
                if (!cityFallback) cityFallback = placemark.subAdministrativeArea;
                if (!cityFallback) cityFallback = placemark.administrativeArea;
                if (!cityFallback) cityFallback = placemark.country;
                if (!cityFallback) cityFallback = @"";
                
                NSDictionary *reverseGeocodedAddress = @{
                    @"house": placemark.subThoroughfare ? placemark.subThoroughfare : @"",
                    @"street": streetComponent,
                    @"neighbourhood": placemark.subLocality ? placemark.subLocality : @"",
                    @"city": cityFallback ? cityFallback : @"",
                    @"postalCode": placemark.postalCode ? placemark.postalCode : @"",
                    @"county": placemark.subAdministrativeArea ? placemark.subAdministrativeArea : @"",
                    @"state": placemark.administrativeArea ? placemark.administrativeArea : @"",
                    @"country": placemark.country ? placemark.country : @"",
                    @"countryISOCode": placemark.ISOcountryCode ? placemark.ISOcountryCode : @""
                };
                
                [self.cachedGeocodeResponses setObject:reverseGeocodedAddress forKey:locationKey];
                
                completionHandler(reverseGeocodedAddress, nil);
            }
        }];
    }
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(id)arg1 didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    if (self.authorisationStatus == kCLAuthorizationStatusNotDetermined &&
        status != kCLAuthorizationStatusDenied) {
        
        // Set new last known location
        self.lastKnownLocation = self.locationManager.location;
    }
    
    self.authorisationStatus = status;
    
    if (status != kCLAuthorizationStatusNotDetermined) {
        // Notify any listeners about the new authorisation status
        for (void(^callback)(BOOL) in self.authorisationListeners) {
            callback([self locationServicesAvailable]);
        }
    }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    if (error.code == kCLErrorLocationUnknown) {
        // Ignore safely
    } else if (error.code == kCLErrorHeadingFailure) {
        // Magnetic interference, cannot determine location currently
        // Return the last known location instead
        
        [self.locationManager stopUpdatingLocation];
        [self.locationSettledTimer invalidate];
        self.locationSettledTimer = nil;
        self.expectedSettledTime = nil;
        
        NSError *error = [[NSError alloc] initWithDomain:NSCocoaErrorDomain code:kXENLocationErrorCachedOnly userInfo:nil];
        [self _notifyPendingCallbacksError:error location:self.lastKnownLocation];
        
    } else if (error.code == kCLErrorDenied) {
        // User denied location update, no point continuing
        
        [self.locationManager stopUpdatingLocation];
        [self.locationSettledTimer invalidate];
        self.locationSettledTimer = nil;
        self.expectedSettledTime = nil;
        
        NSError *error = [[NSError alloc] initWithDomain:NSCocoaErrorDomain code:kXENLocationErrorNotAvailable userInfo:nil];
        [self _notifyPendingCallbacksError:error location:nil];
    }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
    XENDLog(@"Did update locations: %@", locations);
    
    CLLocation *mostRecentLocation = [[locations lastObject] copy];
    
    // Only use this location if a new one doesn't appear in a few seconds
    // Effectively allows the location subsystem to "settle" on a fix before passing it back
    
    // Handle case of lots of locations coming through
    if (!self.expectedSettledTime) {
        self.expectedSettledTime = [NSDate dateWithTimeIntervalSinceNow:3];
    } else if ([[NSDate date] compare:self.expectedSettledTime] == NSOrderedDescending) {
        // Timeout expired, use the current location - getting a lot through so
        // must be fresh
        
        [self _locationSettledWithLocation:mostRecentLocation];
        return;
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.locationSettledTimer) {
            [self.locationSettledTimer invalidate];
            self.locationSettledTimer = nil;
        }
        
        self.locationSettledTimer = [NSTimer scheduledTimerWithTimeInterval:3 target:self selector:@selector(_locationSettled:) userInfo:@{
            @"location": mostRecentLocation
        } repeats:NO];
    });
}

@end
