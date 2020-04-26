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

#import <Foundation/Foundation.h>
#import "XTWCUnits.h"

@interface XTWCDailyForecast : NSObject

@property (nonatomic, strong) NSString *blurb;
@property (nonatomic, strong) NSString *blurbAuthor;
@property (nonatomic, strong) NSString *dayOfWeek;
@property (nonatomic, strong) NSNumber *weekdayNumber;
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
@property (nonatomic, strong) NSNumber *cloudCoverPercentage;
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

/**
 Reloads properties for units change
 */
- (void)reloadForUnitsChanged:(struct XTWCUnits)units;

@end
