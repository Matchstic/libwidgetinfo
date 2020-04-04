import { XENDBaseProvider } from '../types';

export enum XENDBatteryStatus {
    Discharging,
    Charging,
    FullyCharged
}

export interface XENDResourcesProperties {
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

export default class XENDResourcesProvider extends XENDBaseProvider implements XENDResourcesProperties {

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