//
//  XENDStateManager.h
//  Daemon
//
//  Created by Matt Clarke on 25/01/2020.
//

#import <Foundation/Foundation.h>

@protocol XENDStateManagerDelegate <NSObject>

- (void)noteDeviceDidEnterSleep;
- (void)noteDeviceDidExitSleep;
- (void)networkWasConnected;
- (void)networkWasDisconnected;
- (void)noteSignificantTimeChange;

@end

/**
 Keeps track of device states, and provides that back to the delegate on change
 */
@interface XENDStateManager : NSObject

- (instancetype)initWithDelegate:(id<XENDStateManagerDelegate>)delegate;

/**
 Summarises internal device state in a dictionary for clients to process on initial connection
 */
- (NSDictionary*)summariseState;

@end
