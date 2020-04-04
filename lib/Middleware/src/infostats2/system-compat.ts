import XENDSystemProvider from '../data/system';

/**
 * @ignore
 */
export default class IS2System {
    private _lookupMap: any = {};
    private provider: XENDSystemProvider;

    constructor() {
        // Map ObjC selectors to JS functions

        this._lookupMap['batteryPercent']               = () => { /* not implemented */ return 0; };
        this._lookupMap['batteryState']                 = () => { /* not implemented */ return ''; };
        this._lookupMap['batteryStateAsInteger']        = () => { /* not implemented */ return 0; };
        this._lookupMap['ramFree']                      = () => { /* not implemented */ return 0; };
        this._lookupMap['ramUsed']                      = () => { /* not implemented */ return 0; };
        this._lookupMap['ramAvailable']                 = () => { /* not implemented */ return 0; };
        this._lookupMap['cpuUsage']                     = () => { /* not implemented */ return 0; };
        this._lookupMap['freeDiskSpaceInFormat:']       = (args: any[]) => { /* not implemented */ return 0; };
        this._lookupMap['totalDiskSpaceInFormat:']      = (args: any[]) => { /* not implemented */return 0; };
        this._lookupMap['networkSpeedUp']               = () => { /* not implemented */ return 0; };
        this._lookupMap['networkSpeedDown']             = () => { /* not implemented */ return 0; };
        this._lookupMap['networkSpeedUpAutoConverted']  = () => { /* not implemented */ return 0; };
        this._lookupMap['networkSpeedDownAutoConverted'] = () => { /* not implemented */ return 0; };
        this._lookupMap['deviceName']                   = () => { return this.provider.deviceName; };
        this._lookupMap['deviceType']                   = () => { return this.provider.deviceType; };
        this._lookupMap['deviceModel']                  = () => { return this.provider.deviceModel; };
        this._lookupMap['deviceModelHumanReadable']     = () => { return this.provider.deviceModelPromotional; };
        this._lookupMap['deviceDisplayHeight']          = () => { return this.provider.deviceDisplayHeight; };
        this._lookupMap['deviceDisplayWidth']           = () => { return this.provider.deviceDisplayWidth; };
        this._lookupMap['isDeviceIn24Time']             = () => { return this.provider.isTwentyFourHourTimeEnabled; };
        this._lookupMap['isLockscreenPasscodeVisible']  = () => { /* not implemented */ return false; };

        this._lookupMap['takeScreenshot']               = () => { this.provider.invokeScreenshot(); };
        this._lookupMap['lockDevice']                   = () => { this.provider.lockDevice(); };
        this._lookupMap['openSwitcher']                 = () => { this.provider.openApplicationSwitcher(); };
        this._lookupMap['openApplication:']             = (args: any[]) => { /* not implemented */ };
        this._lookupMap['openSiri']                     = () => { this.provider.openSiri(); };
        this._lookupMap['respring']                     = () => { this.provider.respringDevice(); };
        this._lookupMap['reboot']                       = () => { /* not implemented */ };
        this._lookupMap['vibrateDevice']                = () => { this.provider.vibrateDevice(); };
        this._lookupMap['vibrateDeviceForTimeLength:']  = () => { this.provider.vibrateDevice(); };

        this._lookupMap['getBrightness']                = () => { /* not implemented */ return 1; };
        this._lookupMap['setBrightness:']               = (args: any[]) => { /* not implemented */ };
        this._lookupMap['getLowPowerMode']              = () => { /* not implemented */ return false; };
        this._lookupMap['setLowPowerMode:']             = (args: any[]) => { /* not implemented */ };

        const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        this._lookupMap['getApplicationIconForBundleIdentifier:'] = (args: any[]) => { /* not implemented */ return emptyImage; };
        this._lookupMap['getApplicationIconForBundleIdentifierBase64:'] = (args: any[]) => { /* not implemented */ return emptyImage; };
    }

    public initialise(provider: XENDSystemProvider) {
        this.provider = provider;
    }
}