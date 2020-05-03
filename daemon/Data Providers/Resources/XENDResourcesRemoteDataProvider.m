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
#import "XENDLogger.h"

#import "IOPSKeys.h"
#import "IOPowerSources.h"

// Using a window of 1hr's worth of samples
#define MAX_AMPERAGE_SAMPLES 60
#define MIN_AMPERAGE_SAMPLES 10
#define AMPERAGE_SAMPLE_RATE 60
#define SAMPLE_COUNT_TO_FORCE_UPDATE 10 // Leads to a forced update every 10 mins

@interface XENDResourcesRemoteDataProvider ()
@property (nonatomic, strong) NSTimer *amperageSampler;
@property (nonatomic, strong) NSMutableArray *amperageSamples;
@property (nonatomic, readwrite) int sampleIncrementor;
@property (nonatomic, readwrite) BOOL lastUpdateWasCharging;

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
    self.lastUpdateWasCharging = NO;
    self.sampleIncrementor = 0;
    self.amperageSamples = [NSMutableArray array];
    
    // Setup battery state monitoring
    CFRunLoopSourceRef source = IOPSNotificationCreateRunLoopSource(powerSourceChanged, (__bridge void *)(self));
    if (source) {
        CFRunLoopAddSource(CFRunLoopGetCurrent(), source, kCFRunLoopDefaultMode);
        
        // Get initial data
        powerSourceChanged((__bridge void *)(self));
        
        // Start sampling current amperage
        self.amperageSampler = [NSTimer scheduledTimerWithTimeInterval:AMPERAGE_SAMPLE_RATE target:self selector:@selector(_averageAmperageSampleFired:) userInfo:nil repeats:YES];
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
    
    io_service_t powerSource = IOServiceGetMatchingService(kIOMasterPortDefault, IOServiceMatching("IOPMPowerSource"));
    CFMutableDictionaryRef batteryProperties = NULL;
    
    IORegistryEntryCreateCFProperties(powerSource, &batteryProperties, NULL, 0);
    
    NSDictionary *extensiveBatteryInfo = (__bridge_transfer NSDictionary *)batteryProperties;
    
    NSNumber *chargingState = @0;
    if ([[internalBatteryData objectForKey:@kIOPSIsChargedKey] boolValue] ||
        [[internalBatteryData objectForKey:@kIOPSIsFinishingChargeKey] boolValue]) {
        chargingState = @2;
    } else if ([[internalBatteryData objectForKey:@kIOPSIsChargingKey] boolValue]) {
        chargingState = @1;
    }
    
    // Check if the amperage samples need to be reset, due to AC power disconnection
    if ([chargingState intValue] == 0 && self.lastUpdateWasCharging) {
        self.amperageSamples = [NSMutableArray array];
    }
    
    self.lastUpdateWasCharging = [chargingState intValue] != 0;
    
    int averageTimeRemaining = [self averageTimeRemaining:extensiveBatteryInfo];
    
    // Calculate health
    double maxCapacity = [[extensiveBatteryInfo objectForKey:@"DesignCapacity"] doubleValue];
    double absoluteCapacity = [[extensiveBatteryInfo objectForKey:@"AbsoluteCapacity"] doubleValue];
    int healthPercentage = (absoluteCapacity / maxCapacity) * 100.0;
    
    // Generate capacity information
    NSDictionary *capacity = @{
        @"current": [extensiveBatteryInfo objectForKey:@"AppleRawCurrentCapacity"] ? [extensiveBatteryInfo objectForKey:@"AppleRawCurrentCapacity"] : @-1,
        @"maximim": [extensiveBatteryInfo objectForKey:@"AbsoluteCapacity"] ? [extensiveBatteryInfo objectForKey:@"AbsoluteCapacity"] : @-1,
        @"design": [extensiveBatteryInfo objectForKey:@"DesignCapacity"] ? [extensiveBatteryInfo objectForKey:@"DesignCapacity"] : @-1,
    };

    NSDictionary *resultData = @{
        @"percentage": [internalBatteryData objectForKey:@kIOPSCurrentCapacityKey] ? [internalBatteryData objectForKey:@kIOPSCurrentCapacityKey] : @0,
        @"state": chargingState,
        @"source": [[internalBatteryData objectForKey:@kIOPSPowerSourceStateKey] isEqualToString:@kIOPSACPowerValue] ? @"ac" : @"battery",
        @"timeUntilEmpty": @(averageTimeRemaining), // mins
        @"serial": [extensiveBatteryInfo objectForKey:@"Serial"] ? [extensiveBatteryInfo objectForKey:@"Serial"] : @"",
        @"health": @(healthPercentage),
        @"capacity": capacity,
        @"cycles": [extensiveBatteryInfo objectForKey:@"CycleCount"] ? [extensiveBatteryInfo objectForKey:@"CycleCount"] : @-1
    };
    
    // Notify remote of new battery data
    self.cachedDynamicProperties = [@{
        @"battery": resultData
    } mutableCopy];
    [self notifyRemoteForNewDynamicProperties];
}

