import { Base, DataProviderUpdateNamespace } from '../types';

/**
 * Represents an entry in the user's calendar
 */
export interface CalendarEvent {
    /**
     * Unique ID of the event
     */
    id: string;

    /**
     * Title of the event, defined by the user.
     * This is pre-escaped for you.
     */
    title: string;

    /**
     * Location of the event, defined by the user.
     *
     * This is pre-escaped for you, and will be the empty string
     * if it is not present.
     */
    location: string;

    /**
     * A flag denoting if this event spans the entire day
     */
    allDay: boolean;

    /**
     * The timestamp at which this event starts, in milliseconds
     */
    start: number;

    /**
     * The timestamp at which this event ends, in milliseconds
     */
    end: number;

    /**
     * The calendar associated with this event
     */
    calendar: CalendarMetadata;
}

/**
 * Represents a calendar in the user's Calendar app
 */
export interface CalendarMetadata {
    /**
     * Unique ID of the calendar
     */
    id: string;

    /**
     * Name of the calendar, as displayed in-app.
     * This is pre-escaped for you.
     */
    name: string;

    /**
     * Hex string representation of a color associated with this
     * calendar
     *
     * e.g. #000000
     */
    color: string;
}

/**
 * The possible parameters you can pass when creating a new event
 */
export interface CalendarEventCreateParameters {
    /**
     * The title of the new event
     */
    title: string;

    /**
     * [optional] Location of the new event
     * Default is empty
     */
    location?: string;

    /**
     * [optional] Start time of the new event in milliseconds
     * Default is now
     */
    start?: number;

    /**
     * [optional] End time of the new event in milliseconds
     * Default is one hour after the start time
     */
    end?: number;

    /**
     * [optional] Whether the new event spans all day
     * Default is false
     */
    allDay?: boolean;

    /**
     * [optional] The calendar to add this event onto
     * Default is whichever calendar is set as default
     */
    calendarId?: string;
}

/**
 * @ignore
 */
export interface CalendarProperties {
    /**
     * An array of calendars the user currently has enabled
     */
    calendars: CalendarMetadata[];

    /**
     * The current list of events happening in the next 7 days
     */
    upcomingWeekEvents: CalendarEvent[];
}

/**
 * The Calendar provider gives you access to events the user has setup in the
 * stock Calendar application.
 *
 * You can request a list of events occuring in specific timeframes, optionally filtered by
 * the calendars available in-app. Additionally, you can create new events or delete existing
 * ones.
 *
 * <b>Available in Xen HTML 2.0~beta7 or newer</b>
 */
export default class Calendar extends Base implements CalendarProperties {

    /////////////////////////////////////////////////////////
    // CalendarProperties stub implementation
    /////////////////////////////////////////////////////////

    calendars: CalendarMetadata[];
    upcomingWeekEvents: CalendarEvent[];

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
     * Fetches a list of events occuring between the start and end timestamps.
     *
     * You can optionally pass in a list of calendars to filter results to.
     *
     * The return type is a Promise, which either resolves to an array of {@link CalendarEvent}, or
     * rejects.
     *
     * @example
     *
     * <script>
     * const oneHour = 60 * 60 * 1000;
     * api.calendar.fetch(Date.now(), Date.now() + oneHour).then((data) => {
     *     // data is an array of events
     *     console.log(data);
     * }).catch((error) => {
     *     // Handle error when fetching events
     * });
     * </script>
     *
     * @param startTimestamp Start timestamp in milliseconds
     * @param endTimestamp End timestamp in milliseconds
     * @param calendars [optional] List of calendars to filter on
     */
    public async fetch(startTimestamp: number, endTimestamp: number,
                              calendars?: CalendarMetadata[]): Promise<CalendarEvent[]> {
        const ids = calendars ? calendars.map((calendar: CalendarMetadata) => {
            return calendar.id;
        }) : [];

        return new Promise<CalendarEvent[]>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Calendar,
                functionDefinition: 'fetch',
                data: {
                    start: startTimestamp,
                    end: endTimestamp,
                    ids
                }
            }, (data: { result: CalendarEvent[], error?: number }) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.result);
                }
            });
        });
    }

    /**
     * Creates a new calendar event for the given parameters
     *
     * The return type is a Promise, which either resolves to the new event's ID, or
     * rejects
     *
     * @example
     *
     * <script>
     * const oneHour = 60 * 60 * 1000;
     * api.calendar.create({
     *     title: 'Test event',
     *     start: Date.now(),
     *     end: Date.now() + oneHour
     * }).then((success) => {
     *     console.log(success);
     * }).catch(() => {
     *     // Handle error when creating the event
     * });
     * </script>
     *
     * @param params An object that matches {@link CalendarEventCreateParameters}
     */
    public async create(params: CalendarEventCreateParameters): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Calendar,
                functionDefinition: 'create',
                data: params
            }, (data: { id: string, error?: number }) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.id);
                }
            });
        });
    }

    /**
     * Deletes an event from the user's calendar
     *
     * The return type is a Promise, which either resolves to a boolean stating if it was successful, or
     * rejects
     *
     * @example
     *
     * <script>
     * // Fetch example event from the list for this week
     * const event = api.calendar.upcomingWeekEvents[0];
     *
     * api.calendar.delete(event.id).then((success) => {
     *     console.log(success);
     * }).catch(() => {
     *     // Handle error when deleting the event
     * });
     * </script>
     *
     * @param id The ID of the event to delete
     */
    public async delete(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Calendar,
                functionDefinition: 'delete',
                data: {
                    id
                }
            }, (data: { success: boolean, error?: number }) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.success);
                }
            });
        });
    }

    /**
     * Looks up an event by ID
     *
     * The return type is a Promise, which either resolves to an {@link CalendarEvent}, null (if not exists), or
     * rejects
     *
     * @example
     *
     * <script>
     * // Example event ID
     * const id = 'abc';
     *
     * api.calendar.lookupEvent(id).then((event) => {
     *     console.log(event.title);
     * }).catch(() => {
     *     // Handle error
     * });
     * </script>
     *
     * @param id Event ID to lookup
     */
    public async lookupEvent(id: string): Promise<CalendarEvent> {
        return new Promise<CalendarEvent>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Calendar,
                functionDefinition: 'lookupEvent',
                data: {
                    id
                }
            }, (data: { event: CalendarEvent, error?: number }) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.event || null);
                }
            });
        });
    }

    /**
     * Looks up a calendar by ID
     *
     * The return type is a Promise, which either resolves to a {@link CalendarMetadata}, null (if not exists), or
     * rejects
     *
     * @example
     *
     * <script>
     * // Example calendar ID
     * const id = 'abc';
     *
     * api.calendar.lookupCalendar(id).then((calendar) => {
     *     console.log(calendar.name);
     * }).catch(() => {
     *     // Handle error
     * });
     * </script>
     *
     * @param id Calendar ID to lookup
     */
    public async lookupCalendar(id: string): Promise<CalendarMetadata> {
        return new Promise<CalendarMetadata>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Calendar,
                functionDefinition: 'lookupCalendar',
                data: {
                    id
                }
            }, (data: { calendar: CalendarMetadata, error?: number }) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.calendar || null);
                }
            });
        });
    }

    protected defaultData(): CalendarProperties {
        return {
            upcomingWeekEvents: [],
            calendars: []
        }
    }
}