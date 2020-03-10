//
//  XENDProxyManager.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 21/09/2019.
//

#import "XENDProxyManager.h"
#import "XENDProxyIPCConnection.h"
#import "XENDProxySimulatedConnection.h"

@interface XENDProxyManager ()
@property (nonatomic, strong) XENDProxyBaseConnection *_underlyingConnection;
@end

@implementation XENDProxyManager

+ (instancetype)sharedInstance {
    static XENDProxyManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDProxyManager alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init {
    self = [super init];
    
    if (self) {
        // Setup connection
        
#if TARGET_OS_SIMULATOR
        self._underlyingConnection = [[XENDProxySimulatedConnection alloc] init];
#else
        self._underlyingConnection = [[XENDProxyIPCConnection alloc] init];
#endif
        
        [self._underlyingConnection initialise];
    }
    
    return self;
}

- (XENDProxyBaseConnection*)connection {
    return self._underlyingConnection;
}

@end
