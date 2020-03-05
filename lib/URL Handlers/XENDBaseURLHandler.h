//
//  XENDBaseURLHandler.h
//  libwidgetinfo
//
//  Created by Matt Clarke on 05/03/2020.
//

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
