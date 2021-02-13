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

#import "XENDCommsDataProvider.h"
#import "Private.h"
#import "XENDLogger.h"

#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <objc/runtime.h>

// Whilst the internal state updates every 5 seconds, this does not result
// in widget updates unless data actually changes.
#define UPDATE_INTERVAL 5

@interface XENDCommsDataProvider ()
@property (nonatomic, strong) NSTimer *updateTimer;
@property (nonatomic, strong) CTTelephonyNetworkInfo *networkInfo;
@end

@implementation XENDCommsDataProvider

+ (NSString*)providerNamespace {
    return @"comms";
}

- (void)intialiseProvider {
    [self restartUpdates];
}

- (void)noteDeviceDidEnterSleep {
    // Stop updates
    [self.updateTimer invalidate];
    self.updateTimer = nil;
}

- (void)noteDeviceDidExitSleep {
    // Restart updates
    [self restartUpdates];
}

- (void)restartUpdates {
    // Do initial update
    [self handleUpdate:nil];
    
    // Restart timer
    self.updateTimer = [NSTimer scheduledTimerWithTimeInterval:UPDATE_INTERVAL target:self selector:@selector(handleUpdate:) userInfo:nil repeats:YES];
}

- (void)handleUpdate:(id)sender {
    NSDictionary *wifi = [self wifiData];
    NSDictionary *telephony = [self telelphonyData];
    NSDictionary *bluetooth = [self bluetoothData];
    
    [self optionallyNotifyNewData:@{
        @"wifi": wifi,
        @"telephony": telephony,
        @"bluetooth": bluetooth
    }];
}

- (void)optionallyNotifyNewData:(NSDictionary*)newData {
    // Don't do anything if the new data hasn't changed
    if ([newData isEqualToDictionary:self.cachedDynamicProperties]) {
        return;
    }
    
    self.cachedDynamicProperties = [newData mutableCopy];
    [self notifyWidgetManagerForNewProperties];
}

- (BOOL)isSpringBoard {
    return [[[NSBundle mainBundle] bundleIdentifier] isEqualToString:@"com.apple.springboard"];
}

- (NSDictionary*)wifiData {
    NSDictionary *defaultData = @{
        @"enabled": @YES,
        @"bars": @3,
        @"ssid": @"Network",
    };
    
    // Failsafe for not being on SpringBoard
    if (![self isSpringBoard]) return defaultData;
    
    @try {
        SBWiFiManager *wifiManager = [objc_getClass("SBWiFiManager") sharedInstance];
        
        BOOL enabled    = NO;
        int bars        = 0;
        NSString *ssid  = @"";
        
        if ([wifiManager respondsToSelector:@selector(wiFiEnabled)]) {
            enabled = [wifiManager wiFiEnabled];
        }
        
        if ([wifiManager respondsToSelector:@selector(signalStrengthBars)]) {
            bars = [wifiManager signalStrengthBars];
        }
        
        if ([wifiManager respondsToSelector:@selector(currentNetworkName)]) {
            ssid = [wifiManager currentNetworkName];
        }
        
        return @{
            @"enabled": @(enabled),
            @"bars": @(bars),
            @"ssid": [self escapeString:ssid]
        };
    } @catch (NSException *e) {
        return defaultData;
    }
    
    return @{};
}

