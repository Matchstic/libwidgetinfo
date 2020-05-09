//
//  XENDApplicationsManager.h
//  Daemon
//
//  Created by Matt Clarke on 09/05/2020.
//

#import <Foundation/Foundation.h>

@interface XENDApplicationsManager : NSObject

/**
 * Provides a shared instance of the applications manager, creating if necessary
 */
+ (instancetype)sharedInstance;

/**
 Generates metadata for the specified application
 */
- (NSDictionary*)metadataForApplication:(NSString*)bundleIdentifier;

/**
 Loads icon data for the specified application
 */
- (NSData*)iconForApplication:(NSString*)bundleIdentifier;

@end