// Returns in minutes
- (int)averageTimeRemaining:(NSDictionary*)extensiveBatteryInfo {
    // Return 'calculating' if there is not enough samples
    if (self.amperageSamples.count < MIN_AMPERAGE_SAMPLES) return -1;
    
    double remainingCapacity = [[extensiveBatteryInfo objectForKey:@"AppleRawCurrentCapacity"] doubleValue];
    if (remainingCapacity == 0) return -1;
    
    // Calculate average from current samples
    double drainRate = -1;
    for (NSNumber *sample in self.amperageSamples) {
        drainRate += fabs([sample doubleValue]);
    }
    
    if (drainRate == -1) {
        return -1;
    }
    
    drainRate /= (double)self.amperageSamples.count;
    
    // Remaining Battery Life [h] = Battery Remaining Capacity [mAh/mWh] / Battery Rolling Average Drain Rate [mA/mW]
    return (remainingCapacity / drainRate) * 60;
}

- (void)_averageAmperageSampleFired:(NSTimer*)timer {
    // Don't update samples whilst charging
    if (self.lastUpdateWasCharging) return;
    
    // Get a sample of the current amperage used
    io_service_t powerSource = IOServiceGetMatchingService(kIOMasterPortDefault, IOServiceMatching("IOPMPowerSource"));
    CFMutableDictionaryRef batteryProperties = NULL;
    
    IORegistryEntryCreateCFProperties(powerSource, &batteryProperties, NULL, 0);
    
    NSDictionary *extensiveBatteryInfo = (__bridge_transfer NSDictionary *)batteryProperties;
    
    NSNumber *sample = [extensiveBatteryInfo objectForKey:@"Amperage"];
    
    BOOL willBecomeViable = self.amperageSamples.count == MIN_AMPERAGE_SAMPLES - 1;
    if (self.amperageSamples.count == MAX_AMPERAGE_SAMPLES) {
        // Pop off the oldest value
        [self.amperageSamples removeLastObject];
    }
    
    [self.amperageSamples insertObject:sample atIndex:0];
    
    // Every now and again, we'll push an update after obtaining X samples
    // This is to keep the readout of time remaining somewhat fresh
    self.sampleIncrementor++;

    if (willBecomeViable) {
        XENDLog(@"Generating a power event due to there now being enough amperage samples");
        
        // Fire off a power update event, now that there is enough samples to derive the time remaining
        powerSourceChanged((__bridge void *)(self));
    } else if (self.sampleIncrementor >= SAMPLE_COUNT_TO_FORCE_UPDATE) {
        self.sampleIncrementor = 0;
        
        powerSourceChanged((__bridge void *)(self));
    }
}

@end

/* Example limited output
 "Battery Provides Time Remaining" = 1;
  "Current Capacity" = 100;
  "Is Charging" = 1;
  "Is Finishing Charge" = 1;
  "Is Present" = 1;
  "Max Capacity" = 100;
  Name = "InternalBattery-0";
  "Play Charging Chime" = 1;
  "Power Source ID" = 3211363;
  "Power Source State" = "AC Power";
  "Raw External Connected" = 1;
  "Show Charging UI" = 1;
  "Time to Empty" = 0;
  "Time to Full Charge" = 0;
  "Transport Type" = Internal;
  Type = InternalBattery;
 */

