import IS2Base from './base';

/**
 * @ignore
 */
export default class IS2Telephony extends IS2Base {
    constructor() {
        super();
        // Map ObjC selectors to JS functions

        this._lookupMap['phoneSignalBars']                  = () => { /* not implemented */ return 0; };
        this._lookupMap['phoneSignalRSSI']                  = () => { /* not implemented */ return 0; };
        this._lookupMap['phoneCarrier']                     = () => { /* not implemented */ return ''; };
        this._lookupMap['wifiEnabled']                      = () => { /* not implemented */ return true; };
        this._lookupMap['wifiSignalBars']                   = () => { /* not implemented */ return 0; };
        this._lookupMap['wifiName']                         = () => { /* not implemented */ return ''; };
        this._lookupMap['airplaneModeEnabled']              = () => { /* not implemented */ return false; };
        this._lookupMap['dataConnectionAvailableViaWiFi']   = () => { /* not implemented */ return true; };
        this._lookupMap['dataConnectionAvailable ']         = () => { /* not implemented */ return true; };
    }

    public initialise() {
        // no-op
    }
}