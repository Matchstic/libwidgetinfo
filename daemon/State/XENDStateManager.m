//
//  XENDStateManager.m
//  Daemon
//
//  Created by Matt Clarke on 25/01/2020.
//

#import "XENDStateManager.h"
#import "Reachability.h"
#import <notify.h>

@interface XENDStateManager ()

@property (nonatomic, weak) id<XENDStateManagerDelegate> delegate;

@property (nonatomic, readwrite) BOOL lastObservedSleepState;
@property (nonatomic, readwrite) BOOL lastObservedNetworkState;

@property (nonatomic, strong) Reachability *reachability;
@property (nonatomic, strong) NSTimer *internalReliabilityTimer;

@property (nonatomic, strong) NSTimer *midnightTimer;

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
        
        [self restartMidnightTimer];
    }
    
    return self;
}

- (void)restartMidnightTimer {
    if (self.midnightTimer) {
        [self.midnightTimer invalidate];
        self.midnightTimer = nil;
    }
    
    // Calculate time until midnight
    NSDateComponents *nowComponents = [[NSCalendar currentCalendar] components:NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond fromDate:[NSDate date]];
    
    int remainingSeconds = 0;
    // Hour
    remainingSeconds += (24 - [nowComponents hour] - 1) * 60 * 60;
    remainingSeconds += (60 - [nowComponents minute] - 1) * 60;
    remainingSeconds += 60 - [nowComponents second];
    
    self.midnightTimer = [NSTimer scheduledTimerWithTimeInterval:remainingSeconds target:self selector:@selector(_significantTimeChange:) userInfo:nil repeats:NO];
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
    [self restartMidnightTimer];
    
    [self.delegate noteSignificantTimeChange];
}

- (NSDictionary*)summariseState {
    return @{
        @"sleep": [NSNumber numberWithBool:self.lastObservedSleepState],
        @"network": [NSNumber numberWithBool:self.lastObservedNetworkState]
    };
}

@end
