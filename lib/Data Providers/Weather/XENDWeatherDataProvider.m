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
    [super notifyWidgetManagerForNewProperties];
	
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
