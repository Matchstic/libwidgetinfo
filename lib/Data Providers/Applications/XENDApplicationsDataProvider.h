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

@interface XENDApplicationsDataProvider : XENDProxyDataProvider

/**
 * Requests icon data for the specified application
 * @param bundleIdentifer The application to load icon data for
 * @param callback The callback invoked after a response is recieved
 */
- (void)requestIconDataForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback;

/**
 * Requests for the specified application to be launched into the foreground
 * @param bundleIdentifer The application to open
 * @param callback The callback invoked after a response is recieved
 */
- (void)requestApplicationLaunchForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback;

@end
