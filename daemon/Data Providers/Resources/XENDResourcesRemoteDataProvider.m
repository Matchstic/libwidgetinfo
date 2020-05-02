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

#import "XENDResourcesRemoteDataProvider.h"

#import "IOPSKeys.h"
#import "IOPowerSources.h"

@interface XENDResourcesRemoteDataProvider ()
- (void)_updateBatteryState:(NSArray*)sourceData;
@end

static void powerSourceChanged(void *context) {
    CFTypeRef powerBlob = IOPSCopyPowerSourcesInfo();
    CFArrayRef powerSourcesList = IOPSCopyPowerSourcesList(powerBlob);
    
    NSMutableArray *sourceData = [NSMutableArray array];
    for (unsigned int i = 0U; i < CFArrayGetCount(powerSourcesList); ++i) {
        CFTypeRef powerSource = CFArrayGetValueAtIndex(powerSourcesList, i);
        CFDictionaryRef description = IOPSGetPowerSourceDescription(powerBlob, powerSource);
        
        [sourceData addObject:(__bridge NSDictionary*)description];
    }
    
    [(__bridge XENDResourcesRemoteDataProvider *)context _updateBatteryState:sourceData];
    
    CFRelease(powerBlob);
    CFRelease(powerSourcesList);
}

@implementation XENDResourcesRemoteDataProvider

+ (NSString*)providerNamespace {
    return @"resources";
}

- (void)intialiseProvider {
    // Setup battery state monitoring
    CFRunLoopSourceRef source = IOPSNotificationCreateRunLoopSource(powerSourceChanged, (__bridge void *)(self));
    if (source) {
        CFRunLoopAddSource(CFRunLoopGetCurrent(), source, kCFRunLoopDefaultMode);
        
        // Get initial data
        powerSourceChanged((__bridge void *)(self));
    } else
        NSLog(@"ERROR :: Failed to setup battery state monitoring");
}

- (void)_updateBatteryState:(NSArray*)sourceData {
    
    NSDictionary *internalBatteryData = nil;
    for (NSDictionary *source in sourceData) {
        if ([[source objectForKey:@kIOPSTypeKey] isEqualToString:@kIOPSInternalBatteryType]) {
            internalBatteryData = source;
            break;
        }
    }
    
    if (!internalBatteryData) {
        NSLog(@"ERROR :: No information present about the internal battery");
        return;
    }
    
    NSNumber *chargingState = @0;
    if ([[internalBatteryData objectForKey:@kIOPSIsChargedKey] boolValue]) {
        chargingState = @2;
    } else if ([[internalBatteryData objectForKey:@kIOPSIsChargingKey] boolValue]) {
        chargingState = @1;
    }
        
    NSDictionary *resultData = @{
        @"percentage": [internalBatteryData objectForKey:@kIOPSCurrentCapacityKey],
        @"state": chargingState,
        @"source": [[internalBatteryData objectForKey:@kIOPSPowerSourceStateKey] isEqualToString:@kIOPSACPowerValue] ? @"ac" : @"battery",
        @"timeUntilCharged": [internalBatteryData objectForKey:@kIOPSTimeToFullChargeKey], // mins
        @"timeUntilEmpty": [internalBatteryData objectForKey:@kIOPSTimeToEmptyKey], // mins
        @"batterySerial": [internalBatteryData objectForKey:@kIOPSHardwareSerialNumberKey],
        @"health": [internalBatteryData objectForKey:@kIOPSBatteryHealthKey],
        @"current": [internalBatteryData objectForKey:@kIOPSCurrentKey], // mAh
    };
    
    self.cachedDynamicProperties = [@{
        @"battery": resultData
    } mutableCopy];
    [self notifyRemoteForNewDynamicProperties];
}



@end
