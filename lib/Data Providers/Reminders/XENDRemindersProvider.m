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

#import "XENDRemindersProvider.h"
#import "XENDLogger.h"

#define BAD_REQUEST     @-1
#define OK              @0

#define MANUAL_UPDATE_INTERVAL 3600

@interface XENDRemindersProvider ()
@property (nonatomic, strong) EKEventStore *store;
@property (nonatomic, strong) NSTimer *updateTimer;
@end

@implementation XENDRemindersProvider

+ (NSString*)providerNamespace {
    return @"reminders";
}

- (void)intialiseProvider {
    // Setup calendar stuff
    self.store = [[EKEventStore alloc] init];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(_remindersUpdateNotificationRecieved:) name:@"EKEventStoreChangedNotification" object:self.store];
    
#if TARGET_IPHONE_SIMULATOR
    [self.store requestAccessToEntityType:EKEntityTypeReminder completion:^(BOOL granted, NSError * _Nullable error) {
        
    }];
#endif
    
    // First update and setup manual update timer
    [self restartUpdates];
}

- (void)didReceiveWidgetMessage:(NSDictionary*)data functionDefinition:(NSString*)definition callback:(void(^)(NSDictionary*))callback {
    @try {
        if ([definition isEqualToString:@"fetch"]) {
            [self fetch:data callback:callback];
        } else if ([definition isEqualToString:@"create"]) {
            callback([self create:data]);
        } else if ([definition isEqualToString:@"update"]) {
            callback([self update:data]);
        } else if ([definition isEqualToString:@"delete"]) {
            callback([self delete:data]);
        } else if ([definition isEqualToString:@"lookupReminder"]) {
            callback([self reminderForId:data]);
        } else if ([definition isEqualToString:@"lookupList"]) {
            callback([self listForId:data]);
        } else {
            callback(@{});
        }
    } @catch (NSException *e) {
        XENDLog(@"%@", e);
        callback(@{});
    }
}

- (void)noteSignificantTimeChange {
    [self refresh];
}

- (void)noteDeviceDidEnterSleep {
    // Stop updates
    [self.updateTimer invalidate];
    self.updateTimer = nil;
}

- (void)noteDeviceDidExitSleep {
    // Restart updates
    [self restartUpdates];
}

- (void)restartUpdates {
    // Do initial update
    [self _remindersUpdateNotificationRecieved:nil];
    
    // Restart timer
    self.updateTimer = [NSTimer scheduledTimerWithTimeInterval:MANUAL_UPDATE_INTERVAL target:self selector:@selector(_remindersUpdateNotificationRecieved:) userInfo:nil repeats:YES];
}

#pragma mark Private

- (void)refresh {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void) {
        [self.updateTimer invalidate];
        
        // Get pending reminders
        [self _pendingRemindersWithCompletion:^(NSArray *reminders) {
            // Parse reminders
            NSMutableArray *array = [NSMutableArray array];
            for (EKReminder *reminder in reminders) {
                [array addObject:[self reminderToDictionary:reminder]];
            }
            
            // Get reminders lists
            NSArray *lists = [self _lists];
            
            // Notify of new dynamics
            self.cachedDynamicProperties = [@{
                @"lists": lists,
                @"pending": array
            } mutableCopy];
            [self notifyWidgetManagerForNewProperties];
        }];
    });
}

- (NSDictionary*)reminderToDictionary:(EKReminder*)reminder {
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSDate *startDate = reminder.startDateComponents ?
        [calendar dateFromComponents:reminder.startDateComponents] :
        nil;
    NSDate *dueDate = reminder.dueDateComponents ?
        [calendar dateFromComponents:reminder.dueDateComponents] :
        nil;
    
    return @{
        @"id": reminder.calendarItemIdentifier,
        @"title": [self escapeString:reminder.title],
        @"start": @(startDate ? startDate.timeIntervalSince1970 * 1000 : -1),
        @"due": @(dueDate ? dueDate.timeIntervalSince1970 * 1000 : -1),
        @"overdue": @(dueDate.timeIntervalSince1970 < [NSDate date].timeIntervalSince1970),
        @"priority": @([self priorityToSensibleNumber:reminder.priority]),
        @"completed": @(reminder.completed),
        @"notes": reminder.notes ? [self escapeString:reminder.notes] : @"",
        @"url": reminder.URL ? reminder.URL.absoluteURL : @"",
        @"list": [self listToDictionary:reminder.calendar]
    };
}

