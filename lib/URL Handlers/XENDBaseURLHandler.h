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

@interface XENDBaseURLHandler : NSURLProtocol

/**
 * Asks the URL handler whether it can handle the specified URL
 *
 * If two URL handlers respond with YES, the first will be used
 */
+ (BOOL)canHandleURL:(NSURL*)url;

/**
 * Asks the URL handler to load data for the specified URL, if the result of -canHandleURL: was true
 */
- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler;

@end
