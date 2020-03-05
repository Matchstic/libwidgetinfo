//
//  XTWCDailyForecast.h
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import <Foundation/Foundation.h>
#import "XTWCUnits.h"

@interface XTWCDailyForecast : NSObject

@property (nonatomic, strong) NSString *blurb;
@property (nonatomic, strong) NSString *blurbAuthor;
@property (nonatomic, strong) NSString *dayOfWeek;
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

/**
Time from which this forecast is valid.
Validity lasts for 24 hours from this time.
*/
@property (nonatomic, readwrite) uint64_t validUNIXTime;

// From day/part things
@property (nonatomic, strong) NSString *cloudCoverPercentage;
@property (nonatomic, strong) NSNumber *conditionIcon;
@property (nonatomic, strong) NSString *conditionDescription;
@property (nonatomic, strong) NSString *dayIndicator;
@property (nonatomic, strong) NSNumber *heatIndex;
@property (nonatomic, strong) NSNumber *precipProbability;
@property (nonatomic, strong) NSString *precipType;
@property (nonatomic, strong) NSNumber *relativeHumidity;
@property (nonatomic, strong) NSString *uvDescription;
@property (nonatomic, strong) NSNumber *uvIndex;
@property (nonatomic, strong) NSNumber *windChill;
@property (nonatomic, strong) NSNumber *windDirection;
@property (nonatomic, strong) NSString *windDirectionCardinal;
@property (nonatomic, strong) NSNumber *windSpeed;

/**
Initialises properties with API response
*/
- (instancetype)initWithData:(NSDictionary*)data units:(struct XTWCUnits)units;

/**
 * Overrides data from day/night things to be for night portion
 */
- (void)overrideToNight:(BOOL)isNight;

@end
