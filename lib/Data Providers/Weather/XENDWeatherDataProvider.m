//
//  XENDWeatherDataProvider.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDWeatherDataProvider.h"

@interface XENDWeatherDataProvider ()

@property (nonatomic, strong) NSMutableArray *initialLoadListeners;
@property (nonatomic, readwrite) BOOL seenInitialData;

@end

@implementation XENDWeatherDataProvider

+ (NSString*)providerNamespace {
    return @"weather";
}

- (instancetype)init {
	self = [super init];
	
	if (self) {
		self.initialLoadListeners = [NSMutableArray array];
		self.seenInitialData = NO;
	}
	
	return self;
}

// Everything is proxied for this provider

- (BOOL)hasInitialData {
	return ![[self cachedData] isEqualToDictionary:@{}];
}

- (void)registerListenerForInitialData:(void (^)(NSDictionary *cachedData))listener {
	[self.initialLoadListeners addObject:[listener copy]];
}

- (void)notifyWidgetManagerForNewProperties {
    // Call with cachedData contents
    NSString *providerNamespace = [[self class] providerNamespace];
    [self.delegate updateWidgetsWithNewData:[self cachedData] forNamespace:providerNamespace];
	
	if (!self.seenInitialData) {
		self.seenInitialData = YES;
		
		// Notify any listeners
		for (void (^block)(NSDictionary *listener) in self.initialLoadListeners) {
			block([self cachedData]);
		}
		
		// And clear them
		[self.initialLoadListeners removeAllObjects];
	}
}

@end
