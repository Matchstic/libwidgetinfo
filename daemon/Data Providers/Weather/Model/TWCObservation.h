//
//  TWCObservation.h
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import <Foundation/Foundation.h>

@interface TWCObservation : NSObject

@property (nonatomic, strong) NSString *cloudCoverDescription;
@property (nonatomic, strong) NSNumber *conditionIcon;
@property (nonatomic, strong) NSString *conditionDescription;
@property (nonatomic, strong) NSString *dayIndicator;
@property (nonatomic, strong) NSNumber *dewpoint;
@property (nonatomic, readwrite) uint64_t expirationUNIXTime;
@property (nonatomic, strong) NSNumber *feelsLike;
@property (nonatomic, strong) NSNumber *gust;
@property (nonatomic, strong) NSNumber *heatIndex;
@property (nonatomic, strong) NSNumber *maxTemp;
@property (nonatomic, strong) NSNumber *minTemp;
@property (nonatomic, strong) NSNumber *precipHourly;
@property (nonatomic, strong) NSNumber *precipTotal;
@property (nonatomic, strong) NSNumber *pressure;
@property (nonatomic, strong) NSString *pressureDescription;
@property (nonatomic, strong) NSNumber *pressureTendency;
@property (nonatomic, strong) NSNumber *relativeHumidity;
@property (nonatomic, strong) NSNumber *snowHourly;
@property (nonatomic, strong) NSNumber *temperature;
@property (nonatomic, strong) NSString *uvDescription;
@property (nonatomic, strong) NSNumber *uvIndex;
@property (nonatomic, strong) NSNumber *visibility;
@property (nonatomic, strong) NSNumber *windChill;
@property (nonatomic, strong) NSNumber *windDirection;
@property (nonatomic, strong) NSString *windDirectionCardinal;
@property (nonatomic, strong) NSNumber *windSpeed;
@property (nonatomic, strong) NSNumber *waterTemperature;

- (instancetype)initWithData:(NSDictionary*)data metric:(BOOL)useMetric;

@end

