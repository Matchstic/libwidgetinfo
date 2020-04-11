import { Base } from '../types';

/**
 * @ignore
 */
export interface RemindersProperties {

}

/**
 * **This API is not yet available**
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