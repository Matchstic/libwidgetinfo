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

#ifndef XIStatusBarHeaders_h
#define XIStatusBarHeaders_h

@interface SBTelephonySubscriptionInfo : NSObject
@property (nonatomic,readonly) unsigned long long signalStrengthBars;
@property (nonatomic,copy,readonly) NSString * operatorName;
@end

// iOS 13
@interface STTelephonySubscriptionInfo : NSObject
- (NSString *)operatorName;
- (unsigned long long)signalStrengthBars;
@end

@interface SBTelephonyManager : NSObject
+ (id)sharedTelephonyManager;
- (int)signalStrengthBars;
- (int)signalStrength;
- (id)operatorName;
- (BOOL)isInAirplaneMode; // iOS 10

- (SBTelephonySubscriptionInfo*)subscriptionInfo; // iOS 12
- (STTelephonySubscriptionInfo* )_primarySubscriptionInfo; // iOS 13
@end

@interface SBWiFiManager : NSObject
+ (id)sharedInstance;
- (int)signalStrengthBars;
- (id)currentNetworkName;
- (BOOL)wiFiEnabled;
@end

@interface BluetoothDevice : NSObject
- (id)address;
- (int)batteryLevel;
- (bool)isAccessory;
- (bool)isAppleAudioDevice;
- (id)name;
- (bool)supportsBatteryLevel;
- (unsigned int)majorClass;
- (unsigned int)minorClass;

- (id)accessoryInfo;
@end

@interface BluetoothManager : NSObject
+ (instancetype)sharedInstance;
- (BOOL)enabled;
- (BOOL)isDiscoverable;
- (BOOL)deviceScanningInProgress;
- (NSArray<BluetoothDevice*>*)connectedDevices;
@end

// iOS 11+
@interface SBAirplaneModeController : NSObject
@property(nonatomic, getter=isInAirplaneMode) BOOL inAirplaneMode;
@end


@interface BCBatteryDevice : NSObject
@property (nonatomic,copy) NSString * identifier;
@property (nonatomic,copy) NSString * name;
@property (assign,nonatomic) long long percentCharge;
@property (assign,getter=isConnected,nonatomic) BOOL connected;
@property (assign,getter=isCharging,nonatomic) BOOL charging;
@property (assign,getter=isInternal,nonatomic) BOOL internal;
@property (assign,getter=isPowerSource,nonatomic) BOOL powerSource;
@property (assign,nonatomic) BOOL approximatesPercentCharge;
@property (assign,nonatomic) unsigned long long parts;
@property (assign,getter=isWirelesslyCharging,nonatomic) BOOL wirelesslyCharging;
@property (nonatomic,copy) NSString * groupName;
@property (nonatomic,copy,readonly) NSString * matchIdentifier;
@property (assign,nonatomic) long long transportType;
@property (assign,nonatomic) long long powerSourceState;
@property (assign,getter=isFake,nonatomic) BOOL fake;
@property (assign,getter=isBatterySaverModeActive,nonatomic) BOOL batterySaverModeActive;
@property (assign,getter=isLowBattery,nonatomic) BOOL lowBattery;
@property (nonatomic,copy) NSString * accessoryIdentifier;
@property (assign,nonatomic) unsigned long long accessoryCategory;
@property (nonatomic,copy) NSString * modelNumber;
@property (nonatomic,readonly) long long vendor;
@property (nonatomic,readonly) long long productIdentifier;
@end

@interface BCBatteryDeviceController : NSObject
@property (nonatomic,copy,readonly) NSArray <BCBatteryDevice*>* connectedDevices;
+ (id)sharedInstance;
- (NSArray *)connectedDevices;
- (void)addBatteryDeviceObserver:(id)arg1 queue:(id)arg2;
- (void)removeBatteryDeviceObserver:(id)arg1 ;
- (void)connectedDevicesWithResult:(/*^block*/id)arg1;
@end

#endif /* XIStatusBarHeaders_h */
