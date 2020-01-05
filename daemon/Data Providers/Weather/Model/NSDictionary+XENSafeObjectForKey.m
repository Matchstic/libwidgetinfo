//
//  NSDictionary+XENSafeObjectForKey.m
//  Daemon
//
//  Created by Matt Clarke on 04/01/2020.
//

#import "NSDictionary+XENSafeObjectForKey.h"

@implementation NSDictionary (XENSafeObjectForKey)

- (id)objectForKey:(NSString*)key defaultValue:(id)value {
    id result = [self objectForKey:key];
    
    return result != nil && ![[result class] isEqual:[NSNull class]] ? result : value;
}

@end
