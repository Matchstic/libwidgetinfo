//
//  XENDSystemDataProvider.m
//  libwidgetdata
//
//  Created by Matt Clarke on 16/09/2019.
//

#import "XENDSystemDataProvider.h"
#import <UIKit/UIKit.h>

#import <sys/utsname.h> //device models

@implementation XENDSystemDataProvider

// The data topic provided by the data provider
+ (NSString*)providerNamespace {
    return @"system";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    
    if ([definition isEqualToString:@"log"]) {
        callback([self handleLogMessage:data]);
    }
    
}

- (void)networkWasDisconnected {
    [self.cachedDynamicProperties setObject:@NO forKey:@"isNetworkConnected"];
    [self notifyWidgetManagerForNewProperties];
}

- (void)networkWasConnected {
    [self.cachedDynamicProperties setObject:@YES forKey:@"isNetworkConnected"];
    [self notifyWidgetManagerForNewProperties];
}

#pragma mark Message handlers

- (NSDictionary*)handleLogMessage:(NSDictionary*)data {
    if (!data || ![data objectForKey:@"message"]) {
        NSLog(@"libwidgetinfo :: Malformed log message, ignoring");
        return @{};
    }
    
    NSLog(@"%@", [data objectForKey:@"message"]);
    
    return @{};
}

#pragma mark Private initialisation

- (void)intialiseProvider {
    [self _setupStaticProperties];
    [self _setupDynamicProperties];
    
    // Start monitoring for dynamics
    
    // Locale changed
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_localeChanged:) name:NSSystemClockDidChangeNotification object:nil];
    
    // Low power mode
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_powerInfoChanged:) name:NSProcessInfoPowerStateDidChangeNotification object:nil];
}

- (void)_setupStaticProperties {
    NSMutableDictionary *statics = [NSMutableDictionary dictionary];
    
    [statics setObject:[self _deviceName] forKey:@"deviceName"];
    [statics setObject:[self _deviceType] forKey:@"deviceType"];
    [statics setObject:[self _machineName] forKey:@"deviceModel"];
    [statics setObject:[self _deviceModel] forKey:@"deviceModelPromotional"];
    [statics setObject:[self _systemVersion] forKey:@"systemVersion"];
    
    [statics setObject:[NSNumber numberWithFloat:[self _screenMaxLength]] forKey:@"deviceDisplayHeight"];
    [statics setObject:[NSNumber numberWithFloat:[self _screenMinLength]] forKey:@"deviceDisplayWidth"];
    
    self.cachedStaticProperties = statics;
}

- (void)_setupDynamicProperties {
    NSMutableDictionary *dynamics = [NSMutableDictionary dictionary];
    
    [dynamics setObject:@([self _using24h]) forKey:@"isTwentyFourHourTimeEnabled"];
    [dynamics setObject:@([self _isLowPowerModeEnabled]) forKey:@"isLowPowerModeEnabled"];
    [dynamics setObject:@YES forKey:@"isNetworkConnected"];
    
    self.cachedDynamicProperties = dynamics;
}

- (void)_localeChanged:(NSNotification*)notification {
    BOOL current24hr = [self.cachedDynamicProperties objectForKey:@"isTwentyFourHourTimeEnabled"];
    BOOL new24hr = [self _using24h];
    
    if (current24hr != new24hr) {
        [self.cachedDynamicProperties setObject:@(new24hr) forKey:@"isNetworkConnected"];
        [self notifyWidgetManagerForNewProperties];
    }
}

- (void)_powerInfoChanged:(NSNotification*)notification {
    BOOL currentLowPowerMode = [self.cachedDynamicProperties objectForKey:@"isLowPowerModeEnabled"];
    BOOL newLowPowerMode = [self _using24h];
    
    if (currentLowPowerMode != newLowPowerMode) {
        [self.cachedDynamicProperties setObject:@(newLowPowerMode) forKey:@"isLowPowerModeEnabled"];
        [self notifyWidgetManagerForNewProperties];
    }
}

