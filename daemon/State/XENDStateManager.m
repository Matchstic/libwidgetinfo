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
            [weakSelf.delegate networkWasConnected];
            weakSelf.lastObservedNetworkState = YES;
            
            NSLog(@"Network connected");
        };
        self.reachability.unreachableBlock = ^(Reachability *reachability) {
            [weakSelf.delegate networkWasDisconnected];
            weakSelf.lastObservedNetworkState = NO;
            
            NSLog(@"Network disconnected");
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
    }
    
    return self;
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

- (NSDictionary*)summariseState {
    return @{
        @"sleep": [NSNumber numberWithBool:self.lastObservedSleepState],
        @"network": [NSNumber numberWithBool:self.lastObservedNetworkState]
    };
}

@end
