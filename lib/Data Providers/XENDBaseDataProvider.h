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

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import "../Internal/XENDWidgetManager-Protocol.h"

@interface XENDBaseDataProvider : NSObject

// Delegate is stored to communicate data back to widgets
@property (nonatomic, weak) id<XENDWidgetManagerDelegate> delegate;

@property (nonatomic, strong) NSDictionary *cachedStaticProperties;
@property (nonatomic, strong) NSMutableDictionary *cachedDynamicProperties;

/**
 * Called to initialise the data provider. Useful for subclasses
 */
- (void)intialiseProvider;

/**
 * The data namespace provided by the data provider
 */
+ (NSString*)providerNamespace;

/**
 * Called when the device enters sleep mode
 */
- (void)noteDeviceDidEnterSleep;

/**
 * Called when the device leaves sleep mode
 */
- (void)noteDeviceDidExitSleep;

/**
 * Register a delegate object to call upon when new data becomes available.
 * @param delegate The delegate to register
 */
- (void)registerDelegate:(id<XENDWidgetManagerDelegate>)delegate;

/**
 * Called when a new widget is added, and it needs to be provided new data on load.
 * @return Cached data for the provider
 */
- (NSDictionary*)cachedData;

/**
 * Called when a widget message has been received for this provider
 * The callback MUST always be called into
 * @param data The data of the message received
 * @param definition The function definition that this message should be routed to
 * @param callback The callback to be notified when then the message has been handled
 */
- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback;

/**
 * Called when network access is lost
 */
- (void)networkWasDisconnected;

/**
 * Called when network access is restored
 */
- (void)networkWasConnected;

/**
* Called when a significant time change occurs.
* See: https://developer.apple.com/documentation/uikit/uiapplicationsignificanttimechangenotification
*/
- (void)noteSignificantTimeChange;

/**
 * URL escapes the provided input
 */
- (NSString*)escapeString:(NSString*)input;

/**
 Converts a colour ref into a hex string
 */
- (NSString *)hexStringFromColor:(CGColorRef)color;

/**
 * Notifies the widget manager of updated data
 */
- (void)notifyWidgetManagerForNewProperties;

@end
