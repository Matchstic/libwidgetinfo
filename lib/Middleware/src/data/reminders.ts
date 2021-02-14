import { Base, DataProviderUpdateNamespace } from '../types';

/**
 * Represents a reminder entry in the user's Reminders app
 */
export interface ReminderEntry {
    /**
     * Unique ID of the reminder
     */
    id: string;

    /**
     * User-facing title of the reminder
     *
     * This is pre-escaped for you
     */
    title: string;

    /**
     * The start timestamp for this reminder. i.e., when it is considered
     * to be 'active'.
     *
     * If the user has not set this, it will be -1
     */
    start: number;

    /**
     * The due date timestamp for this reminder.
     *
     * If the user has not set this, it will be -1
     */
    due: number;

    /**
     * A flag stating whether the reminder is overdue; i.e., it has
     * not been completed before the due date
     */
    overdue: boolean;

    /**
     * Priority for this reminder.
     *
     * Possible values:
     * - 0: None
     * - 1: Low
     * - 2: Medium
     * - 3: High
     */
    priority: number;

    /**
     * A flag for if the reminder is marked as completed
     */
    completed: boolean;

    /**
     * Any notes associated with the reminder
     */
    notes: string;

    /**
     * Any URL associated with the reminder
     */
    url: string;

    /**
     * The list this reminder belongs to
     */
    list: RemindersList;
}

/**
 * A set of parameters to pass when creating a new reminder
 */
export interface ReminderCreateParameters {
    /**
     * The title for the new reminder
     */
    title: string;

    /**
     * [optional] The date at which the reminder should start to be considered 'active'
     *
     * Default value is either the due date if set, or no start date.
     */
    start?: number;

    /**
     * [optional] The date at which the reminder should be completed by
     *
     * Default value is no due date.
     */
    due?: number;

    /**
     * [optional] The priority the reminder should have
     *
     * Possible values:
     * - 0: None
     * - 1: Low
     * - 2: Medium
     * - 3: High
     *
     * Default value is 0.
     */
    priority?: number;
}

/**
 * Represents metadata about a list which reminders are added onto
 */
export interface RemindersList {
    /**
     * Unique ID of the list
     */
    id: string;

    /**
     * Name of the list, as displayed in-app.
     * This is pre-escaped for you.
     */
    name: string;

    /**
     * Hex string representation of a color associated with this
     * list
     *
     * e.g. #000000
     */
    color: string;
}

/**
 * @ignore
 */
export interface RemindersProperties {
    lists: RemindersList[];
    pending: ReminderEntry[];
}

/**
 * @ignore
 */
export default class Reminders extends Base implements RemindersProperties {

    /////////////////////////////////////////////////////////
    // RemindersProperties stub implementation
    /////////////////////////////////////////////////////////

    /**
     * The set of lists that reminders can be added onto
     */
    lists: RemindersList[];

    /**
     * A list of reminders that are currently pending completion.
     */
    pending: ReminderEntry[];

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: RemindersProperties) => void) {
        super.observeData(callback);
    }

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    protected defaultData(): RemindersProperties {
        return {
            pending: [],
            lists: []
        }
    }

    /**
     * Fetches a list of reminders occuring between the start and end timestamps. You
     * are required to specify whether you want a list of completed or pending reminders
     * within that timeframe.
     *
     * You can optionally pass in an array of lists to filter results.
     *
     * The return type is a Promise, which either resolves to an array of {@link ReminderEntry}, or
     * rejects.
     *
     * @example
     *
     * <script>
     * const oneHour = 60 * 60 * 1000;
     * api.reminders.fetch(Date.now() - oneHour, Date.now(), true).then((data) => {
     *     // data is an array of reminders that are marked completed in the past hour
     *     console.log(data);
     * }).catch((error) => {
     *     // Handle error when fetching events
     * });
     * </script>
     *
     * @param start Start timestamp in milliseconds
     * @param end End timestamp in milliseconds
     * @param completedState A flag to fetch completed or pending reminders
     * @param lists [optional] Array of lists to filter results on
     */
    public async fetch(start: number, end: number, completedState: boolean,
        lists?: RemindersList[]): Promise<ReminderEntry[]> {

        const ids = lists ? lists.map((calendar: RemindersList) => {
            return calendar.id;
        }) : [];

        return new Promise<ReminderEntry[]>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Reminders,
                functionDefinition: 'fetch',
                data: {
                    start,
                    end,
                    completedState,
                    ids
                }
            }, (data: { result: ReminderEntry[], error?: number }) => {
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
     * Creates a new reminder for the given parameters
     *
     * The return type is a Promise, which either resolves to the new reminder's ID, or
     * rejects
     *
     * @example
     *
     * <script>
     * const oneHour = 60 * 60 * 1000;
     * api.reminder.create({
     *     title: 'Test reminder',
     *     due: Date.now(),
     *     priority: 2
     * }).then((success) => {
     *     console.log(success);
     * }).catch(() => {
     *     // Handle error when creating the reminder
     * });
     * </script>
     *
     * @param params An object that matches {@link ReminderCreateParameters}
     */
    public async create(params: ReminderCreateParameters): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Reminders,
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
     * Updates the completed state of a reminder with the provided state.
     *
     * The return type is a Promise, which either resolves to a boolean stating if it was successful, or
     * rejects
     *
     * @param id ID of the reminder to update
     * @param state New state to apply
     */
    public async markCompleted(id: string, state: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Reminders,
                functionDefinition: 'markCompleted',
                data: {
                    id,
                    state
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
     * Deletes the specified reminder
     *
     * The return type is a Promise, which either resolves to a boolean stating if it was successful, or
     * rejects
     *
     * @example
     *
     * <script>
     * // Fetch example reminder from the pending list
     * const reminder = api.reminders.pending[0];
     *
     * api.reminders.delete(reminder.id).then((success) => {
     *     console.log(success);
     * }).catch(() => {
     *     // Handle error when deleting
     * });
     * </script>
     *
     * @param id The ID of the reminder to delete
     */
    public async delete(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Reminders,
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
     * Looks up a reminder by ID
     *
     * The return type is a Promise, which either resolves to an {@link ReminderEntry}, null (if not exists), or
     * rejects
     *
     * @example
     *
     * <script>
     * // Example ID
     * const id = 'abc';
     *
     * api.reminders.lookupReminder(id).then((reminder) => {
     *     console.log(reminder.title);
     * }).catch(() => {
     *     // Handle error
     * });
     * </script>
     *
     * @param id Reminder ID to lookup
     */
    public async lookupReminder(id: string): Promise<ReminderEntry> {
        return new Promise<ReminderEntry>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Reminders,
                functionDefinition: 'lookupReminder',
                data: {
                    id
                }
            }, (data: { reminder: ReminderEntry, error?: number }) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.reminder || null);
                }
            });
        });
    }

    /**
     * Looks up list metadata
     *
     * The return type is a Promise, which either resolves to a {@link RemindersList}, null (if not exists), or
     * rejects
     *
     * @example
     *
     * <script>
     * // Example ID
     * const id = 'abc';
     *
     * api.reminders.lookupList(id).then((list) => {
     *     console.log(list.name);
     * }).catch(() => {
     *     // Handle error
     * });
     * </script>
     *
     * @param id List ID to lookup
     */
    public async lookupCalendar(id: string): Promise<RemindersList> {
        return new Promise<RemindersList>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Reminders,
                functionDefinition: 'lookupList',
                data: {
                    id
                }
            }, (data: { list: RemindersList, error?: number }) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.list || null);
                }
            });
        });
    }
}