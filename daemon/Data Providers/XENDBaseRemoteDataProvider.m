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

#import "XENDBaseRemoteDataProvider.h"
#import "XENDLogger.h"

@implementation XENDBaseRemoteDataProvider

- (instancetype)initWithConnection:(XENDBaseDaemonListener*)connection {
    self = [super init];
    
    if (self) {
        self.connection = connection;
        
        self.cachedStaticProperties = [NSDictionary dictionary];
        self.cachedDynamicProperties = [NSMutableDictionary dictionary];
        
        [self intialiseProvider];
    }
    
    return self;
}

+ (NSString*)providerNamespace {
    return @"_base_";
}

- (void)intialiseProvider {}
- (void)noteDeviceDidEnterSleep {}
- (void)noteDeviceDidExitSleep {}
- (void)networkWasDisconnected {}
- (void)networkWasConnected {}
- (void)noteSignificantTimeChange {}
- (void)noteHourChange {}

- (NSDictionary*)currentData {
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    [result setObject:self.cachedDynamicProperties forKey:@"dynamic"];
    [result setObject:self.cachedStaticProperties forKey:@"static"];
    return [result copy];
}

- (void)setCachedDynamicProperties:(NSMutableDictionary *)cachedDynamicProperties {
    BOOL isIdentical = [cachedDynamicProperties isEqualToDictionary:_cachedDynamicProperties];
    
    // Do a deep copy of the properties for safety
    id buffer = [NSKeyedArchiver archivedDataWithRootObject:cachedDynamicProperties];
    cachedDynamicProperties = [NSKeyedUnarchiver unarchiveObjectWithData:buffer];
    
    _cachedDynamicProperties = cachedDynamicProperties;
    
    if (!isIdentical) {
        [self notifyRemoteForNewDynamicProperties];
    } else {
        XENDLog(@"DEBUG :: Ignoring update request because data has not changed");
    }
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    callback(@{});
}

- (NSString*)escapeString:(NSString*)input {
    if (!input)
        return @"";
    
    input = [input stringByReplacingOccurrencesOfString:@"'" withString:@"\\'"];
    input = [input stringByReplacingOccurrencesOfString: @"\"" withString:@"\\\""];
    
    return input;
}

- (void)notifyRemoteForNewDynamicProperties {
    NSString *providerNamespace = [[self class] providerNamespace];
    
    XENDLog(@"DEBUG :: New data in %@", providerNamespace);
    
    [self.connection notifyUpdatedDynamicProperties:self.cachedDynamicProperties forNamespace:providerNamespace];
}

@end