- (NSUInteger)priorityToSensibleNumber:(EKReminderPriority)priority {
    switch (priority) {
        case EKReminderPriorityLow:
            return 1;
        case EKReminderPriorityMedium:
            return 2;
        case EKReminderPriorityHigh:
            return 3;
            
        case EKReminderPriorityNone:
        default:
            return 0;
    }
}

- (EKReminderPriority)sensibleNumberToPriority:(NSUInteger)number {
    switch (number) {
        case 1:
            return EKReminderPriorityLow;
        case 2:
            return EKReminderPriorityMedium;
        case 3:
            return EKReminderPriorityHigh;
        
        case 0:
        default:
            return EKReminderPriorityNone;
    }
}

- (NSDictionary*)listToDictionary:(EKCalendar*)list {
    if (!list) return @{};
    
    return @{
        @"id": list.calendarIdentifier,
        @"name": [self escapeString:list.title],
        @"color": [self hexStringFromColor:list.CGColor],
    };
}

- (void)_remindersUpdateNotificationRecieved:(NSNotification*)notification {
    [self refresh];
}

- (void)_pendingRemindersWithCompletion:(void (^)(NSArray*))completionHandler {
    // Search all available calendars
    NSArray *searchableCalendars = [self.store calendarsForEntityType:EKEntityTypeReminder];
    
    NSPredicate *predicate = [self.store predicateForIncompleteRemindersWithDueDateStarting:nil ending:nil calendars:searchableCalendars];
    
    // Fetch all that match the predicate
    [self.store fetchRemindersMatchingPredicate:predicate completion:^(NSArray *reminders) {
        completionHandler(reminders);
    }];
}

- (NSArray*)_lists {
    NSArray *calendars = [self.store calendarsForEntityType:EKEntityTypeReminder];
    
    NSMutableArray *results = [@[] mutableCopy];
    for (EKCalendar *cal in calendars) {
        [results addObject:[self listToDictionary:cal]];
    }
    
    return results;
}


