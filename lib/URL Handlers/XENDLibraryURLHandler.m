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

#import "XENDLibraryURLHandler.h"
#import "XENDLogger.h"

#import "../Internal/XENDWidgetManager-Internal.h"
#import "../Data Providers/Applications/XENDApplicationsDataProvider.h"
#import "../Data Providers/Media/XENDMediaDataProvider.h"

#if TARGET_IPHONE_SIMULATOR==0
static NSString *libraryResourceBasePath = @"/Library/Application Support/Widgets/Resource Packs";
#else
static NSString *libraryResourceBasePath = @"/opt/simject/Library/Application Support/Widgets/Resource Packs";
#endif

@implementation XENDLibraryURLHandler

+ (BOOL)canHandleURL:(NSURL*)url {
    return [[url scheme] isEqualToString:@"xui"];
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    
    // We handle the following here:
    // - Resource packs
    // - Forwarding internal images, such as media artwork and app icons
    
    NSString *host = [url host];
    
    if ([host isEqualToString:@"resource"]) {
        NSString *mimetype = nil;
        NSData *data = [self loadLibraryFileAtPath:[url path] mimetype:&mimetype];
        completionHandler(nil, data, mimetype);
    } else if ([host isEqualToString:@"application"]) {
        [self loadIconDataAtPath:[url path] callback:^(NSData *result) {
            completionHandler(nil, result, @"image/png");
        }];
    } else if ([host isEqualToString:@"media"]) {
        [self loadMediaArtworkAtPath:[url path] callback:^(NSData *result) {
            completionHandler(nil, result, @"image/jpeg");
        }];
    } else {
        completionHandler(nil, nil, nil);
    }
}

- (NSData*)loadLibraryFileAtPath:(NSString*)path mimetype:(NSString**)mimetype {
    
    NSString *filepath = [NSString stringWithFormat:@"%@%@", libraryResourceBasePath, path];
    
    *mimetype = [self assumedMIMEForFilepath:path];
    
    if ([[NSFileManager defaultManager] fileExistsAtPath:filepath])
        return [NSData dataWithContentsOfFile:filepath];
    else {
        // Redirect to the default folder if the file cannot be found
        NSArray *pathComponents = [path pathComponents];
        int startPosition = [path hasPrefix:@"/"] ? 2 : 1; // skip name
        
        NSString *redirectedFilepath = [NSString stringWithFormat:@"%@/default/", libraryResourceBasePath];
        for (int i = startPosition; i < pathComponents.count; i++) {
            NSString *suffix = i == pathComponents.count - 1 ? @"" : @"/";
            redirectedFilepath = [redirectedFilepath stringByAppendingFormat:@"%@%@", pathComponents[i], suffix];
        }
        
        return [NSData dataWithContentsOfFile:redirectedFilepath];
    }
}

- (NSString*)assumedMIMEForFilepath:(NSString*)filepath {
    NSString *extension = [[filepath pathExtension] lowercaseString];
    
    // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#Image_types
    if ([extension isEqualToString:@"svg"]) {
        return @"image/svg+xml";
    } else if ([extension isEqualToString:@"png"]) {
        return @"image/png";
    } else if ([extension isEqualToString:@"jpg"] ||
               [extension isEqualToString:@"jpeg"] ||
               [extension isEqualToString:@"jfif"] ||
               [extension isEqualToString:@"pjpeg"] ||
               [extension isEqualToString:@"pjp"]) {
        return @"image/jpeg";
    } else if ([extension isEqualToString:@"webp"]) {
        return @"image/webp";
    } else if ([extension isEqualToString:@"apng"]) {
        return @"image/apng";
    } else if ([extension isEqualToString:@"bmp"]) {
        return @"image/bmp";
    } else if ([extension isEqualToString:@"gif"]) {
        return @"image/gif";
    } else if ([extension isEqualToString:@"ico"] ||
               [extension isEqualToString:@"cur"]) {
        return @"image/x-icon";
    }
    
    return @"application/octet-stream";
}

- (void)loadIconDataAtPath:(NSString*)path callback:(void (^)(NSData *result))callback {
    XENDApplicationsDataProvider *apps = (XENDApplicationsDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"applications"];
    
    NSString *bundleIdentifier = [path lastPathComponent];
    [apps requestIconDataForBundleIdentifier:bundleIdentifier callback:^(NSDictionary *result) {
        NSData *data = [result objectForKey:@"data"];
        if ([data isKindOfClass:[NSNull class]]) data = nil;
        callback(data);
    }];
}

- (void)loadMediaArtworkAtPath:(NSString*)path callback:(void (^)(NSData *result))callback {
    XENDMediaDataProvider *media = (XENDMediaDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"media"];
    
    NSString *artworkIdentifier = [path lastPathComponent];
    [media requestArtworkForIdentifier:artworkIdentifier callback:^(NSDictionary *result) {
        NSData *data = [result objectForKey:@"data"];
        if ([data isKindOfClass:[NSNull class]]) data = nil;
        callback(data);
    }];
}

@end
