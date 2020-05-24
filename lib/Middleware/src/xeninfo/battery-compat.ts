import Resources, { ResourcesProperties } from '../data/resources';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoBattery {

    constructor(private providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {

        // Do initial update
        this.onDataChanged(providers.get(DataProviderUpdateNamespace.Resources));

        // Monitor resources data
        providers.get(DataProviderUpdateNamespace.Resources).observeData((newData: ResourcesProperties) => {

            this.onDataChanged(newData);
            this.notifyXenInfoDataChanged('battery');
        });
    }

    onFirstUpdate() {
        this.notifyXenInfoDataChanged('battery');
    }

    onDataChanged(data: ResourcesProperties) {
        // Update battery and memory info

        (window as any).batteryPercent = data.battery.percentage;
        (window as any).batteryCharging = data.battery.state !== 0 ? 1 : 0;
        (window as any).ramFree = data.memory.free;
        (window as any).ramUsed = data.memory.used;
        (window as any).ramAvailable = data.memory.free + data.memory.used;
        (window as any).ramPhysical = data.memory.available;
    }
}