- (void)fetch:(NSDictionary*)data callback:(void(^)(NSDictionary*))callback {
    if (!data ||
        ![data objectForKey:@"start"] ||
        ![data objectForKey:@"end"] ||
        ![data objectForKey:@"ids"] ||
        ![data objectForKey:@"completedState"]) {
        callback(@{
            @"error": BAD_REQUEST
        });
        return;
    }
    
    // Pull out params
    double start = [[data objectForKey:@"start"] doubleValue];
    double end = [[data objectForKey:@"end"] doubleValue];
    BOOL completedState = [[data objectForKey:@"completedState"] boolValue];
    NSArray *ids = [data objectForKey:@"ids"];
    BOOL subsetFiltering = ids.count > 0;

    NSDate *startDate = [NSDate dateWithTimeIntervalSince1970:start / 1000];
    NSDate *endDate = [NSDate dateWithTimeIntervalSince1970:end / 1000];
    
    // Reduce calendar search space if necessary
    NSMutableArray *searchableCalendars = [[self.store calendarsForEntityType:EKEntityTypeReminder] mutableCopy];
    if (subsetFiltering) {
        for (EKCalendar *calendar in [searchableCalendars copy]) {
            if (![ids containsObject:calendar.calendarIdentifier])
                [searchableCalendars removeObject:calendar];
        }
    }
    
    NSPredicate *predicate;
    if (completedState) {
        predicate = [self.store predicateForCompletedRemindersWithCompletionDateStarting:startDate
                                                                                  ending:endDate
                                                                               calendars:searchableCalendars];
    } else {
        predicate = [self.store predicateForIncompleteRemindersWithDueDateStarting:startDate
                                                                            ending:endDate
                                                                         calendars:searchableCalendars];
    }
    
    // Fetch all that match the predicate
    [self.store fetchRemindersMatchingPredicate:predicate completion:^(NSArray<EKReminder *> * _Nullable reminders) {
        NSMutableArray *array = [NSMutableArray array];
        for (EKReminder *reminder in reminders) {
            [array addObject:[self reminderToDictionary:reminder]];
        }
        
        callback(@{
            @"result": array,
            @"error": OK
        });
    }];
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
    double due = [params objectForKey:@"due"] ?
                    [[params objectForKey:@"due"] doubleValue] / 1000 :
                    -1;
    double start = [params objectForKey:@"start"] ?
                    [[params objectForKey:@"start"] doubleValue] / 1000 :
                    due;
    int priority = [params objectForKey:@"priority"] ?
                    [[params objectForKey:@"priority"] doubleValue] :
                    0;
    
    NSString *listId = [params objectForKey:@"listId"];
    
    EKCalendar *list = listId ?
                            [self.store calendarWithIdentifier:listId] :
                            [self.store defaultCalendarForNewReminders];
    
    EKReminder *newReminder = [EKReminder reminderWithEventStore:self.store];
    newReminder.calendar = list;
    newReminder.title = title;
    newReminder.priority = [self sensibleNumberToPriority:priority];
    
    // Dates
    NSCalendar *calendar = [NSCalendar currentCalendar];
    unsigned unitFlags = NSCalendarUnitYear |
                         NSCalendarUnitMonth |
                         NSCalendarUnitDay |
                         NSCalendarUnitHour |
                         NSCalendarUnitMinute |
                         NSCalendarUnitSecond |
                         NSCalendarUnitTimeZone;
    
    // Only set due date if theres also a start date
    if (due != -1 && start != -1) {
        NSDateComponents *dueComponents = [calendar components:unitFlags fromDate:[NSDate dateWithTimeIntervalSince1970:due]];
        newReminder.dueDateComponents = dueComponents;
    }
    
    // Start date can be independent
    if (start != -1) {
        NSDateComponents *startComponents = [calendar components:unitFlags fromDate:[NSDate dateWithTimeIntervalSince1970:start]];
        newReminder.startDateComponents = startComponents;
    }
    
    NSError *error;
    [self.store saveReminder:newReminder commit:YES error:&error];
    
    [self refresh];
    
    return @{
        @"id": error ? @"" : newReminder.calendarItemIdentifier,
        @"error": OK
    };
}

- (NSDictionary*)update:(NSDictionary*)data {
    if (!data ||
        ![data objectForKey:@"id"] ||
        ![data objectForKey:@"state"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSString *identifier = [data objectForKey:@"id"];
    BOOL newState = [[data objectForKey:@"state"] boolValue];
    
    EKReminder *reminder = (EKReminder*)[self.store calendarItemWithIdentifier:identifier];
    if (!reminder) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    reminder.completed = newState;
    
    NSError *error;
    [self.store saveReminder:reminder commit:YES error:&error];
    
    [self refresh];
    
    return @{
        @"success": @(!error),
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
    
    NSString *identifier = [data objectForKey:@"id"];
    EKReminder *reminder = (EKReminder*)[self.store calendarItemWithIdentifier:identifier];
    if (!reminder) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSError *error;
    [self.store removeReminder:reminder commit:YES error:&error];
    
    [self refresh];
    
    return @{
        @"success": @(!error),
        @"error": OK
    };
}

- (NSDictionary*)reminderForId:(NSDictionary*)data {
    if (!data ||
        ![data objectForKey:@"id"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSString *identifier = [data objectForKey:@"id"];
    EKReminder *reminder = (EKReminder*)[self.store calendarItemWithIdentifier:identifier];
    
    return @{
        @"reminder": [self reminderToDictionary:reminder],
        @"error": OK
    };
}

- (NSDictionary*)listForId:(NSDictionary*)data {
    if (!data ||
        ![data objectForKey:@"id"]) {
        return @{
            @"error": BAD_REQUEST
        };
    }
    
    NSString *calendarId = [data objectForKey:@"id"];
    EKCalendar *calendar = [self.store calendarWithIdentifier:calendarId];
    
    return @{
        @"list": [self listToDictionary:calendar],
        @"error": OK
    };
}

@end
