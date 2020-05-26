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

#import "XENDApplicationsDataProvider.h"
#import "PrivateHeaders.h"

@implementation XENDApplicationsDataProvider

+ (NSString*)providerNamespace {
    return @"applications";
}

- (void)requestIconDataForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback {
    
    // Using UIKit private API to fetch icon
    // This works inside both SpringBoard and Preferences, the main targets
    NSData *png;
    if (!bundleIdentifer || [bundleIdentifer isEqualToString:@""]) {
        png = (id)[NSNull null];
    } else {
        UIImage *icon = [UIImage _applicationIconImageForBundleIdentifier:bundleIdentifer format:2 scale:[UIScreen mainScreen].scale];
        
        png = UIImagePNGRepresentation(icon);
    }
    
    if (!png) {
        png = (id)[NSNull null];
    }
    
    callback(@{
        @"data": png
    });
}

- (void)requestApplicationLaunchForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback {
    
    // Using private SpringBoard function to launch application
    // This feature is not available elsewhere.
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(launchApplicationWithIdentifier:suspended:)]) {
        
        [(SpringBoard*)[UIApplication sharedApplication] launchApplicationWithIdentifier:bundleIdentifer suspended:NO];
    }
    
    callback(@{});
}

@end
