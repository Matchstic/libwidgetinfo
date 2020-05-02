import { Base } from '../types';

export interface ResourcesBattery {
    /**
     * The current charge level of the battery, measured in percent
     */
    percentage: number;

    /**
     * The current charge state.
     *
     * Values: 0 (discharging), 1 (charging), 2 (fully charged)
     */
    state: number;

    /**
     * Specifies whether the device is running using battery power, or AC power.
     *
     * Values: `ac` (running off AC power), `battery` (running on the internal battery)
     */
    source: string;

    /**
     * The estimated time, in minutes, of when the battery will be fully charged.
     *
     * Note: this will be always 0 if the battery `state` is not charging.
     *
     * Values: -1 (calculating time), otherwise 0 or higher
     */
    timeUntilCharged: number;

    /**
     * The estimated time, in minutes, of when the battery will become empty.
     *
     * Note: this will be always 0 if the battery `state` is charging, or is fully charged.
     *
     * Values: -1 (calculating time), otherwise 0 or higher
     */
    timeUntilEmpty: number;

    /**
     * The hardware serial number of the battery
     */
    batterySerial: string;

    /**
     * A measure of the current health status of the battery.
     *
     * Values: `Poor`, `Fair` `Good`
     */
    health: string;

    /**
     * The amount of current, measured in mAh, being supplied by the power source
     */
    current: number;
}

/**
 * @ignore
 */
export interface ResourcesMemory {

}

/**
 * @ignore
 */
export interface ResourcesProcessor {

}

/**
 * @ignore
 */
export interface ResourcesDisk {

}

/**
 * @ignore
 */
export interface ResourcesProperties {
    battery: ResourcesBattery;
    memory: ResourcesMemory;
    processor: ResourcesProcessor;
    disk: ResourcesDisk;
}

/**
 * The Resources provider gives information about hardware resources available to the device.
 *
 * This includes: battery state, memory usage, CPU usage, and so forth.
 *
 * **This provider is not yet feature-complete; the listed items below are functional**
 *
 * @example
 * <script>
 * api.resources.observeData(function (newData) {
 *              // Set some data to document elements
 *              document.getElementById('#battery-level').innerHTML = newData.battery.percentage;
 *              document.getElementById('#memory-free').innerHTML = newData.memory.free;
 * });
 * </script>
 */
export default class Resources extends Base implements ResourcesProperties {

    /////////////////////////////////////////////////////////
    // XENDRemindersProperties stub implementation
    /////////////////////////////////////////////////////////

    /**
     * Current battery state, including charge level
     */
    battery: ResourcesBattery;

    /**
     * @ignore
     */
    memory: ResourcesMemory;

    /**
     * @ignore
     */
    processor: ResourcesProcessor;

    /**
     * @ignore
     */
    disk: ResourcesDisk;

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * Data will change due to the following events:
     *
     * - Battery state changes
     * - Memory usage is updated
     * - CPU usage is updated
     * - Disk space changes
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: ResourcesProperties) => void) {
        super.observeData(callback);
    }

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    /**
     * Converts a battery status into a translated string
     * @param status Status to convert
     * @return Translated status
     */
    public batteryStatusToString(status: XENDBatteryStatus): string {
        switch (status) {
            case XENDBatteryStatus.Charging:
                return 'Charging';
            case XENDBatteryStatus.Discharging:
                return 'Discharging';
            case XENDBatteryStatus.FullyCharged:
                return 'Fully Charged';
            default:
                return '';
        }
    }


}