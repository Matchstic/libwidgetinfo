//
//  XENDWidgetWeatherURLHandler.m
//  libwidgetinfo
//
//  Created by Matt Clarke on 05/03/2020.
//

#import "XENDWidgetWeatherURLHandler.h"
#import "../Internal/XENDWidgetManager-Internal.h"

@implementation XENDWidgetWeatherURLHandler

+ (BOOL)canHandleURL:(NSURL*)url {
    return [[url absoluteString] containsString:@"var/mobile/Documents/widgetweather.xml"];
}

- (void)handleURL:(NSURL*)url withCompletionHandler:(void (^)(NSError *, NSData*, NSString*))completionHandler {
    NSData* data = [[self generateXML] dataUsingEncoding:NSUTF8StringEncoding];
    completionHandler(nil, data, @"application/xml");
}

- (NSString*)generateXML {
    XENDBaseDataProvider *weatherProvider = [[XENDWidgetManager sharedInstance] providerForNamespace:@"weather"];
    NSDictionary *cachedWeatherData = [weatherProvider cachedData];
    
    NSMutableString *string = [NSMutableString string];
    
    [string appendString:@"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"];
    [string appendString:@"<xml>"];
    
    /*
     We need the following sections:
     - dayforcast
     - currentcondition
     - multicurrentcondition
     - hourforcast
     - googlelocation
     - nightforcast
     */
    
    [string appendString:[self dayForecastsSection:cachedWeatherData]];
    [string appendString:[self settingsSection:cachedWeatherData]];
    
    [string appendString:@"</xml>"];
    
    return string;
}

- (NSString*)dayForecastsSection:(NSDictionary*)cachedWeatherData {
    NSMutableString *section = [NSMutableString string];
    
    // No newline suffix here intentionally, and same for mis-spelling
    [section appendString:@"<dayforcast>"];
    
    NSArray *dailyForecasts = [cachedWeatherData objectForKey:@"daily"];
    for (NSDictionary *item in dailyForecasts) {
        // No newline suffix here intentionally
        [section appendString:@"<day>"];
        
        [section appendFormat:@"<description>%@</description>\n", [[item objectForKey:@"condition"] objectForKey:@"description"]];
        [section appendFormat:@"<speed>%d</speed>\n", [[[item objectForKey:@"wind"] objectForKey:@"speed"] intValue]];
        [section appendFormat:@"<uvindex>%d</uvindex>\n", [[[item objectForKey:@"ultraviolet"] objectForKey:@"index"] intValue]];
        [section appendFormat:@"<humidity>%d</humidity>\n", [[[item objectForKey:@"temperature"] objectForKey:@"relativeHumidity"] intValue]];
        [section appendFormat:@"<high>%d</high>\n", [[[item objectForKey:@"temperature"] objectForKey:@"maximum"] intValue]];
        [section appendFormat:@"<daydate>%llu</daydate>\n", [[item objectForKey:@"timestamp"] longLongValue] / 1000];
        [section appendFormat:@"<uvdesc>%@</uvdesc>\n", [[item objectForKey:@"ultraviolet"] objectForKey:@"description"]];
        
        // Correctly convert to 24hr time from ISO 8601
        // Example: 2020-03-14T07:20:59-0700
        [section appendFormat:@"<sunrise>%@</sunrise>\n", [self isoTimeTo24Hr:[[item objectForKey:@"sun"] objectForKey:@"sunrise"]]];
        
        // Correctly convert to 24hr time from ISO 8601
        [section appendFormat:@"<sunset>%@</sunset>\n", [self isoTimeTo24Hr:[[item objectForKey:@"sun"] objectForKey:@"sunset"]]];
        
        [section appendFormat:@"<typeofprecipitation>%@</typeofprecipitation>\n", [[item objectForKey:@"precipitation"] objectForKey:@"type"]];
        [section appendFormat:@"<code>%d</code>\n", [[[item objectForKey:@"condition"] objectForKey:@"code"] intValue]];
        [section appendFormat:@"<cardinal>%@</cardinal>\n", [[item objectForKey:@"wind"] objectForKey:@"cardinal"]];
        [section appendFormat:@"<low>%d</low>\n", [[[item objectForKey:@"temperature"] objectForKey:@"minimum"] intValue]];
        [section appendFormat:@"<dayofweek>%@</dayofweek>\n", [item objectForKey:@"dayOfWeek"]];
        [section appendFormat:@"<pop>%d</pop>\n", [[[item objectForKey:@"precipitation"] objectForKey:@"probability"] intValue]];
        [section appendFormat:@"<direction>%d</direction>\n", [[[item objectForKey:@"wind"] objectForKey:@"degrees"] intValue]];
        
        [section appendString:@"</day>\n"];
    }
    
    [section appendString:@"</dayforcast>\n"];
    
    return section;
}

- (NSString*)settingsSection:(NSDictionary*)cachedWeatherData {
    NSMutableString *section = [NSMutableString string];
    
    // No newline suffix here intentionally
    [section appendString:@"<settings>"];
    
    [section appendString:@"<weatherunderground>0</weatherunderground>\n"];
    [section appendString:@"<location1></location1>\n"];
    [section appendString:@"<googlelocation>0</googlelocation>\n"];
    [section appendString:@"<location5></location5>\n"];
    [section appendString:@"<interval>15</interval>\n"];
    [section appendString:@"<location2></location2>\n"];
    [section appendString:@"<mylocation>0</mylocation>\n"];
    [section appendString:@"<location3></location3>\n"];
    [section appendString:@"<accuweather>1</accuweather>\n"];
    [section appendString:@"<wwversion>3.5-widgetinfo</wwversion>\n"];
    [section appendString:@"<darksky>1</darksky>\n"];
    [section appendString:@"<autogpsupdate>manual</autogpsupdate>\n"];
    [section appendString:@"<wuinterval>9999</wuinterval>\n"];
    [section appendString:@"<yahoo>0</yahoo>\n"];
    [section appendString:@"<location4></location4>\n"];
    
    BOOL isMetric = [[[cachedWeatherData objectForKey:@"units"] objectForKey:@"isMetric"] boolValue];
    [section appendFormat:@"<tempunit>%@</tempunit>\n", isMetric ? @"c" : @"f"];
    
    BOOL isUsing24h = [self _using24h];
    [section appendFormat:@"<timehour>%@</timehour>\n", isUsing24h ? @"24h" : @"12h"];
    
    NSString *locale = [[[NSLocale currentLocale] localeIdentifier] stringByReplacingOccurrencesOfString:@"_" withString:@"-"];
    [section appendFormat:@"<lang>%@</lang>\n", locale];
     
    [section appendString:@"</settings>\n"];
    
    return section;
}

- (NSString*)isoTimeTo24Hr:(NSString*)timestring {
    NSArray *firstSplit = [timestring componentsSeparatedByString:@"T"];
    if (firstSplit.count != 2) return @"";
    
    NSArray *secondSplit = [[firstSplit objectAtIndex:1] componentsSeparatedByString:@":"];
    if (secondSplit.count < 2) return @"";
    
    return [NSString stringWithFormat:@"%@:%@", [secondSplit objectAtIndex:0], [secondSplit objectAtIndex:1]];
}

- (BOOL)_using24h {
    NSString *formatStringForHours = [NSDateFormatter dateFormatFromTemplate:@"j" options:0 locale:[NSLocale currentLocale]];
    NSRange containsA = [formatStringForHours rangeOfString:@"a"];
    
    return containsA.location == NSNotFound;
}

@end
