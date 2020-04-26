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

#import "XENDLogger.h"

static BOOL filesystemLoggingEnabled = NO;

void XENDLog(NSString *format, ...) {
    // Type to hold information about variable arguments.
    va_list ap;
    
    // Initialize a variable argument list.
    va_start (ap, format);
    
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

+ (void)setFilesystemLoggingEnabled:(BOOL)enabled {
    filesystemLoggingEnabled = enabled;
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
    if (!filesystemLoggingEnabled) return;
    
    [self ensureLogDirectory];
    
    NSString *qualifiedFilename = [NSString stringWithFormat:@"%@/%@.log", [self logDirectory], filename];
    NSString *qualifiedMessage = [NSString stringWithFormat:@"(%@) %@\n", [NSDate date], message];
    
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
