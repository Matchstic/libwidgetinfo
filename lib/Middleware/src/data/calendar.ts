import { Base } from '../types';

export interface XENDCalendarEntry {
    title: string;
    location: string;
    allDay: boolean;
    startTimestamp: number;
    endTimestamp: number;
    calendar: XENDCalendar;
}

export interface XENDCalendar {
    name: string;
    identifier: string;
    hexColor: string;
}

export interface XENDCalendarProperties {
    userCalendars: XENDCalendar[];
    upcomingWeekEvents: XENDCalendarEntry[];
}

export default class Calendar extends Base implements XENDCalendarProperties {

    /////////////////////////////////////////////////////////
    // XENDCalendarProperties stub implementation
    /////////////////////////////////////////////////////////

    userCalendars: XENDCalendar[];
    upcomingWeekEvents: XENDCalendarEntry[];

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    /**
     *
     * @param startTimestamp
     * @param endTimestamp
     * @param calendars
     */
    public async fetchEntries(startTimestamp: number, endTimestamp?: number,
                              calendars?: XENDCalendar[]): Promise<XENDCalendarEntry[]> {
        return new Promise<XENDCalendarEntry[]>((resolve, reject) => {
            resolve([]);
        });
    }
}