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
