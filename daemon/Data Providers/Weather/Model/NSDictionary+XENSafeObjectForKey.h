//
//  NSDictionary+XENSafeObjectForKey.h
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import <Foundation/Foundation.h>

@interface NSDictionary (XENSafeObjectForKey)

- (id)objectForKey:(NSString*)key defaultValue:(id)value;

@end
