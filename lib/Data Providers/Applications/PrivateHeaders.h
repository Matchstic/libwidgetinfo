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

@interface SpringBoard : UIApplication
- (void)launchApplicationWithIdentifier:(NSString*)identifier suspended:(BOOL)suspended;
@end

#endif /* PrivateHeaders_h */
