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

/**
Defines an observation of pollutants in the air.
This is only available in: for: China, France, India, Germany, Mexico, Spain, UK, US
 */
@interface XTWCAirQualityObservation : NSObject

/**
Description of the level of pollutants, in the categories: Low, Moderate, High, Very High, Serious
 */
@property (nonatomic, strong) NSString *categoryLevel;

/**
Index of the level of pollutants, in the range 1-5. This maps onto the human-readable categoryLevel
 */
@property (nonatomic, strong) NSNumber *categoryIndex;

/**
Source-provided comment on the data
*/
@property (nonatomic, strong) NSString *comment;

/**
Air quality index, as per the scale used for measurement.
It is based on the concentrations of five pollutants: Ozone, PM2.5, PM10, Nitrogen Dioxide and Sulfur Dioxide
e.g., a scale of DAQI is from 1-10
*/
@property (nonatomic, strong) NSNumber *index;

/**
Scale the data corresponds to. e.g., DAQI
*/
@property (nonatomic, strong) NSString *scale;

/**
The source of the data. e.g., DEFRA
 */
@property (nonatomic, strong) NSString *source;

/**
 An array of data about each of the five pollutants. Note that not all may be present due to API limitations.
 Available pollutants:
 - Ozone
 - PM2.5
 - PM10
 - Carbon Monoxide
 - Nitrogen Dioxide
 - Sulfur Dioxide
 */
@property (nonatomic, strong) NSDictionary *pollutants;

/**
 Time from which this observation is valid.
 Validity lasts for 24 hours from this time.
 */
@property (nonatomic, readwrite) uint64_t validFromUNIXTime;

/**
 Initialises properties with API response
 */
- (instancetype)initWithData:(NSDictionary*)data;

- (instancetype)initWithFakeData;

@end
