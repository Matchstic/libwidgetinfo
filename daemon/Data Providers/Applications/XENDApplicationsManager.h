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
#import "PrivateHeaders.h"

@protocol XENDApplicationsManagerDelegate <NSObject>
- (void)applicationsMapDidUpdate:(NSArray*)map;
@end

@interface XENDApplicationsManager : NSObject <LSApplicationWorkspaceObserverProtocol, FBSApplicationDataStoreRepositoryClientObserver>

/**
 * Provides a shared instance of the applications manager, creating if necessary
 */
+ (instancetype)sharedInstance;

/**
 Generates metadata for the specified application
 */
- (NSDictionary*)metadataForApplication:(NSString*)bundleIdentifier;

/**
 Fetches the current application map
 */
- (NSArray*)currentApplicationMap;

@end
