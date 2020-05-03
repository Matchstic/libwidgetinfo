import System, { SystemProperties } from '../data/system';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoSystem {

    constructor(private providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {

        providers.get(DataProviderUpdateNamespace.System).observeData((newData: SystemProperties) => {
            this.onDataChanged(newData);
            this.notifyXenInfoDataChanged('system');
        });
    }

    onDataChanged(data: SystemProperties) {
        (window as any).deviceName = data.deviceName;
        (window as any).deviceType = data.deviceModelPromotional;
        (window as any).systemVersion = data.systemVersion;
        (window as any).twentyfourhour = data.isTwentyFourHourTimeEnabled;

        /* unimplemented */
        (window as any).ipAddress = '';
        (window as any).notificationShowing = false;;
    }
}