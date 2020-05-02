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

#import "XENDInfoStats1URLHandler.h"

#import "../Internal/XENDWidgetManager-Internal.h"
#import "../Data Providers/Resources/XENDResourcesDataProvider.h"

@implementation XENDInfoStats1URLHandler

+ (BOOL)canHandleURL:(NSURL*)url {
    return [[url scheme] isEqualToString:@"file"] &&
            [[url absoluteString] rangeOfString:@"/var/mobile"].location != NSNotFound &&
    ([[url absoluteString] rangeOfString:@"BatteryStats.txt"].location != NSNotFound ||
     [[url absoluteString] rangeOfString:@"RAMStats.txt"].location != NSNotFound);
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    XENDResourcesDataProvider *provider = (XENDResourcesDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"resources"];
    
    NSDictionary *cachedData = [provider cachedData];
    
    NSLog(@"*** IS1 Compatibility: handling URL: %@", [url absoluteString]);
    
    if ([[url absoluteString] rangeOfString:@"BatteryStats.txt"].location != NSNotFound) {
        // Generate battery stats file.
    
        NSDictionary *battery = [cachedData objectForKey:@"battery"];
        NSMutableArray *lines = [NSMutableArray array];
        
        [lines addObject:[NSString stringWithFormat:@"Level: %d", [[battery objectForKey:@"percentage"] intValue] ]];
        
        NSString *stringState = @"";
        switch ([[battery objectForKey:@"state"] intValue]) {
            case 0:
                stringState = @"Unplugged";
                break;
            case 1:
                stringState = @"Charging";
                break;
            case 2:
                stringState = @"Fully Charged";
                break;
        }
        [lines addObject:[NSString stringWithFormat:@"State: %@", stringState]];
        [lines addObject:[NSString stringWithFormat:@"State-Raw: %d", [[battery objectForKey:@"state"] intValue]]];
        
        
        NSData* data = [[lines componentsJoinedByString:@"\n"] dataUsingEncoding:NSUTF8StringEncoding];
        completionHandler(nil, data, @"plain/text");
    } else if ([[url absoluteString] rangeOfString:@"RAMStats.txt"].location != NSNotFound) {
        
        NSDictionary *memory = [cachedData objectForKey:@"memory"];
        NSMutableArray *lines = [NSMutableArray array];
        
        [lines addObject:[NSString stringWithFormat:@"Free: %d", [[memory objectForKey:@"free"] intValue] ]];
        [lines addObject:[NSString stringWithFormat:@"Used: %d", [[memory objectForKey:@"used"] intValue]]];
        
        unsigned int totalUsable = [[memory objectForKey:@"free"] intValue] + [[memory objectForKey:@"used"] intValue];
        [lines addObject:[NSString stringWithFormat:@"Total usable: %d", totalUsable]];

        [lines addObject:[NSString stringWithFormat:@"Total physical: %d", [[memory objectForKey:@"available"] intValue]]];
        
        NSData* data = [[lines componentsJoinedByString:@"\n"] dataUsingEncoding:NSUTF8StringEncoding];
        completionHandler(nil, data, @"plain/text");
    } else {
        completionHandler(nil, nil, nil);
    }
}

@end
