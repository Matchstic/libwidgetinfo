import { Base } from '../types';

/**
 * @ignore
 */
export interface CalendarEntry {
    title: string;
    location: string;
    allDay: boolean;
    startTimestamp: number;
    endTimestamp: number;
    calendar: CalendarMetadata;
}

/**
 * @ignore
 */
export interface CalendarMetadata {
    name: string;
    identifier: string;
    hexColor: string;
}

/**
 * @ignore
 */
export interface CalendarProperties {
    userCalendars: CalendarMetadata[];
    upcomingWeekEvents: CalendarEntry[];
}

/**
 * @ignore
 */
export default class Calendar extends Base implements CalendarProperties {

    /////////////////////////////////////////////////////////
    // CalendarProperties stub implementation
    /////////////////////////////////////////////////////////

    userCalendars: CalendarMetadata[];
    upcomingWeekEvents: CalendarEntry[];

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: CalendarProperties) => void) {
        super.observeData(callback);
    }

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
                              calendars?: CalendarMetadata[]): Promise<CalendarEntry[]> {
        return new Promise<CalendarEntry[]>((resolve, reject) => {
            resolve([]);
        });
    }
}