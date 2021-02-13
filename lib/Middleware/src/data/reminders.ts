import { Base } from '../types';

export interface ReminderEntry {
    title: string;
    due: number;
    notes: string;
    url: string;
    location: string;
    repeat: unknown; // todo; define type
    flagged: boolean;
    priority: number;
    list: RemindersList;
    subtasks: any[]; // todo; define type
}

export interface RemindersList {

}

/**
 * @ignore
 */
export interface RemindersProperties {

}

/**
 * @ignore
 */
export default class Reminders extends Base implements RemindersProperties {

    /////////////////////////////////////////////////////////
    // RemindersProperties stub implementation
    /////////////////////////////////////////////////////////

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

}