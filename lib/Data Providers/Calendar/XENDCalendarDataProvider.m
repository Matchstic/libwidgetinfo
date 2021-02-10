/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
**/

#import <EventKit/EventKit.h>
#import <Foundation/Foundation.h>

#import "XENDCalendarDataProvider.h"
#import "XENDLogger.h"

#define BAD_REQUEST     @-1
#define OK              @0

@interface XENDCalendarDataProvider ()
@property (nonatomic, strong) EKEventStore *store;
@property (nonatomic, strong) NSTimer *updateTimer;
@end

@implementation XENDCalendarDataProvider

+ (NSString*)providerNamespace {
    return @"calendar";
}

- (void)intialiseProvider {
    // Setup calendar stuff
    self.store = [[EKEventStore alloc] init];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_calendarUpdateNotificationRecieved:) name:@"EKEventStoreChangedNotification" object:self.store];
    
#if TARGET_IPHONE_SIMULATOR
    [self.store requestAccessToEntityType:EKEntityTypeEvent completion:^(BOOL granted, NSError * _Nullable error) {
        
    }];
#endif
    
    // First update
    [self refresh];
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    @try {
        if ([definition isEqualToString:@"fetch"]) {
            callback([self fetch:data]);
        } else if ([definition isEqualToString:@"create"]) {
            callback([self create:data]);
        } else if ([definition isEqualToString:@"delete"]) {
            callback([self delete:data]);
        } else {
            callback(@{});
        }
    } @catch (NSException *e) {
        XENDLog(@"%@", e);
        callback(@{});
    }
}

#pragma mark Private

- (void)refresh {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void) {
        [self.updateTimer invalidate];
        
        // Called for new information being available.
        NSDate *startDate = [NSDate date];
        NSDate *endDate = [NSDate dateWithTimeInterval:60*60*24*7 sinceDate:startDate];
        NSArray *events = [self _calendarEntriesBetweenStartTime:startDate andEndTime:endDate];
        
        // Parse events
        NSDate *nextUpdateTime = [NSDate dateWithTimeInterval:60*60 sinceDate:[NSDate date]]; // In an hour
        NSMutableArray *array = [NSMutableArray array];
        for (EKEvent *event in events) {
            NSDictionary *parsedEvent = [self eventToDictionary:event];
            
            [array addObject:parsedEvent];
            
            // Update our next update time if needed.
            if (event.endDate.timeIntervalSince1970 < nextUpdateTime.timeIntervalSince1970) {
                nextUpdateTime = event.endDate;
            }
        }
        
        // Get calendar list
        NSArray *calendars = [self _calendars];
        
        // Schedule the update timer
        NSTimeInterval interval = nextUpdateTime.timeIntervalSince1970 - startDate.timeIntervalSince1970;
        self.updateTimer = [NSTimer scheduledTimerWithTimeInterval:interval
                                                            target:self
                                                          selector:@selector(requestRefresh)
                                                          userInfo:nil
                                                           repeats:NO];
        
        // Notify of new dynamics
        self.cachedDynamicProperties = [@{
            @"calendars": calendars,
            @"upcomingWeekEvents": array
        } mutableCopy];
        [self notifyWidgetManagerForNewProperties];
    });
}

