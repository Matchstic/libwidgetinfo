//
//  XENDProxyDataProvider.h
//  libwidgetdata
//
//  Created by Matt Clarke on 16/09/2019.
//

#import <Foundation/Foundation.h>
#import "../XENDBaseDataProvider.h"

@interface XENDProxyDataProvider : XENDBaseDataProvider

- (void)notifyUpdatedDynamicProperties:(NSDictionary*)dynamicProperties;
- (void)notifyDaemonConnected;

@end
