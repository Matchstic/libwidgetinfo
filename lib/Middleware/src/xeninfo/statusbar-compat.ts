import { CommunicationsProperties } from '../data/communications';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoStatusBar {

    constructor(private providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {

        // Do initial update
        this.onDataChanged(providers.get(DataProviderUpdateNamespace.Communications));

        // Monitor calendar data
        providers.get(DataProviderUpdateNamespace.Communications).observeData((newData: CommunicationsProperties) => {

            this.onDataChanged(newData);
            this.notifyXenInfoDataChanged('statusbar');
        });
    }

    onFirstUpdate() {
        this.notifyXenInfoDataChanged('statusbar');
    }

    onDataChanged(data: CommunicationsProperties) {
        (window as any).signalStrength = 0;
        (window as any).signalBars = data.telephony.bars;
        (window as any).signalName = data.telephony.operator;
        (window as any).wifiStrength = 0;
        (window as any).wifiBars = data.wifi.bars;
        (window as any).wifiName = data.wifi.ssid;
        (window as any).bluetoothOn = data.bluetooth.enabled;
        (window as any).bluetooth = data.bluetooth.enabled;
        (window as any).signalNetworkType = data.telephony.type;
    }
}