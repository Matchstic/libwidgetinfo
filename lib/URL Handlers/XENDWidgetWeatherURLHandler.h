//
//  XENDWidgetWeatherURLHandler.h
//  libwidgetinfo
//
//  Created by Matt Clarke on 05/03/2020.
//

#import <Foundation/Foundation.h>
#import "XENDBaseURLHandler.h"

@interface XENDWidgetWeatherURLHandler : XENDBaseURLHandler

/**
 * Call externally to disable widgetweather.xml compatibility
 */
+ (void)setHandlerEnabled:(BOOL)enabled;

@end