// Extensive battery informatione example:
/*
 PostChargeWaitSeconds: 120
 built-in: 1
 AppleRawAdapterDetails: (
         {
         AdapterID = 0;
         Current = 2400;
         Description = "usb host";
         FamilyCode = "-536854528";
         PMUConfiguration = 2420;
         SharedSource = 0;
         Source = 0;
         UsbHvcHvcIndex = 0;
         UsbHvcMenu =         (
         );
         Voltage = 5000;
         Watts = 12;
     },
         {
         AdapterID = 0;
         Current = 0;
         Description = batt;
         ErrorFlags = 0;
         PMUConfiguration = "-1";
         SharedSource = 0;
         Source = 0;
         Voltage = 5000;
         Watts = 0;
     }
 )
 CurrentCapacity: 100
 PostDischargeWaitSeconds: 120
 CarrierMode: {
     CarrierModeHighVoltage = 4100;
     CarrierModeLowVoltage = 3600;
     CarrierModeStatus = 0;
 }
 TimeRemaining: 65535
 ChargerConfiguration: 2420
 IOReportLegend: (
         {
         IOReportChannelInfo =         {
             IOReportChannelUnit = 0;
         };
         IOReportChannels =         (
                         (
                 7167869599145487988,
                 6460407809,
                 BatteryCycleCount
             ),
                         (
                 7881712903662169456,
                 6460407809,
                 BatteryMaxTemp
             ),
                         (
                 7883953708359576944,
                 6460407809,
                 BatteryMinTemp
             ),
                         (
                 7881713247109672052,
                 6460407809,
                 BatteryMaxPackVoltage
             ),
                         (
                 7883954051807079540,
                 6460407809,
                 BatteryMinPackVoltage
             ),
                         (
                 7881713191223763049,
                 6460407809,
                 BatteryChargeCurrent
             ),
                  <…>
 AtCriticalLevel: 0
 BatteryCellDisconnectCount: 0
 UpdateTime: 1588460094
 Amperage: 428
 PresentDOD: 820
 AppleRawCurrentCapacity: 2343
 AbsoluteCapacity: 2406
 AvgTimeToFull: 65535
 ExternalConnected: 1
 ExternalChargeCapable: 1
 AppleRawBatteryVoltage: 4270
 BootVoltage: 4219
 BatteryData: {
     AlgoChemID = 5648;
     BatteryHealthMetric = 199;
     BatterySerialNumber = XXXXXXXXXXXXXXXXXXX;
     Cell1CurrentAccumulator = 41495;
     Cell2CurrentAccumulator = 45976;
     CellCurrentAccumulatorCount = 230;
     ChemID = 5648;
     ChemicalWeightedRa = 146;
     CurrentAccumulator = "-95923";
     CurrentAccumulatorCount = 9597;
     CurrentSenseMonitorStatus = 0;
     CycleCount = 577;
     DailyMaxSoc = 99;
     DailyMinSoc = 98;
     DesignCapacity = 2701;
     Flags = 0;
     GaugeResetCounter = 0;
     ISS = 348;
     ITMiscStatus = 10725;
     LifetimeData =     {
         AverageTemperature = 27;
         CycleCountLastQmax = 10;
         FlashWriteCount = 1334;
         HighAvgCurrentLastRun = "-941";
         LowAvgCurrentLastRun = "-39";
         MaximimChargeCurrent = 2187;
         MaximimDischargeCurrent = "-3027";
         MaximimOverChargedCapacity = 212;
         MaximimOverDischargedCapacity = "-66";
         MaximumDeltaVoltage = 128;
         MaximumFCC = 2805;
         MaximumPackVoltag<…>
 BatteryInstalled: 1
 IOReportLegendPublic: 1
 AppleRawExternalConnected: 1
 BatteryFCCData: {
     DOD0 = 8336;
     PassedCharge = "-1142";
     Qstart = 1201;
     ResScale = 0;
 }
 KioskMode: {
     KioskModeFullChargeVoltage = 0;
     KioskModeHighSocDays = 0;
     KioskModeHighSocSeconds = 0;
     KioskModeLastHighSocHours = 0;
     KioskModeMode = 0;
 }
 Serial: XXXXXXXXXXXXXXXXXXXXXX
 NominalChargeCapacity: 2380
 FullyCharged: 0
 BatteryInvalidWakeSeconds: 30
 ChargerData: {
     ChargerID = "-1";
     ChargerStatus = 663592;
     ChargingCurrent = 464;
     ChargingVoltage = 4285;
     NotChargingReason = 0;
     VacVoltageLimit = 4290;
 }
 AdapterDetails: {
     AdapterID = 0;
     Current = 2400;
     Description = "usb host";
     FamilyCode = "-536854528";
     PMUConfiguration = 2420;
     SharedSource = 0;
     Source = 0;
     UsbHvcHvcIndex = 0;
     UsbHvcMenu =     (
     );
     Voltage = 5000;
     Watts = 12;
 }
 MaxCapacity: 100
 InstantAmperage: 428
 GasGaugeFirmwareVersion: 1538
 Location: 0
 BestAdapterIndex: 0
 Temperature: 2879
 DesignCapacity: 2701
 AdapterInfo: 16384
 IsCharging: 1
 Voltage: 4270
 ManufactureDate: 7376
 UserVisiblePathUpdated: 1588460094
 CycleCount: 577
 ITMiscStatus: 10725
 AppleRawMaxCapacity: 2383
 GaugeFlagRaw: 8192
 VirtualTemperature: 2819
 AppleChargeRateLimitIndex: 0

 */
