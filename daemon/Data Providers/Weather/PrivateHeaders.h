//
//  PrivateHeaders.h
//  libwidgetdata
//
//  Created by Matt Clarke on 23/11/2019.
//

@interface City : NSObject
@property (nonatomic, retain) id location;
@end

@interface WeatherPreferences : NSObject
+ (instancetype)sharedPreferences;
- (id)localWeatherCity;
- (id)loadSavedCities;
- (City*)cityFromPreferencesDictionary:(id)arg1;
@end

@interface TWCLocationUpdater : NSObject
+ (instancetype)sharedLocationUpdater;
- (void)updateWeatherForLocation:(id)arg1 city:(id)arg2;
@end
