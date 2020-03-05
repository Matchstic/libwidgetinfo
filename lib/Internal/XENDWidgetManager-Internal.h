//
//  XENDWidgetManager-Internal.h
//  libwidgetdata
//
//  Created by Matt Clarke on 05/03/2020.
//

#import "XENDWidgetManager.h"
#import "../Data Providers/XENDBaseDataProvider.h"

@interface XENDWidgetManager (Internal)

/**
 * Retrieves the data provider for the specified namespace
 */
- (XENDBaseDataProvider*)providerForNamespace:(NSString*)providerNamespace;

@end
