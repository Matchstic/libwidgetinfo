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

#import "XENDFilesystemProvider.h"
#import "XENDLogger.h"

#define MISSING         @-3
#define BAD_REQUEST     @-2
#define UNAUTHORIZED    @-1
#define OK              @0

@implementation XENDFilesystemProvider

// The data topic provided by the data provider
+ (NSString*)providerNamespace {
    return @"fs";
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    @try {
        if ([definition isEqualToString:@"list"]) {
            callback([self filesInDirectory:data]);
        } else if ([definition isEqualToString:@"read"]) {
            callback([self read:data]);
        } else if ([definition isEqualToString:@"write"]) {
            callback([self write:data]);
        } else if ([definition isEqualToString:@"delete"]) {
            callback([self delete:data]);
        } else if ([definition isEqualToString:@"mkdir"]) {
            callback([self makeDirectory:data]);
        } else if ([definition isEqualToString:@"metadata"]) {
            callback([self metadata:data]);
        } else if ([definition isEqualToString:@"exists"]) {
            callback([self exists:data]);
        } else {
            callback(@{});
        }
    } @catch (NSException *e) {
        XENDLog(@"%@", e);
        callback(@{
            @"error": BAD_REQUEST
        });
    }
}

- (BOOL)allowedAccess:(NSString*)path {
#if TARGET_IPHONE_SIMULATOR
    return YES;
#else
    return [path hasPrefix:@"/var/mobile/"];
#endif
}

- (BOOL)privileged {
#if TARGET_IPHONE_SIMULATOR
    return YES;
#else
    return [[[NSBundle mainBundle] bundleIdentifier] isEqualToString:@"com.apple.springboard"];
#endif
}

/*
 * Return format:
 *
 * { results: NSArray<NSString*>, error: -1 | -2 | x }
 */
