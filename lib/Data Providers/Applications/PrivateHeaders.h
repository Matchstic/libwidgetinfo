//
//  PrivateHeaders.h
//  libwidgetdata
//
//  Created by Matt Clarke on 26/05/2020.
//

#ifndef PrivateHeaders_h
#define PrivateHeaders_h

#import <UIKit/UIKit.h>

@interface UIImage (Private)
+ (UIImage *)_applicationIconImageForBundleIdentifier:(NSString *)bundleIdentifier format:(int)format scale:(CGFloat)scale;
@end

#pragma mark - SpringBoard

@interface SpringBoard : UIApplication
- (void)launchApplicationWithIdentifier:(NSString*)identifier suspended:(BOOL)suspended;
@end

@interface SBApplication : NSObject
@end

@interface SBApplicationController : NSObject
+ (instancetype)sharedInstance;
- (id)applicationWithBundleIdentifier:(id)arg1;
@end

@interface SBLockScreenUnlockRequest : NSObject
@property (nonatomic,copy) NSString * name;
@property (assign,nonatomic) int source;
@property (assign,nonatomic) int intent;
// @property (nonatomic,retain) BSProcessHandle * process;
@property (nonatomic,retain) SBApplication * destinationApplication;
@property (assign,nonatomic) BOOL wantsBiometricPresentation;
@property (assign,nonatomic) BOOL forceAlertAuthenticationUI;
@property (assign,nonatomic) BOOL confirmedNotInPocket;
@end

@interface SBLockScreenManager : NSObject
@property (readonly) BOOL isUILocked;

+ (instancetype)sharedInstance;
- (BOOL)unlockUIFromSource:(int)arg1 withOptions:(id)arg2;
- (BOOL)unlockWithRequest:(id)arg1 completion:(/*^block*/id)arg2;
@end

#endif /* PrivateHeaders_h */