- (NSDictionary*)fetch:(NSDictionary*)data {
    if (!data ||
        ![data objectForKey:@"start"] ||
        ![data objectForKey:@"end"] ||
        ![data objectForKey:@"ids"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    int start = [[data objectForKey:@"start"] intValue];
    int end = [[data objectForKey:@"end"] intValue];
    NSArray *ids = [data objectForKey:@"ids"];
    BOOL subsetFiltering = ids.count > 0;

    NSDate *startDate = [NSDate dateWithTimeIntervalSince1970:start / 1000];
    NSDate *endDate = [NSDate dateWithTimeIntervalSince1970:end / 1000];
    NSArray *events = [self _calendarEntriesBetweenStartTime:startDate andEndTime:endDate];
    
    // Parse events
    NSMutableArray *content = [NSMutableArray array];
    for (EKEvent *event in events) {
        // Check this event matches the calendar, if needing to filter
        if (subsetFiltering && ![ids containsObject:event.calendar.calendarIdentifier])
            continue;
        
        [content addObject:[self eventToDictionary:event]];
    }
    
    return @{
        @"result": content,
        @"error": OK
    };
}

- (NSDictionary*)create:(NSDictionary*)params {
    if (!params ||
        ![params objectForKey:@"title"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    // Deconstruct input, and apply defaults
    NSString *title = [params objectForKey:@"title"];
    NSString *location = [params objectForKey:@"location"] ? [params objectForKey:@"location"] : @"";
    int start = [params objectForKey:@"start"] ?
                    [[params objectForKey:@"start"] intValue] / 1000:
                    [[NSDate date] timeIntervalSince1970];
    int end = [params objectForKey:@"end"] ?
                    [[params objectForKey:@"end"] intValue] / 1000 :
                    [[NSDate date] timeIntervalSince1970] + (60 * 60);
    BOOL allDay = [params objectForKey:@"allDay"] ?
                    [[params objectForKey:@"allDay"] boolValue] :
                    NO;
    NSString *calendarId = [params objectForKey:@"calendarId"];
    
    EKCalendar *calendar = calendarId ?
                            [self.store calendarWithIdentifier:calendarId] :
                            [self.store defaultCalendarForNewEvents];
    
    // Create the event
    EKEvent *newEvent = [EKEvent eventWithEventStore:self.store];
    newEvent.calendar = calendar;
    newEvent.title = title;
    newEvent.location = location;
    newEvent.startDate = [NSDate dateWithTimeIntervalSince1970:start];
    newEvent.endDate = [NSDate dateWithTimeIntervalSince1970:end];
    newEvent.allDay = allDay;
     
    NSError *error;
    [self.store saveEvent:newEvent span:EKSpanThisEvent commit:YES error:&error];
    
    BOOL success = !error;
    
    // Refresh if we need to
    if (start < [[NSDate date] timeIntervalSince1970] + (60*60*24*7)) {
        [self refresh];
    }
    
    return @{
        @"success": @(success),
        @"error": OK
    };
}

- (NSDictionary*)delete:(NSDictionary*)data {
    if (!data ||
        ![data objectForKey:@"id"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSString *eventId = [data objectForKey:@"id"];
    EKEvent *event = [self.store eventWithIdentifier:eventId];
    
    int startDate = [event.startDate timeIntervalSince1970];
    
    NSError *error;
    [self.store removeEvent:event span:EKSpanThisEvent error:&error];
    
    BOOL success = !error;
    
    // Refresh if we need to
    if (startDate < [[NSDate date] timeIntervalSince1970] + (60*60*24*7)) {
        [self refresh];
    }
    
    return @{
        @"success": @(success),
        @"error": OK
    };
}

- (void)_calendarUpdateNotificationRecieved:(NSNotification*)notification {
    [self refresh];
}

- (NSArray*)_calendarEntriesBetweenStartTime:(NSDate*)startTime andEndTime:(NSDate*)endTime {
    // Search all calendars
    NSMutableArray *searchableCalendars = [[self.store calendarsForEntityType:EKEntityTypeEvent] mutableCopy];
    
    NSPredicate *predicate = [self.store predicateForEventsWithStartDate:startTime endDate:endTime calendars:searchableCalendars];
    
    // Fetch all events that match the predicate
    NSMutableArray *events = [NSMutableArray arrayWithArray:[self.store eventsMatchingPredicate:predicate]];

    NSArray *deselected = [self _deselectedCalendars];
    for (EKEvent *event in [events copy]) {
        if ([deselected containsObject:event.calendar.calendarIdentifier]) {
            [events removeObject:event];
        }
    }
    
    return events;
}

- (NSArray*)_calendars {
    NSArray *calendars = [self.store calendarsForEntityType:EKEntityTypeEvent];
    NSArray *deselected = [self _deselectedCalendars];
    
    NSMutableArray *results = [@[] mutableCopy];
    for (EKCalendar *cal in calendars) {
        if (![deselected containsObject:cal.calendarIdentifier])
            [results addObject:[self calendarToDictionary:cal]];
    }
    
    return results;
}

- (NSArray*)_deselectedCalendars {
    CFPreferencesAppSynchronize(CFSTR("com.apple.mobilecal"));
    
    NSDictionary *settings;
    CFArrayRef keyList = CFPreferencesCopyKeyList(CFSTR("com.apple.mobilecal"), kCFPreferencesCurrentUser, kCFPreferencesAnyHost);
    if (!keyList) {
        settings = [NSMutableDictionary dictionary];
    } else {
        CFDictionaryRef dictionary = CFPreferencesCopyMultiple(keyList, CFSTR("com.apple.mobilecal"), kCFPreferencesCurrentUser, kCFPreferencesAnyHost);
        
        settings = [(__bridge NSDictionary *)dictionary copy];
        CFRelease(dictionary);
        CFRelease(keyList);
    }

    return [settings objectForKey:@"LastDeselectedCalendars"];
}

/**
 Converts event to dictionary
 */
- (NSDictionary*)eventToDictionary:(EKEvent*)event {
    if (!event) return @{};
    
    return @{
        @"id": event.eventIdentifier,
        @"title": [self escapeString:event.title],
        @"location": [self escapeString:event.location],
        @"allDay": [NSNumber numberWithBool:event.allDay],
        @"start": [NSNumber numberWithDouble:event.startDate.timeIntervalSince1970 * 1000],
        @"end": [NSNumber numberWithDouble:event.endDate.timeIntervalSince1970 * 1000],
        @"calendar": [self calendarToDictionary:event.calendar]
    };
    
    return nil;
}

/**
 Converts calendar to dictionary
 */
- (NSDictionary*)calendarToDictionary:(EKCalendar*)calendar {
    if (!calendar) return @{};
    
    return @{
        @"id": calendar.calendarIdentifier,
        @"name": [self escapeString:calendar.title],
        @"color": [self _hexStringFromColor:calendar.CGColor],
    };
}

/**
 Converts a colour ref into a hex string
 */
- (NSString *)_hexStringFromColor:(CGColorRef)color {
    if (!color) {
        return @"#000000";
    }
    
    const CGFloat *components = CGColorGetComponents(color);
    
    CGFloat r = components[0];
    CGFloat g = components[1];
    CGFloat b = components[2];
    
    return [NSString stringWithFormat:@"#%02lX%02lX%02lX",
            lroundf(r * 255),
            lroundf(g * 255),
            lroundf(b * 255)];
}

@end
