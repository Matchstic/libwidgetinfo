//
//  XENDLibraryFileHandler.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 11/04/2020.
//

#import "XENDLibraryURLHandler.h"
#import "XENDLogger.h"

#if TARGET_IPHONE_SIMULATOR==0
static NSString *libraryImagesBasePath = @"/Library/Application Support/Widgets/Image Packs";
#else
static NSString *libraryImagesBasePath = @"/opt/simject/Library/Application Support/Widgets/Image Packs";
#endif

@implementation XENDLibraryURLHandler

+ (BOOL)canHandleURL:(NSURL*)url {
    return [[url scheme] isEqualToString:@"xui"];
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    
    // We handle the following here:
    // - Image packs
    // - Forwarding internal images, such as media artwork and app icons
    
    NSString *host = [url host];;
              
    NSData *data = nil;
    NSString *mimetype = nil;
    if ([host isEqualToString:@"images"]) {
        data = [self loadLibraryFileAtPath:[url path] mimetype:&mimetype];
    }
    
    completionHandler(nil, data, mimetype);
}

- (NSData*)loadLibraryFileAtPath:(NSString*)path mimetype:(NSString**)mimetype {
    
    NSString *filepath = [NSString stringWithFormat:@"%@%@", libraryImagesBasePath, path];
    
    *mimetype = [self assumedMIMEForFilepath:path];
    
    if ([[NSFileManager defaultManager] fileExistsAtPath:filepath])
        return [NSData dataWithContentsOfFile:filepath];
    else {
        // Redirect to the default folder if the file cannot be found
        NSArray *pathComponents = [path pathComponents];
        int startPosition = [path hasPrefix:@"/"] ? 2 : 1; // skip name
        
        NSString *redirectedFilepath = [NSString stringWithFormat:@"%@/default/", libraryImagesBasePath];
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

@end
