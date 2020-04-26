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

#import "XENDProxyDataProvider.h"

@interface XENDWeatherDataProvider : XENDProxyDataProvider

/**
 Determines whether initial data has been recieved into the weather provider
 */
- (BOOL)hasInitialData;

/**
 * Register a listener to call upon when initial data becomes available.
 * @param listener The listener to register
 */
- (void)registerListenerForInitialData:(void (^)(NSDictionary *cachedData))listener;

@end
