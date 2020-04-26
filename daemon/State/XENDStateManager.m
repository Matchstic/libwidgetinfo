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

#import "XENDStateManager.h"
#import "Reachability.h"
#import <notify.h>

@interface XENDStateManager ()

@property (nonatomic, weak) id<XENDStateManagerDelegate> delegate;

@property (nonatomic, readwrite) BOOL lastObservedSleepState;
@property (nonatomic, readwrite) BOOL lastObservedNetworkState;

@property (nonatomic, strong) Reachability *reachability;
@property (nonatomic, strong) NSTimer *internalReliabilityTimer;

@property (nonatomic, strong) NSTimer *hourlyTimer;

@end

@implementation XENDStateManager

- (instancetype)initWithDelegate:(id<XENDStateManagerDelegate>)delegate {
    self = [super init];
    
    if (self) {
        self.delegate = delegate;
        self.lastObservedSleepState = NO;
        self.lastObservedNetworkState = YES;
        
        // Setup network monitoring
        self.reachability = [Reachability reachabilityForInternetConnection];
        
        XENDStateManager * __weak weakSelf = self;
        self.reachability.reachableBlock = ^(Reachability *reachability) {
            weakSelf.lastObservedNetworkState = YES;
            [weakSelf.delegate networkWasConnected];
            
            NSLog(@"Network connected");
        };
        self.reachability.unreachableBlock = ^(Reachability *reachability) {
            weakSelf.lastObservedNetworkState = NO;
            [weakSelf.delegate networkWasDisconnected];
            
            NSLog(@"Network disconnected");
            
            // Start reliability timer.
            // This is in place due to an assumption that Reachability sometimes
            // fails to call us here.
            // Ensure this is on the main thread for runloop purposes
            dispatch_async(dispatch_get_main_queue(), ^{
                if (!weakSelf.internalReliabilityTimer)
                    weakSelf.internalReliabilityTimer = [NSTimer scheduledTimerWithTimeInterval:120
                                                                                 target:weakSelf
                                                                               selector:@selector(_reliabilityTimerFired:)
                                                                               userInfo:nil
                                                                                repeats:YES];
            });
        };
        
        // Start the notifier, which will cause the reachability object to retain itself!
        [self.reachability startNotifier];
        
        // Setup sleep state monitoring
        static int backboardBacklightChangedToken;
        notify_register_dispatch("com.apple.backboardd.backlight.changed", &backboardBacklightChangedToken, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0l), ^(int token) {
            
            uint64_t state = UINT64_MAX;
            notify_get_state(backboardBacklightChangedToken, &state);
            
            [weakSelf _backlightChanged:(int)state];
        });
        
        // Monitor day changes
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_significantTimeChange:) name:NSCalendarDayChangedNotification object:nil];
        
        // Monitor hour changes
        [self restartHourlyTimer];
    }
    
    return self;
}

- (void)restartHourlyTimer {
    if (self.hourlyTimer) {
        [self.hourlyTimer invalidate];
        self.hourlyTimer = nil;
    }
    NSDateComponents *now = [[NSCalendar currentCalendar] components:NSCalendarUnitSecond | NSCalendarUnitMinute fromDate:[NSDate date]];
    
    NSInteger nextHour = 3600 - now.second - (now.minute * 60);
    
    self.hourlyTimer = [NSTimer scheduledTimerWithTimeInterval:nextHour target:self selector:@selector(_hourlyTimerFired:) userInfo:nil repeats:NO];
}

- (void)_hourlyTimerFired:(NSTimer*)timer {
    [self.hourlyTimer invalidate];
    self.hourlyTimer = nil;
    
    [self.delegate noteHourChange];
    
    [self restartHourlyTimer];
}

- (void)_reliabilityTimerFired:(NSTimer*)sender {
    BOOL isReachable = [self.reachability isReachable];
    
    if (isReachable != self.lastObservedNetworkState) {
        // Cancel the reliability timer
        [self.internalReliabilityTimer invalidate];
        self.internalReliabilityTimer = nil;
        
        // Update status
        self.lastObservedNetworkState = isReachable;
        if (isReachable) [self.delegate networkWasConnected];
        else             [self.delegate networkWasDisconnected];
    }
}

- (void)_backlightChanged:(int)state {
    self.lastObservedSleepState = state == 0;
    
    if (self.lastObservedSleepState == YES) {
        [self.delegate noteDeviceDidEnterSleep];
        NSLog(@"Display turned off");
    } else {
        [self.delegate noteDeviceDidExitSleep];
        NSLog(@"Display turned on");
    }
}

- (void)_significantTimeChange:(NSTimer*)sender {    
    [self.delegate noteSignificantTimeChange];
}

- (NSDictionary*)summariseState {
    return @{
        @"sleep": [NSNumber numberWithBool:self.lastObservedSleepState],
        @"network": [NSNumber numberWithBool:self.lastObservedNetworkState]
    };
}

@end
