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

#import "XENDApplicationsDataProvider.h"
#import "PrivateHeaders.h"
#import <objc/runtime.h>
#import <dlfcn.h>

@implementation XENDApplicationsDataProvider

+ (NSString*)providerNamespace {
    return @"applications";
}

- (void)didReceiveWidgetMessage:(NSDictionary *)data functionDefinition:(NSString *)definition callback:(void (^)(NSDictionary *))callback {
    
    if ([definition isEqualToString:@"launchApplication"]) {
        NSString *bundleIdentifier = [data objectForKey:@"identifier"];
        [self requestApplicationLaunchForBundleIdentifier:bundleIdentifier callback:callback];
        
    } else if ([definition isEqualToString:@"deleteApplication"]) {
        NSString *bundleIdentifier = [data objectForKey:@"identifier"];
        [self requestApplicationDeleteForBundleIdentifier:bundleIdentifier callback:callback];
        
    } else {
        callback(@{});
    }
}

- (void)requestIconDataForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback {
    
    // Using UIKit private API to fetch icon
    // This works inside both SpringBoard and Preferences, the main targets
    NSData *png;
    if (!bundleIdentifer || [bundleIdentifer isEqualToString:@""]) {
        png = (id)[NSNull null];
    } else {
        UIImage *icon = [UIImage _applicationIconImageForBundleIdentifier:bundleIdentifer format:2 scale:[UIScreen mainScreen].scale];
        
        png = UIImagePNGRepresentation(icon);
    }
    
    if (!png) {
        png = (id)[NSNull null];
    }
    
    callback(@{
        @"data": png
    });
}

- (void)requestApplicationLaunchForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback {
    
    // Using private SpringBoard function to launch application
    // This feature is not available elsewhere.
    // NOTE: This also needs to request the device to unlock, if necessary
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(launchApplicationWithIdentifier:suspended:)]) {
        
        // Use the unlock request system to get past auth, and then do the application launch
        SBLockScreenManager *manager = [objc_getClass("SBLockScreenManager") sharedInstance];
        if ([manager respondsToSelector:@selector(unlockWithRequest:completion:)] && manager.isUILocked) {
            
            if (!objc_getClass("SBLockScreenUnlockRequest")) {
                NSLog(@"ERROR :: Cannot use unlock API, because SBLockScreenUnlockRequest is missing");
                callback(@{});
                return;
            }
            
            SBLockScreenUnlockRequest *unlockRequest = [[objc_getClass("SBLockScreenUnlockRequest") alloc] init];
            unlockRequest.name = @"libwidgetinfo";
            
            /*
             Sources (SpringBoardUI, needs some more research):
             None
             Boot
             TransientOverlay
             Logout
             Plugin
             Blocked
             Keyboard
             LostMode
             IdleTimer
             Restoring
             Activation
             LiftToWake
             LockButton
             RemoteLock
             SOSDismiss
             PowerDownDismiss
             SmartCover
             Notification
             Authentication
             NotificationCenter
             Mesa
             Siri
             Touch
             HomeButton
             OtherButton
             VolumeButton
             ACPowerChange
             ExternalRequest
             ApplicationRequest
             SpringBoardRequest
             17 == SystemServiceRequest
             ChargingAccessoryChange
             CoverSheet
             ControlCenter
             CameraButton
             MouseButton
             */
            // Source == SystemServiceRequest
            unlockRequest.source = 17;
            
            /*
             intents:
             0 == none
             1 == dismiss
             2 == authenticate
             3 == authenticate and dismiss
             */
            unlockRequest.intent = 3;
            
            [manager unlockWithRequest:unlockRequest completion:^(BOOL success) {
                NSLog(@"DEBUG :: Called unlock with request %d", success);
                if (success) {
                    [(SpringBoard*)[UIApplication sharedApplication] launchApplicationWithIdentifier:bundleIdentifer suspended:NO];
                }
            }];
        } else {
            [(SpringBoard*)[UIApplication sharedApplication] launchApplicationWithIdentifier:bundleIdentifer suspended:NO];
        }
    }
    
    callback(@{});
}

- (void)requestApplicationDeleteForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback {
    
    // Prompt the user to confirm they want to delete the application
    // This is intentionally SpringBoard only
    
    
}

@end
