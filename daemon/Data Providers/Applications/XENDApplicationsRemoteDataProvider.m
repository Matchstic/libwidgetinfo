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

#import "XENDApplicationsRemoteDataProvider.h"

@interface XENDApplicationsManager (Private)
- (void)_setDelegate:(id<XENDApplicationsManagerDelegate>)delegate;
@end

@implementation XENDApplicationsRemoteDataProvider

+ (NSString*)providerNamespace {
    return @"applications";
}

- (void)intialiseProvider {
    XENDApplicationsManager *manager = [XENDApplicationsManager sharedInstance];
    
    // Initial update
    self.cachedDynamicProperties = [@{
        @"allApplications": [manager currentApplicationMap]
    } mutableCopy];
    
    // Set delegate for monitored updates
    [manager _setDelegate:self];
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    callback(@{});
}

#pragma mark - Manager delegate

- (void)applicationsMapDidUpdate:(NSArray *)map {
    self.cachedDynamicProperties = [@{
        @"allApplications": map
    } mutableCopy];
    
    [self notifyRemoteForNewDynamicProperties];
}

@end
