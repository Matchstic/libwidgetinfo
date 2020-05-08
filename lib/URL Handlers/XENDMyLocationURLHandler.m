//
//  XENDMyLocationURLHandler.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 08/05/2020.
//

#import "XENDMyLocationURLHandler.h"
#import "XENDLogger.h"
#import "../Internal/XENDWidgetManager-Internal.h"
#import "../Data Providers/Weather/XENDWeatherDataProvider.h"

@implementation XENDMyLocationURLHandler

+ (BOOL)canHandleURL:(NSURL*)url {
    return [[url scheme] isEqualToString:@"file"] &&
            [[url absoluteString] containsString:@"/var/mobile/Documents/myLocation.txt"];
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    XENDLog(@"*** myLocation Compatibility: handling URL: %@", url);
              
    XENDWeatherDataProvider *weatherProvider = (XENDWeatherDataProvider*)[[XENDWidgetManager sharedInstance] providerForNamespace:@"weather"];
    
    // The weather provider may not have finished loading by the time we arrive here
    // Therefore, wait for it!
    if (![weatherProvider hasInitialData]) {
        [weatherProvider registerListenerForInitialData:^(NSDictionary *cachedData) {
            // Get the user's latitude and longitude.
            
            NSData* data = [[self generateFile:cachedData] dataUsingEncoding:NSUTF8StringEncoding];
            completionHandler(nil, data, @"plain/text");
        }];
    } else {
        NSData* data = [[self generateFile:[weatherProvider cachedData]] dataUsingEncoding:NSUTF8StringEncoding];
        completionHandler(nil, data, @"plain/text");
    }
}

- (NSString*)generateFile:(NSDictionary*)cachedData {
    // Format: "Lat=%f \r\nLong=%f"
    NSDictionary *metadata = [cachedData objectForKey:@"metadata"];
    NSDictionary *location = [metadata objectForKey:@"location"];
    
    return [NSString stringWithFormat:@"Lat=%f \r\nLong=%f", [[location objectForKey:@"latitude"] doubleValue], [[location objectForKey:@"longitude"] doubleValue]];
}

@end
