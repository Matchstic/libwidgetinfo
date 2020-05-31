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

- (NSDictionary*)applicationMetadataForIdentifier:(NSString*)bundleIdentifier {
    NSArray *applications = [self.cachedDynamicProperties objectForKey:@"allApplications"];
    
    for (NSDictionary *item in applications) {
        if ([[item objectForKey:@"identifier"] isEqualToString:bundleIdentifier])
            return item;
    }
    
    return nil;
}

- (void)requestIconDataForBundleIdentifier:(NSString*)bundleIdentifer callback:(void (^)(NSDictionary *result))callback {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        // Using UIKit private API to fetch icon
        // This works inside both SpringBoard and Preferences, the main targets
        NSData *png;
        if (!bundleIdentifer || [bundleIdentifer isEqualToString:@""]) {
            png = (id)[NSNull null];
        } else {
            // Wrapping in exception handler to catch theme tweaks doing weird things
            @try {
                UIImage *icon = [UIImage _applicationIconImageForBundleIdentifier:bundleIdentifer format:2 scale:[UIScreen mainScreen].scale];
                
                png = UIImagePNGRepresentation(icon);
            } @catch (NSException *e) {
                NSLog(@"%@", e);
            }
        }
        
        if (!png) {
            png = (id)[NSNull null];
        }
        
        callback(@{
            @"data": png
        });
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
    
    // First, load localisations.
    // on iOS 13, they live in the SpringBoardHome table of /System/Library/PrivateFrameworks/SpringBoardHome.framework
    // on iOS 12 and older, they live in the XXX table of /System/Library/CoreServices/SpringBoard.app
    
    static NSString *deleteBodyMessageKey = @"UNINSTALL_ICON_BODY_DELETE_DATA";
    static NSString *deleteCancelKey = @"UNINSTALL_ICON_BUTTON_CANCEL";
    static NSString *deleteOkKey = @"UNINSTALL_ICON_BUTTON_DELETE";
    
    // has an %@ format string
    static NSString *deleteTitleKey = @"UNINSTALL_ICON_TITLE_DELETE_WITH_NAME";
    
    NSBundle *bundle;
    NSString *table;
    
    if ([[NSFileManager defaultManager] fileExistsAtPath:@"/System/Library/PrivateFrameworks/SpringBoardHome.framework"]) {
        bundle = [NSBundle bundleWithPath:@"/System/Library/PrivateFrameworks/SpringBoardHome.framework"];
        table = @"SpringBoardHome";
    } else {
        bundle = [NSBundle bundleWithPath:@"/System/Library/CoreServices/SpringBoard.app"];
        table = @"SpringBoard";
    }
    
    NSString *localisedTitleFormat = [bundle localizedStringForKey:deleteTitleKey value:@"Delete \"%@\"?" table:table];
    NSDictionary *item = [self applicationMetadataForIdentifier:bundleIdentifer];
    NSString *localisedTitle = [NSString stringWithFormat:localisedTitleFormat, [item objectForKey:@"name"]];
    
    NSString *localisedBody = [bundle localizedStringForKey:deleteBodyMessageKey value:@"Deleting this app will also delete its data." table:table];
    NSString *localisedCancel = [bundle localizedStringForKey:deleteCancelKey value:@"Cancel" table:table];
    NSString *localisedOk = [bundle localizedStringForKey:deleteOkKey value:@"Delete" table:table];
    
    // Setup alert controller
    
    UIAlertController *controller = [UIAlertController alertControllerWithTitle:localisedTitle message:localisedBody preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:localisedCancel style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        
        callback(@{});
        
    }];
    [controller addAction:cancelAction];
    
    UIAlertAction *deleteAction = [UIAlertAction actionWithTitle:localisedOk style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
        
        // Request daemon to do the delete
        NSLog(@"*** DEBUG :: Requesting delete");
        
        [super didReceiveWidgetMessage:@{
            @"identifier": bundleIdentifer
        } functionDefinition:@"_delete" callback:callback];
    }];
    [controller addAction:deleteAction];
    
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:controller animated:YES completion:^{}];
}

@end