- (NSString*)_machineName {
    struct utsname systemInfo;
    uname(&systemInfo);
    return [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
}

// From: http://theiphonewiki.com/wiki/Models
- (NSString*)_deviceModel {
    NSString *machineName = [self _machineName];
    
    NSDictionary *commonNamesDictionary =
    @{
      @"i386":     @"i386 Simulator",
      @"x86_64":   @"x86_64 Simulator",
      
      @"iPhone1,1":    @"iPhone",
      @"iPhone1,2":    @"iPhone 3G",
      @"iPhone2,1":    @"iPhone 3GS",
      @"iPhone3,1":    @"iPhone 4",
      @"iPhone3,2":    @"iPhone 4",
      @"iPhone3,3":    @"iPhone 4",
      @"iPhone4,1":    @"iPhone 4S",
      @"iPhone5,1":    @"iPhone 5",
      @"iPhone5,2":    @"iPhone 5",
      @"iPhone5,3":    @"iPhone 5c",
      @"iPhone5,4":    @"iPhone 5c",
      @"iPhone6,1":    @"iPhone 5s",
      @"iPhone6,2":    @"iPhone 5s",
      @"iPhone7,1":    @"iPhone 6+",
      @"iPhone7,2":    @"iPhone 6",
      @"iPhone8,1":    @"iPhone 6S",
      @"iPhone8,2":    @"iPhone 6S+",
      @"iPhone8,4":    @"iPhone SE",
      @"iPhone9,1":    @"iPhone 7",
      @"iPhone9,2":    @"iPhone 7+",
      @"iPhone9,3":    @"iPhone 7",
      @"iPhone9,4":    @"iPhone 7+",
      @"iPhone10,1":   @"iPhone 8",
      @"iPhone10,4":   @"iPhone 8",
      @"iPhone10,2":   @"iPhone 8+",
      @"iPhone10,5":   @"iPhone 8+",
      @"iPhone10,3":   @"iPhone X",
      @"iPhone10,6":   @"iPhone X",
      @"iPhone11,2":   @"iPhone XS",
      @"iPhone11,4":   @"iPhone XS Max",
      @"iPhone11,6":   @"iPhone XS Max",
      @"iPhone11,8":   @"iPhone XR",
      @"iPhone12,1":   @"iPhone 11",
      @"iPhone12,3":   @"iPhone 11 Pro",
      @"iPhone12,5":   @"iPhone 11 Pro Max",
      
      @"iPad1,1":  @"iPad",
      @"iPad2,1":  @"iPad 2",
      @"iPad2,2":  @"iPad 2",
      @"iPad2,3":  @"iPad 2",
      @"iPad2,4":  @"iPad 2",
      @"iPad3,1":  @"iPad 3",
      @"iPad3,2":  @"iPad 3",
      @"iPad3,3":  @"iPad 3",
      @"iPad3,4":  @"iPad 4",
      @"iPad3,5":  @"iPad 4",
      @"iPad3,6":  @"iPad 4",
      @"iPad4,1":  @"iPad Air",
      @"iPad4,2":  @"iPad Air",
      @"iPad4,3":  @"iPad Air",
      @"iPad5,3":  @"iPad Air 2",
      @"iPad5,4":  @"iPad Air 2",
      @"iPad6,3":  @"iPad Pro 9.7\"",
      @"iPad6,4":  @"iPad Pro 9.7\"",
      @"iPad6,7":  @"iPad Pro 12.9\"",
      @"iPad6,8":  @"iPad Pro 12.9\"",
      @"iPad6,11": @"iPad 5",
      @"iPad6,12": @"iPad 5",
      @"iPad7,1":  @"iPad Pro 12.9\" (2nd Gen)",
      @"iPad7,2":  @"iPad Pro 12.9\" (2nd Gen)",
      @"iPad7,3":  @"iPad Pro 10.5\"",
      @"iPad7,4":  @"iPad Pro 10.5\"",
      
      @"iPad2,5":  @"iPad mini",
      @"iPad2,6":  @"iPad mini",
      @"iPad2,7":  @"iPad mini",
      @"iPad4,4":  @"iPad mini 2",
      @"iPad4,5":  @"iPad mini 2",
      @"iPad4,6":  @"iPad mini 2",
      @"iPad4,7":  @"iPad mini 3",
      @"iPad4,8":  @"iPad mini 3",
      @"iPad4,9":  @"iPad mini 3",
      @"iPad5,1":  @"iPad mini 4",
      @"iPad5,2":  @"iPad mini 4",
      
      @"iPod1,1":  @"iPod 1st Gen",
      @"iPod2,1":  @"iPod 2nd Gen",
      @"iPod3,1":  @"iPod 3rd Gen",
      @"iPod4,1":  @"iPod 4th Gen",
      @"iPod5,1":  @"iPod 5th Gen",
      @"iPod7,1":  @"iPod 6th Gen",
    };
    
    NSString *deviceName = commonNamesDictionary[machineName];
    
    if (deviceName == nil) {
        deviceName = machineName;
    }
    
    return deviceName;
}

- (NSString*)_deviceType {
    NSString *machineName = [self _machineName];
    
    if ([machineName rangeOfString:@"iPod"].location != NSNotFound) {
        return @"iPod Touch";
    } else if ([machineName rangeOfString:@"iPad"].location != NSNotFound) {
        return @"iPad";
    } else if ([machineName rangeOfString:@"iPhone"].location != NSNotFound){
        return @"iPhone";
    } else if ([machineName rangeOfString:@"x86_64"].location != NSNotFound){
        return @"Simulator";
    } else {
        return @"Unknown";
    }
}

- (NSString*)_systemVersion {
    NSString *version = [UIDevice currentDevice].systemVersion;
    return version ? version : @"";
}

- (NSString*)_deviceName {
    return [self escapeString:[[UIDevice currentDevice] name]];
}

- (BOOL)_using24h {
    NSString *formatStringForHours = [NSDateFormatter dateFormatFromTemplate:@"j" options:0 locale:[NSLocale currentLocale]];
    NSRange containsA = [formatStringForHours rangeOfString:@"a"];
    
    return containsA.location == NSNotFound;
}

- (BOOL)_isLowPowerModeEnabled {
    return [[NSProcessInfo processInfo] isLowPowerModeEnabled];
}

- (CGFloat)_screenMaxLength {
    return MAX([UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
}

- (CGFloat)_screenMinLength {
    return MIN([UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
}

@end
