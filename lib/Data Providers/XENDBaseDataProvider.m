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

#import "XENDBaseDataProvider.h"

@implementation XENDBaseDataProvider

// The data topic provided by the data provider
+ (NSString*)providerNamespace {
    return @"_base_";
}

- (instancetype)init{
    self = [super init];
    
    if (self) {
        self.cachedStaticProperties = [NSDictionary dictionary];
        self.cachedDynamicProperties = [NSMutableDictionary dictionary];
        
        [self intialiseProvider];
    }
    
    return self;
}

- (void)intialiseProvider {}

- (void)noteDeviceDidEnterSleep {}
- (void)noteDeviceDidExitSleep {}

// Register a delegate object to call upon when new data becomes available.
- (void)registerDelegate:(id<XENDWidgetManagerDelegate>)delegate {
    self.delegate = delegate;
}

// Called when a new widget is added, and it needs to be provided new data on load.
- (NSDictionary*)cachedData {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    
    if (self.cachedDynamicProperties)
        [result addEntriesFromDictionary:self.cachedDynamicProperties];
    
    if (self.cachedStaticProperties)
        [result addEntriesFromDictionary:self.cachedStaticProperties];
    
    return result;
}

// Called when a widget message has been received for this provider
// The callback MUST always be called into
- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    callback(@{});
}

// Called when network access is lost
- (void)networkWasDisconnected {
    
}

// Called when network access is restored
- (void)networkWasConnected {
    
}

- (void)noteSignificantTimeChange {
    
}

- (NSString*)escapeString:(NSString*)input {
    if (!input)
        return @"";
    
    input = [input stringByReplacingOccurrencesOfString:@"'" withString:@"\\'"];
    input = [input stringByReplacingOccurrencesOfString: @"\"" withString:@"\\\""];
    
    return input;
}

- (void)notifyWidgetManagerForNewProperties {
    // Call with cachedData contents
    NSString *providerNamespace = [[self class] providerNamespace];
    [self.delegate updateWidgetsWithNewData:[self cachedData] forNamespace:providerNamespace];
}

@end
