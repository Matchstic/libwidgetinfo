import IS2Base from './base';
import Communications, { CommunicationsProperties } from '../data/communications';

/**
 * @ignore
 */
export default class IS2Telephony extends IS2Base {
    private provider: Communications;

    constructor() {
        super();
        // Map ObjC selectors to JS functions

        this._lookupMap['phoneSignalBars']                  = () => { return this.provider.telephony.bars; };
        this._lookupMap['phoneSignalRSSI']                  = () => { return 0; };
        this._lookupMap['phoneCarrier']                     = () => { return this.provider.telephony.operator; };
        this._lookupMap['wifiEnabled']                      = () => { return this.provider.wifi.enabled; };
        this._lookupMap['wifiSignalBars']                   = () => { return this.provider.wifi.bars; };
        this._lookupMap['wifiName']                         = () => { return this.provider.wifi.ssid; };
        this._lookupMap['airplaneModeEnabled']              = () => { return this.provider.telephony.airplaneMode; };
        this._lookupMap['dataConnectionAvailableViaWiFi']   = () => { return true; };
        this._lookupMap['dataConnectionAvailable ']         = () => { return true; };
    }

    public initialise(provider: Communications) {
        this.provider = provider;

        this.provider.observeData((_: CommunicationsProperties) => {
            // Update observers so that they fetch new data
            this.notifyObservers();
        });

        this.notifyObservers();
    }
}