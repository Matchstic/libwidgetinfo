//
//  XTWCHourlyForecast.h
//  Daemon
//
//  Created by Matt Clarke on 18/01/2020.
//

#import <Foundation/Foundation.h>
#import "XTWCUnits.h"

@interface XTWCHourlyForecast : NSObject

/**
 Average cloud cover expressed as a percentage.
 
 Values range from: 1 to 100
 */
@property (nonatomic, strong) NSNumber *cloudCoverPercentage;

/**
 Icon code corresponding to the condition forecasted.
 See page 2, column "icon_code" here: https://docs.google.com/document/d/1MZwWYqki8Ee-V7c7InBuA5CDVkjb3XJgpc39hI9FsI0/edit?pli=1
 */
@property (nonatomic, strong) NSNumber *conditionIcon;

/**
 Short description of the condition forecasted.
 */
@property (nonatomic, strong) NSString *conditionDescription;

/**
 Indicates whether it is daytime or night-time based on the Local Apparent Time of the location.
 */
@property (nonatomic, strong) NSString *dayIndicator;

/**
 The localised day of the week this forecast corresponds to.
 */
@property (nonatomic, strong) NSString *dayOfWeek;

/**
 The temperature which air must be cooled at constant pressure to reach saturation. When the dewpoint and temperature are equal, clouds or fog will typically form. The closer the values of temperature and dewpoint, the higher the relative humidity.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.temperature at runtime for the units in use.
 
 Values range from: -80 to 100 (°F) or -62 to 37 (°C)
 */
@property (nonatomic, strong) NSNumber *dewpoint;

/**
 An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the wind chill or heat index.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.temperature at runtime for the units in use.
 */
@property (nonatomic, strong) NSNumber *feelsLike;

/**
 The index of this forecast in relation to the others of the same type.
 */
@property (nonatomic, strong) NSNumber *forecastHourIndex;

/**
 The maximum expected wind gust speed.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.speed at runtime for the units in use.
 */
@property (nonatomic, strong) NSNumber *gust;

/**
 An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of warm temperatures and high humidity.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.temperature at runtime for the units in use.
 */
@property (nonatomic, strong) NSNumber *heatIndex;

/**
 Maximum probability of precipitation, expressed as a percentage.
 
 Values range from: 1 to 100
 */
@property (nonatomic, strong) NSNumber *precipProbability;

/**
 Type of precipitation associated with the probability.
 
 Values: precip (unknown), rain, snow
 */
@property (nonatomic, strong) NSString *precipType;

/**
 The relative humidity of the air, which is defined as the ratio of the amount of water vapor in the air to the amount of vapor required to bring the air to saturation at a constant temperature.
 Expressed as a percentage.

 Values range from: 1 to 100
 */
@property (nonatomic, strong) NSNumber *relativeHumidity;

/**
 The temperature of the air.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.temperature at runtime for the units in use.
 */
@property (nonatomic, strong) NSNumber *temperature;

/**
 A localised description of the UV index, in relation to the risk of skin damage due to exposure.
 
 Values: Not Available, No Report, Low, Moderate, High, Very High, Extreme
 */
@property (nonatomic, strong) NSString *uvDescription;

/**
 The maximum UV index in the forecast.
 
 Values range from: 0 to 16
 Note: a value of -2 equals "Not Available", and -1 equals "No Report"
 */
@property (nonatomic, strong) NSNumber *uvIndex;

/**
Time from which this forecast is valid.
Validity lasts for 1 hour from this time.
*/
@property (nonatomic, readwrite) uint64_t validUNIXTime;

/**
 The distance that is visible. A distance of 0 can be reported, due to the effects of snow or fog.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.distance at runtime for the units in use.
 */
@property (nonatomic, strong) NSNumber *visibility;

/**
 An apparent temperature. It represents what the air temperature “feels like” on exposed human skin due to the combined effect of the cold temperatures and wind speed.
 Only available if the temperature is less than 40°F or 5°C.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.temperature at runtime for the units in use.
 */
@property (nonatomic, strong) NSNumber *windChill;

/**
 The direction from which the wind blows expressed in degrees.
 e.g., 360 is North, 90 is East, 180 is South and 270 is West.
 
 Values range from: 1 to 360
 */
@property (nonatomic, strong) NSNumber *windDirection;

/**
 The direction from which the wind blows expressed in an abbreviated form.
 e.g. N, E, S, W, NW, NNW etc
 
 Values: N , NNE , NE, ENE, E, ESE, SE,SSE, S, SSW, SW, WSW, W,WNW, NW, NNW, CALM (no wind speed), VAR (variable)
 */
@property (nonatomic, strong) NSString *windDirectionCardinal;

/**
 The speed at which the wind is blowing.
 Units are automatically converted between metric and imperial depending on the user's preferences.
 See weather.data.units.speed at runtime for the units in use.
 */
@property (nonatomic, strong) NSNumber *windSpeed;

/**
Initialises properties with API response
*/
- (instancetype)initWithData:(NSDictionary*)data units:(struct XTWCUnits)units;

@end
