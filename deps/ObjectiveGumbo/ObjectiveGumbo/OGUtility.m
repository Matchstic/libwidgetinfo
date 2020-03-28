//
//  OGUtility.m
//  Hacker News
//
//  Created by Thomas Denney on 30/08/2013.
//  Copyright (c) 2013 Programming Thomas. All rights reserved.
//

#import "OGUtility.h"

@implementation OGUtility

+(NSString*)tagForGumboTag:(GumboTag)tag
{
    return [OGUtility tagStrings][tag];
}

+(GumboTag)gumboTagForTag:(NSString *)tag
{
    return [[OGUtility tagStrings] indexOfObject:tag];
}

+(NSArray*)tagStrings
{
    NSMutableArray * array = [NSMutableArray arrayWithCapacity:GUMBO_TAG_LAST];
    
    for (int i = 0; i <= GUMBO_TAG_LAST; i++) {
        const char *name = gumbo_normalized_tagname(i);
        array[i] = [NSString stringWithUTF8String:name];
    }
    
    return array;
}

@end
