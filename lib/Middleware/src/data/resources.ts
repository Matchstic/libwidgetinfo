import { Base } from '../types';

export enum XENDBatteryStatus {
    Discharging,
    Charging,
    FullyCharged
}

/**
 * @ignore
 */
export interface ResourcesProperties {
    batteryPercentRemaining: number;
    batteryStatus: XENDBatteryStatus;

    memoryFree: number;
    memoryUsed: number;
    memoryTotal: number;

    processorUsage: number;

    diskSpaceFreeBytes: number;
    diskSpaceUsedBytes: number;
    diskSpaceTotalBytes: number;
}

export default class Resources extends Base implements ResourcesProperties {

    /////////////////////////////////////////////////////////
    // XENDRemindersProperties stub implementation
    /////////////////////////////////////////////////////////

    batteryPercentRemaining: number;
    batteryStatus: XENDBatteryStatus;

    memoryFree: number;
    memoryUsed: number;
    memoryTotal: number;

    processorUsage: number;

    diskSpaceFreeBytes: number;
    diskSpaceUsedBytes: number;
    diskSpaceTotalBytes: number;

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
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