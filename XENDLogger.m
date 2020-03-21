//
//  XENDLogger.m
//  libwidgetdata
//
//  Created by Matt Clarke on 21/03/2020.
//

#import "XENDLogger.h"

void XENDLog(NSString *format, ...) {
    // Type to hold information about variable arguments.
    va_list ap;
    
    // Initialize a variable argument list.
    va_start (ap, format);
    
    if (![format hasSuffix:@"\n"]) {
        format = [format stringByAppendingString:@"\n"];
    }
    
    NSString *body = [[NSString alloc] initWithFormat:format arguments:ap];
    
    // End using variable argument list.
    va_end(ap);
    
    // Log to general console
    NSLog(@"%@", body);
    
#if !TARGET_OS_SIMULATOR
    // Figure out the filename, based on the current bundle if present
    NSString *fileName;
    
    if ([NSBundle mainBundle] && [[NSBundle mainBundle] bundleIdentifier]) {
        fileName = [[NSBundle mainBundle] bundleIdentifier];
    } else {
        fileName = @"widgetinfod";
    }
    
    [[XENDLogger sharedInstance] appendToFile:fileName logMessage:body];
#endif
}

@implementation XENDLogger

+ (instancetype)sharedInstance {
    static XENDLogger *sharedInstance = nil;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[XENDLogger alloc] init];
    });
    
    return sharedInstance;
}

- (NSString*)logDirectory {
    return @"/var/mobile/Library/Logs/Xen-HTML";
}

- (void)ensureLogDirectory {
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        if (![[NSFileManager defaultManager] fileExistsAtPath:[self logDirectory] isDirectory:nil]) {
            [[NSFileManager defaultManager] createDirectoryAtPath:[self logDirectory]
                                      withIntermediateDirectories:YES
                                                       attributes:nil
                                                            error:nil];
        }
    });
}

- (void)appendToFile:(NSString*)filename logMessage:(NSString*)message {
    [self ensureLogDirectory];
    
    NSString *qualifiedFilename = [NSString stringWithFormat:@"%@/%@.log", [self logDirectory], filename];
    NSString *qualifiedMessage = [NSString stringWithFormat:@"(%@) %@", [NSDate date], message];
    
    NSFileHandle *fileHandle = [NSFileHandle fileHandleForWritingAtPath:qualifiedFilename];
    if (fileHandle) {
        [fileHandle seekToEndOfFile];
        [fileHandle writeData:[qualifiedMessage dataUsingEncoding:NSUTF8StringEncoding]];
        [fileHandle closeFile];
    } else {
        [qualifiedMessage writeToFile:qualifiedFilename
                atomically:YES
                  encoding:NSUTF8StringEncoding
                     error:nil];
    }
}

@end
