//
//  XENDSimulatedDaemonListener.m
//  Daemon
//
//  Created by Matt Clarke on 17/09/2019.
//

#import "XENDSimulatedDaemonListener.h"

@interface XENDSimulatedDaemonListener ()
@property (nonatomic, weak) id<XENDOriginDaemonConnection> delegate;
@end

@implementation XENDSimulatedDaemonListener

- (instancetype)initWithDelegate:(id<XENDOriginDaemonConnection>)delegate {
    self = [super init];
    
    if (self) {
        self.delegate = delegate;
    }
    
    return self;
}

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties forNamespace:(NSString*)dataProviderNamespace {
    // Forward update back - only will ever have one delegate in simulated mode due to it
    // all running in the same process
    [self.delegate notifyUpdatedDynamicProperties:dynamicProperties forNamespace:dataProviderNamespace];
}

@end
