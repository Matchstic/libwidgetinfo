//
//  XENDLogger.h
//  libwidgetdata
//
//  Created by Matt Clarke on 21/03/2020.
//

#import <Foundation/Foundation.h>

#if defined __cplusplus
extern "C" {
#endif
    
/**
 Provides a standardised way to log message both to the filesystem, and to the general console
 */
void XENDLog(NSString *format, ...);
    
#if defined __cplusplus
};
#endif

@interface XENDLogger : NSObject

/**
 Retrieve a shared instance of the logger
 */
+ (instancetype)sharedInstance;

/**
 Writes the log message to the filename specified.
 
 The log directory to be used should not be specified as part of the filename, i.e. it should not have any directory
 appended.
 
 Additionally, the log message will automatically be prefixed with the current time
 */
- (void)appendToFile:(NSString*)filename logMessage:(NSString*)message;

/**
 * Call externally to disable logging to the filesystem
 */
+ (void)setFilesystemLoggingEnabled:(BOOL)enabled;

@end
