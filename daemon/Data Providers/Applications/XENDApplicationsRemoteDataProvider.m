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
#import "XENDApplicationsManager.h"

@implementation XENDApplicationsRemoteDataProvider

+ (NSString*)providerNamespace {
    return @"applications";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    
    if ([definition isEqualToString:@"_loadIcon"]) {
        callback([self _loadIcon:data]);
    } else {
        callback(@{});
    }
}

- (NSDictionary*)_loadIcon:(NSDictionary*)data {
    NSData *result = [[XENDApplicationsManager sharedInstance] iconForApplication:[data objectForKey:@"identifier"]];
    return @{
        @"data": result != nil ? result : [NSNull null]
    };
}

@end
