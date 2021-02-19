import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoEvents {

    constructor(private providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {
        this.setupFakeData();
    }

    onFirstUpdate() {
        this.notifyXenInfoDataChanged('alarms');
    }

    setupFakeData() {
        (window as any).alarmString = '';
        (window as any).alarmTime = '';
        (window as any).alarmHour = '';
        (window as any).alarmMinute = '';
        (window as any).alarms = [];
    }
}