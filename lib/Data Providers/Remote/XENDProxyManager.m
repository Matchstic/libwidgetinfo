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
