//
//  XENDWeatherHooks.m
//  Daemon
//
//  Created by Matt Clarke on 23/11/2019.
//

#import "XENDWeatherHooks.h"
#import <objc/runtime.h>

@implementation NSURLSession (WeatherHooks)

+ (void)load {
    static dispatch_once_t once_token;
    dispatch_once(&once_token, ^{
        // Swizzle NSURLSession dataTaskWithRequest
        SEL original = @selector(dataTaskWithRequest:completionHandler:);
        SEL hooked = @selector(_hooked_dataTaskWithRequest:completionHandler:);
        
        Method originalMethod = class_getInstanceMethod(self, original);
        Method extendedMethod = class_getInstanceMethod(self, hooked);
        method_exchangeImplementations(originalMethod, extendedMethod);
    });
}

- (NSURLSessionDataTask *)_hooked_dataTaskWithRequest:(NSURLRequest *)request
                            completionHandler:(void (^)(NSData *data, NSURLResponse *response, NSError *error))completionHandler {
    
    NSString *urlLocation = [request URL].absoluteString;
    if ([urlLocation hasPrefix:@"https://api.weather.com/"]) {
        
        // We've got a request that's hitting weather.com, so read out the API key
        NSMutableDictionary *queryStringDictionary = [[NSMutableDictionary alloc] init];
        NSArray *urlComponents = [[request URL].query componentsSeparatedByString:@"&"];
        
        for (NSString *keyValuePair in urlComponents) {
            NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
            NSString *key = [[pairComponents firstObject] stringByRemovingPercentEncoding];
            NSString *value = [[pairComponents lastObject] stringByRemovingPercentEncoding];

            [queryStringDictionary setObject:value forKey:key];
        }
        
        [[NSNotificationCenter defaultCenter]
            postNotificationName:@"XENDWeatherAPIKeyNotification"
                          object:self
                        userInfo:queryStringDictionary];
    }
    
    return [self _hooked_dataTaskWithRequest:request completionHandler:completionHandler];
}

@end
