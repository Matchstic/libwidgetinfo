//
//  IS2PreProcessor.mm
//  libwidgetdata
//
//  Created by Matt Clarke on 27/12/2018.
//  Copyright © 2018 Matt Clarke. All rights reserved.
//

#import "IS2PreProcessor.h"
#include "Compile.hpp"

@interface IS2PreProcessor ()
@end

@implementation IS2PreProcessor

- (NSString*)parseScriptNodeContents:(NSString*)contents withAttributes:(NSDictionary*)attributes {
    // Ensure that this is Cycript
    BOOL isCycriptType = NO;
    
    if ([attributes.allKeys containsObject:@"type"]) {
        isCycriptType = [attributes[@"type"] isEqualToString:@"text/cycript"];
    }
    
    if (!isCycriptType) return contents;
    
    // Compile cycript to ES5
    std::string result = Compile([contents cStringUsingEncoding:NSUTF8StringEncoding], true, false);
    NSString *output = [NSString stringWithUTF8String:result.c_str()];
    
    // Sort out objc_msgSend
    output = [output stringByReplacingOccurrencesOfString:@"objc_msgSend" withString:@"WidgetInfo._middleware.infostats2.objc_msgSend"];
    // output = [self replacingString:output withPattern:@"new Type\\(\"[a-z]+\"\\).blockWith\\(\\)\\(([\\S\\s]+)\\)\\)" withTemplate:@"$1)" error:nil];
    
    // Make the IS2* classes nicer to work with in the TypeScript layer
    output = [output stringByReplacingOccurrencesOfString:@"IS2System" withString:@"\"IS2System\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Media" withString:@"\"IS2Media\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Weather" withString:@"\"IS2Weather\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Telephony" withString:@"\"IS2Telephony\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Pedometer" withString:@"\"IS2Pedometer\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Notifications" withString:@"\"IS2Notifications\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Notes" withString:@"\"IS2Notes\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Location" withString:@"\"IS2Location\""];
    output = [output stringByReplacingOccurrencesOfString:@"IS2Calendar" withString:@"\"IS2Calendar\""];
    
    return output;
}

- (NSString *)replacingString:(NSString*)string withPattern:(NSString *)pattern withTemplate:(NSString *)withTemplate error:(NSError **)error {
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:pattern
                                                                           options:NSRegularExpressionCaseInsensitive
                                                                             error:error];
    return [regex stringByReplacingMatchesInString:string
                                           options:0
                                             range:NSMakeRange(0, string.length)
                                      withTemplate:withTemplate];
}

@end