- (NSDictionary*)filesInDirectory:(NSDictionary*)data {
    if (!data || ![data objectForKey:@"path"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSString *path = [data objectForKey:@"path"];
    
    if (![self allowedAccess:path]) {
        return @{
            @"error": UNAUTHORIZED
        };
    }
    
    NSFileManager *manager = [NSFileManager defaultManager];
    if (![manager fileExistsAtPath:path]) {
        return @{
            @"error": MISSING
        };
    }
    
    NSError *error;
    
    NSArray *results = [manager contentsOfDirectoryAtPath:path
                                                    error:&error];
    if (error) {
        return @{
            @"error": [NSNumber numberWithInt:[error code]]
        };
    } else {
        return @{
            @"results": results,
            @"error": OK
        };
    }
}

/*
 * Reads a file from disk
 * { result: NSString | NSDictionary, error: -1 | -2 | -3 | x }
 */
- (NSDictionary*)read:(NSDictionary*)data {
    if (!data || ![data objectForKey:@"path"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSString *path = [data objectForKey:@"path"];
    NSString *type = [data objectForKey:@"mimetype"];
    
    if (![self allowedAccess:path]) {
        return @{
            @"error": UNAUTHORIZED
        };
    }
    
    NSFileManager *manager = [NSFileManager defaultManager];
    if (![manager fileExistsAtPath:path]) {
        return @{
            @"error": MISSING
        };
    }
    
    id content = nil;
    
    if (!type || [type isEqualToString:@"text"]) {
        content = [NSString stringWithContentsOfFile:path
                                         encoding:NSUTF8StringEncoding
                                            error:NULL];
        
        if ([path hasSuffix:@".json"]) {
            // Convert automatically
            NSData *data = [content dataUsingEncoding:NSUTF8StringEncoding];

            NSError *error;
            NSDictionary *jsonDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
            
            if (!error) {
                content = jsonDict;
            }
        }
    } else if ([type isEqualToString:@"plist"]) {
        content = [NSDictionary dictionaryWithContentsOfFile:path];
    } else {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    return @{
        @"result": content,
        @"error": OK
    };
}

/*
 * Write data to path
 */
- (NSDictionary*)write:(NSDictionary*)data {
    if (!data ||
        ![data objectForKey:@"path"] ||
        ![data objectForKey:@"content"] ||
        ![data objectForKey:@"mimetype"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    id content = [data objectForKey:@"content"];
    NSString *path = [data objectForKey:@"path"];
    NSString *type = [data objectForKey:@"mimetype"];
    
    if (![self allowedAccess:path] || ![self privileged]) {
        return @{
            @"error": UNAUTHORIZED
        };
    }
    
    NSError *error;
    BOOL success = YES;
    if ([@"text" isEqualToString:type]) {
        if ([content isKindOfClass:[NSDictionary class]]) {
            // Convert to JSON and write that instead
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:content
                                                               options:NSJSONWritingPrettyPrinted
                                                                 error:&error];
            
            success = !error ? [jsonData writeToFile:path atomically:YES] : NO;
        } else if ([content isKindOfClass:[NSString class]]) {
            success = [content writeToFile:path atomically:YES encoding:NSUTF8StringEncoding error:&error];
        } else {
            success = NO;
        }
    } else if ([@"plist" isEqualToString:type]) {
        if ([content isKindOfClass:[NSDictionary class]]) {
            success = [content writeToFile:path atomically:YES];
        } else if ([content isKindOfClass:[NSString class]]) {
            success = [content writeToFile:path atomically:YES encoding:NSUTF8StringEncoding error:&error];
        } else {
            success = NO;
        }
    } else {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    if (!success) {
        return @{
            @"error": error ? [NSNumber numberWithInt:[error code]] : BAD_REQUEST
        };
    } else {
        return @{
            @"error": OK
        };
    }
}

/*
 * Delete file or directory at path
 */
- (NSDictionary*)delete:(NSDictionary*)data {
    if (!data ||
        ![data objectForKey:@"path"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSString *path = [data objectForKey:@"path"];
    
    if (![self allowedAccess:path] || ![self privileged]) {
        return @{
            @"error": UNAUTHORIZED
        };
    }
    
    NSError *error;
    [[NSFileManager defaultManager] removeItemAtPath:path error:&error];
    
    if (error) {
        return @{
            @"error": [NSNumber numberWithInt:[error code]]
        };
    } else {
        return @{
            @"error": OK
        };
    }
}

- (NSDictionary*)exists:(NSDictionary*)data {
    if (!data || ![data objectForKey:@"path"]) {
        return @{
            @"result": @0,
            @"error": BAD_REQUEST
        };
    }
    
    NSString *path = [data objectForKey:@"path"];
    
    return @{
        @"result": @([[NSFileManager defaultManager] fileExistsAtPath:path])
    };
}

/*
 * Create directory at the given path
 */
- (NSDictionary*)makeDirectory:(NSDictionary*)data {
    if (!data || ![data objectForKey:@"path"]) {
        return @{
            @"result": @0,
            @"error": BAD_REQUEST
        };
    }
    
    NSString *path = [data objectForKey:@"path"];
    NSNumber *intermediates = [data objectForKey:@"createIntermediate"];
    
    if (![self allowedAccess:path] || ![self privileged]) {
        return @{
            @"error": UNAUTHORIZED
        };
    }
    
    NSFileManager *manager = [NSFileManager defaultManager];
    NSError *error;
    
    [manager createDirectoryAtPath:path withIntermediateDirectories:[intermediates boolValue] attributes:nil error:&error];
    
    if (error) {
        return @{
            @"error": [NSNumber numberWithInt:[error code]]
        };
    } else {
        return @{
            @"error": OK
        };
    }
}

- (NSDictionary*)metadata:(NSDictionary*)data {
    if (!data || ![data objectForKey:@"path"]) {
        return @{
            @"result": @0,
            @"error": BAD_REQUEST
        };
    }
    
    // This is allowed for any file or folder, since its less of a security concern
    NSString *path = [data objectForKey:@"path"];
    
    BOOL isDirectory = NO;
    if (![[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDirectory]) {
        return @{
            @"error": MISSING
        };
    }
    
    NSError *error;
    NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:path error:&error];
    
    if (error || !attributes) {
        return @{
            @"error": error ? [NSNumber numberWithInt:[error code]] : BAD_REQUEST
        };
    }
    
    return @{
        @"result": @{
            @"isDirectory": @(isDirectory),
            @"type": [attributes fileType],
            @"created": @([[attributes fileCreationDate] timeIntervalSince1970] * 1000),
            @"modified": @([[attributes fileModificationDate] timeIntervalSince1970] * 1000),
            @"size": @([attributes fileSize]),
            @"permissions": @([attributes filePosixPermissions]),
            @"owner": [self safetyFirst:[attributes fileOwnerAccountName] defaultValue:@"mobile"],
            @"group": [self safetyFirst:[attributes fileGroupOwnerAccountName] defaultValue:@""],
        }
    };
}

- (NSString*)safetyFirst:(id)arg1 defaultValue:(NSString*)arg2 {
    return arg1 ? arg1 : arg2;
}

@end