- (NSDictionary*)telelphonyData {
    NSDictionary *defaultData = @{
        @"airplaneMode": @NO,
        @"bars": @5,
        @"operator": @"Carrier",
        @"type": @"3G"
    };
    
    // Failsafe for not being on SpringBoard
    if (![self isSpringBoard]) return defaultData;
    
    @try {
        SBTelephonyManager *telephonyManager = [objc_getClass("SBTelephonyManager") sharedTelephonyManager];
        
        BOOL airplaneMode   = NO;
        int bars            = 0;
        NSString *operator  = @"";
        NSString *type      = @"";
        
        // Bars
        if ([telephonyManager respondsToSelector:@selector(signalStrengthBars)])
            bars = [telephonyManager signalStrengthBars];
        else if ([telephonyManager respondsToSelector:@selector(subscriptionInfo)])
            bars = [telephonyManager subscriptionInfo].signalStrengthBars;
        else if ([telephonyManager respondsToSelector:@selector(_primarySubscriptionInfo)])
            bars = [[telephonyManager _primarySubscriptionInfo] signalStrengthBars];

        // Operator name
        if ([telephonyManager respondsToSelector:@selector(operatorName)])
            operator = [telephonyManager operatorName];
        else if ([telephonyManager respondsToSelector:@selector(subscriptionInfo)])
            operator = [telephonyManager subscriptionInfo].operatorName;
        else if ([telephonyManager respondsToSelector:@selector(_primarySubscriptionInfo)])
            operator = [telephonyManager _primarySubscriptionInfo].operatorName;
        
        // Network type
        if (!self.networkInfo) {
            self.networkInfo = [CTTelephonyNetworkInfo new];
        }
        
        NSString* info = self.networkInfo.currentRadioAccessTechnology;
        if ([info isEqualToString:CTRadioAccessTechnologyGPRS] ||
            [info isEqualToString:CTRadioAccessTechnologyEdge]) {
            type = @"2G";
        } else if ([info isEqualToString:CTRadioAccessTechnologyWCDMA] ||
                   [info isEqualToString:CTRadioAccessTechnologyHSDPA] ||
                   [info isEqualToString:CTRadioAccessTechnologyHSUPA] ||
                   [info isEqualToString:CTRadioAccessTechnologyeHRPD]) {
            type = @"3G";
        } else if ([info isEqualToString:CTRadioAccessTechnologyCDMA1x] ||
                   [info isEqualToString:CTRadioAccessTechnologyCDMAEVDORev0] ||
                   [info isEqualToString:CTRadioAccessTechnologyCDMAEVDORevA] ||
                   [info isEqualToString:CTRadioAccessTechnologyCDMAEVDORevB]) {
            type = @"CDMA";
        } else if ([info isEqualToString:CTRadioAccessTechnologyLTE]) {
            type = @"LTE";
        }
        
        // On iOS 14.1 and greater, 5G is an available variant
        if (@available(iOS 14.1, *))
            if ([info isEqualToString:CTRadioAccessTechnologyNRNSA] ||
                [info isEqualToString:CTRadioAccessTechnologyNR]) {
                type = @"5G";
            }
        
        // Airplane mode
        if ([telephonyManager respondsToSelector:@selector(isInAirplaneMode)]) {
            airplaneMode = [telephonyManager isInAirplaneMode];
        } else {
            SBAirplaneModeController *airplaneModeController = [objc_getClass("SBAirplaneModeController") sharedInstance];
            if ([airplaneModeController respondsToSelector:@selector(isInAirplaneMode)]) {
                airplaneMode = [airplaneModeController isInAirplaneMode];
            }
        }
        
        return @{
            @"airplaneMode": @(airplaneMode),
            @"bars": @(bars),
            @"operator": [self escapeString:operator],
            @"type": type
        };
    } @catch (NSException *e) {
        return defaultData;
    }
}

- (NSDictionary*)bluetoothData {
    /**
     enabled: boolean;
     scanning: boolean;
     discoverable: boolean;
     devices: CommunicationsBluetoothDevice[];
     */
    
    NSDictionary *defaultData = @{
        @"enabled": @YES,
        @"scanning": @NO,
        @"discoverable": @NO,
        @"devices": @[]
    };
    
    // Failsafe for not being on SpringBoard
    if (![self isSpringBoard]) return defaultData;
    
    @try {
        BluetoothManager *bluetoothManager = [objc_getClass("BluetoothManager") sharedInstance];
        
        BOOL enabled = NO;
        BOOL scanning = NO;
        BOOL discoverable = NO;
        NSMutableArray *devices = [NSMutableArray new];
        
        if ([bluetoothManager respondsToSelector:@selector(enabled)])
            enabled = [bluetoothManager enabled];
        
        if ([bluetoothManager respondsToSelector:@selector(deviceScanningInProgress)])
            scanning = [bluetoothManager deviceScanningInProgress];
        
        if ([bluetoothManager respondsToSelector:@selector(isDiscoverable)])
            discoverable = [bluetoothManager isDiscoverable];
        
        if ([bluetoothManager respondsToSelector:@selector(connectedDevices)]) {
            NSArray *connectedDevices = [bluetoothManager connectedDevices];
            
            for (BluetoothDevice *device in connectedDevices) {
                @try {
                    NSString *name = [device name];
                    NSString *address = [device address];
                    int batteryLevel = [device batteryLevel];
                    BOOL supportsBatteryLevel = [device supportsBatteryLevel];
                    BOOL isAccessory = [device isAccessory];
                    BOOL isAppleAudioDevice = [device isAppleAudioDevice];
                    int minorClass = [device minorClass];
                    int majorClass = [device majorClass];
                    
                    [devices addObject:@{
                        @"name": [self escapeString:name],
                        @"address": address,
                        @"battery": @(batteryLevel),
                        @"supportsBattery": @(supportsBatteryLevel),
                        @"isAccessory": @(isAccessory),
                        @"isAppleAudioDevice": @(isAppleAudioDevice),
                        @"minorClass": @(minorClass),
                        @"majorClass": @(majorClass)
                    }];
                } @catch (NSException *e) {
                    continue;
                }
            }
        }
        
        return @{
            @"enabled": @(enabled),
            @"scanning": @(scanning),
            @"discoverable": @(discoverable),
            @"devices": devices
        };
    } @catch (NSException *e) {
        return defaultData;
    }
}

@end
