import { Base } from '../types';

/**
 * This interface represents details about the device's battery
 */
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
     * The estimated time, in minutes, of how long until the battery will become empty.
     *
     * Values: -1 (calculating time), otherwise 0 or higher
     */
    timeUntilEmpty: number;

    /**
     * The hardware serial number of the battery
     */
    serial: string;

    /**
     * The health of the battery, represented as a percentage
     *
     * Values: 0% to 100%
     */
    health: number;
}

/**
 * This interface represents details about the device's memory (i.e., RAM)
 */
export interface ResourcesMemory {
    /**
     * The amount of used memory, in MB
     */
    used: number;

    /**
     * The amount of free memory, in MB
     */
    free: number;

    /**
     * The amount of memory available on the device, in MB
     */
    available: number;
}

/**
 * This interface represents details about the device's processor
 */
export interface ResourcesProcessor {
    /**
     * The average utilisation of the device's processor, taking into account all cores available.
     *
     * Value: 0% to 100%
     */
    load: number;

    /**
     * The number of cores available on the device's processor
     */
    count: number;
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
     * Details about the memory usage of the device
     */
    memory: ResourcesMemory;

    /**
     * Details about the usage of the device's processor
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

    protected defaultData(): ResourcesProperties {
        return {
            battery: {
                percentage: 0,
                state: 0,
                source: 'battery',
                timeUntilEmpty: -1,
                serial: '',
                health: 0,
            },
            memory: {
                used: 0,
                free: 0,
                available: 0
            },
            processor: {
                load: 0,
                count: 0
            },
            disk: {

            }
        }
    }
}