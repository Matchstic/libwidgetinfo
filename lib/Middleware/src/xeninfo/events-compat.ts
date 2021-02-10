import { CalendarEvent, CalendarProperties } from '../data/calendar';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoEvents {

    constructor(private providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {

        // Do initial update
        this.onDataChanged(providers.get(DataProviderUpdateNamespace.Calendar));

        // Monitor calendar data
        providers.get(DataProviderUpdateNamespace.Calendar).observeData((newData: CalendarProperties) => {

            this.onDataChanged(newData);
            this.notifyXenInfoDataChanged('events');
        });
    }

    onFirstUpdate() {
        this.notifyXenInfoDataChanged('events');
    }

    onDataChanged(data: CalendarProperties) {
        const formatDate = (date: number) => {
            return new Date(date).toLocaleDateString(undefined, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
            });
        }
        // Update window object for events
        (window as any).events = data.upcomingWeekEvents.map((event: CalendarEvent) => {
            return {
                title: event.title,
                location: event.location,
                isAllDay: event.allDay,
                date: formatDate(event.start),
                startTimeTimestamp: event.start,
                endTimeTimestamp: event.end,
                associatedCalendarName: event.calendar.name,
                associatedCalendarHexColor: event.calendar.color
            };
        });
    }
}