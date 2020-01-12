//
//  TWCDailyForecast.h
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import <Foundation/Foundation.h>

@interface TWCDailyForecast : NSObject

@property (nonatomic, strong) NSString *blurb;
@property (nonatomic, strong) NSString *blurbAuthor;
@property (nonatomic, strong) NSString *dayOfWeek;
@property (nonatomic, readwrite) uint64_t expirationUNIXTime;
@property (nonatomic, strong) NSNumber *forecastDayIndex;
@property (nonatomic, strong) NSNumber *lunarPhaseDay;
@property (nonatomic, strong) NSString *lunarPhaseDescription;
@property (nonatomic, strong) NSString *lunarPhaseCode;
@property (nonatomic, strong) NSNumber *maxTemp;
@property (nonatomic, strong) NSNumber *minTemp;
@property (nonatomic, strong) NSString *moonRiseISOTime;
@property (nonatomic, strong) NSString *moonSetISOTime;
@property (nonatomic, strong) NSString *narrative;
@property (nonatomic, strong) NSNumber *snowForecast;
@property (nonatomic, strong) NSString *snowPhrase;
@property (nonatomic, strong) NSNumber *snowRange;
@property (nonatomic, strong) NSNumber *stormLikelihood;
@property (nonatomic, strong) NSString *sunRiseISOTime;
@property (nonatomic, strong) NSString *sunSetISOTime;
@property (nonatomic, strong) NSNumber *tornadoLikelihood;
@property (nonatomic, readwrite) uint64_t validUNIXTime;

// From day/part things
@property (nonatomic, strong) NSString *cloudCoverDescription;
@property (nonatomic, strong) NSNumber *conditionIcon;
@property (nonatomic, strong) NSString *conditionDescription;
@property (nonatomic, strong) NSString *dayIndicator;
@property (nonatomic, strong) NSNumber *heatIndex;
@property (nonatomic, strong) NSNumber *precipProbability;
@property (nonatomic, strong) NSString *precipProbabilityDescription;
@property (nonatomic, strong) NSString *precipType;
@property (nonatomic, strong) NSNumber *relativeHumidity;
@property (nonatomic, strong) NSString *uvDescription;
@property (nonatomic, strong) NSNumber *uvIndex;
@property (nonatomic, strong) NSNumber *windChill;
@property (nonatomic, strong) NSNumber *windDirection;
@property (nonatomic, strong) NSString *windDirectionCardinal;
@property (nonatomic, strong) NSNumber *windSpeed;

- (instancetype)initWithData:(NSDictionary*)data metric:(BOOL)useMetric;
- (BOOL)isForecastCurrentDay;

@end
