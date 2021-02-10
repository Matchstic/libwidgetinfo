import System from '../data/system';
import Resources from '../data/resources';

import IS2Base from './base';

/**
 * @ignore
 */
export default class IS2System extends IS2Base {
    private systemProvider: System;
    private resourcesProvider: Resources;

    constructor() {
        super();
        // Map ObjC selectors to JS functions

        this._lookupMap['batteryPercent']               = () => { return this.resourcesProvider.battery.percentage };
        this._lookupMap['batteryState']                 = () => {
            switch (this.resourcesProvider.battery.state) {
                case 0: return 'Unplugged';
                case 1: return 'Charging';
                case 2: return 'Fully Charged'
                default:
                    return '';
            }
        };
        this._lookupMap['batteryStateAsInteger']        = () => { return this.resourcesProvider.battery.state + 1 };
        this._lookupMap['ramFree']                      = () => { return this.resourcesProvider.memory.free };
        this._lookupMap['ramUsed']                      = () => { return this.resourcesProvider.memory.used };
        this._lookupMap['ramAvailable']                 = () => { return this.resourcesProvider.memory.available };
        this._lookupMap['cpuUsage']                     = () => { return this.resourcesProvider.processor.load };
        this._lookupMap['freeDiskSpaceInFormat:']       = (args: any[]) => { /* not implemented */ return 0; };
        this._lookupMap['totalDiskSpaceInFormat:']      = (args: any[]) => { /* not implemented */return 0; };
        this._lookupMap['networkSpeedUp']               = () => { /* not implemented */ return 0; };
        this._lookupMap['networkSpeedDown']             = () => { /* not implemented */ return 0; };
        this._lookupMap['networkSpeedUpAutoConverted']  = () => { /* not implemented */ return 0; };
        this._lookupMap['networkSpeedDownAutoConverted'] = () => { /* not implemented */ return 0; };
        this._lookupMap['deviceName']                   = () => { return this.systemProvider.deviceName; };
        this._lookupMap['deviceType']                   = () => { return this.systemProvider.deviceType; };
        this._lookupMap['deviceModel']                  = () => { return this.systemProvider.deviceModel; };
        this._lookupMap['deviceModelHumanReadable']     = () => { return this.systemProvider.deviceModelPromotional; };
        this._lookupMap['deviceDisplayHeight']          = () => { return this.systemProvider.deviceDisplayHeight; };
        this._lookupMap['deviceDisplayWidth']           = () => { return this.systemProvider.deviceDisplayWidth; };
        this._lookupMap['isDeviceIn24Time']             = () => { return this.systemProvider.isTwentyFourHourTimeEnabled; };
        this._lookupMap['isLockscreenPasscodeVisible']  = () => { /* not implemented */ return false; };

        this._lookupMap['takeScreenshot']               = () => { this.systemProvider.invokeScreenshot(); };
        this._lookupMap['lockDevice']                   = () => { this.systemProvider.lockDevice(); };
        this._lookupMap['openSwitcher']                 = () => { this.systemProvider.openApplicationSwitcher(); };

        // TODO: Use Applications provider for this
        this._lookupMap['openApplication:']             = (args: any[]) => { /* not implemented */ };
        this._lookupMap['openSiri']                     = () => { this.systemProvider.openSiri(); };
        this._lookupMap['respring']                     = () => { this.systemProvider.respringDevice(); };
        this._lookupMap['reboot']                       = () => { /* not implemented */ };
        this._lookupMap['vibrateDevice']                = () => { this.systemProvider.vibrateDevice(); };
        this._lookupMap['vibrateDeviceForTimeLength:']  = () => { this.systemProvider.vibrateDevice(); };

        this._lookupMap['getBrightness']                = () => { /* not implemented */ return 1; };
        this._lookupMap['setBrightness:']               = (args: any[]) => { /* not implemented */ };
        this._lookupMap['getLowPowerMode']              = () => { return this.systemProvider.isLowPowerModeEnabled; };
        this._lookupMap['setLowPowerMode:']             = (args: any[]) => { /* not implemented */ };

        const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        this._lookupMap['getApplicationIconForBundleIdentifier:'] = (args: any[]) => { /* not implemented */ return emptyImage; };
        this._lookupMap['getApplicationIconForBundleIdentifierBase64:'] = (args: any[]) => { /* not implemented */ return emptyImage; };
    }

    public initialise(systemProvider: System, resourcesProvider: Resources) {
        this.systemProvider = systemProvider;
        this.resourcesProvider = resourcesProvider;
    }
}