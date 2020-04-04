import XENDWeatherProvider, {
    XENDWeatherProperties
} from '../data/weather';

export default class IS2Location {
    private _observers: any = {};
    private _lookupMap: any = {};

    // Weather provider has location information
    private provider: XENDWeatherProvider;

    constructor() {
        // Map ObjC selectors to JS functions

        // System stuff
        this._lookupMap['registerForLocationNotificationsWithIdentifier:andCallback:'] = (args: any[]) => {
            this._observers[args[0]] = args[1];
        };
        this._lookupMap['unregisterForUpdatesWithIdentifier:'] = (args: any[]) => {
            delete this._observers[args[1]];
        };
        this._lookupMap['requestUpdateToLocationData']                      = () => {}; // unused
        this._lookupMap['setLocationUpdateDistanceInterval:forRequester:']  = (args: any[]) => {}; // unused
        this._lookupMap['removeRequesterForLocationDistanceInterval:']      = (args: any[]) => {}; // unused
        this._lookupMap['setLocationUpdateAccuracy:forRequester:']          = (args: any[]) => {}; // unused
        this._lookupMap['removeRequesterForLocationAccuracy:']              = (args: any[]) => {}; // unused
        this._lookupMap['isLocationServicesEnabled']                        = () => { return true; }; // faked

        // Data points

        this._lookupMap['currentLatitude']                  = () => { return this.provider.data.metadata.location.latitude; };
        this._lookupMap['currentLongitude']                 = () => { return this.provider.data.metadata.location.longitude; };
        this._lookupMap['cityForCurrentLocation']           = () => { return this.provider.data.metadata.address.city; };
        this._lookupMap['neighbourhoodForCurrentLocation']  = () => { return this.provider.data.metadata.address.neighbourhood; };
        this._lookupMap['stateForCurrentLocation']          = () => { return this.provider.data.metadata.address.state; };
        this._lookupMap['countyForCurrentLocation']         = () => { return this.provider.data.metadata.address.county; };
        this._lookupMap['countryForCurrentLocation']        = () => { return this.provider.data.metadata.address.country; };
        this._lookupMap['ISOCountryCodeForCurrentLocation'] = () => { return this.provider.data.metadata.address.countryISOCode; };
        this._lookupMap['postCodeForCurrentLocation']       = () => { return this.provider.data.metadata.address.postalCode; };
        this._lookupMap['streetForCurrentLocation']         = () => { return this.provider.data.metadata.address.street; };
        this._lookupMap['houseNumberForCurrentLocation ']   = () => { return this.provider.data.metadata.address.house; };
    }

    public initialise(provider: XENDWeatherProvider) {
        this.provider = provider;

        this.provider.observeData((newData: XENDWeatherProperties) => {
            // Update observers so that they fetch new data
            Object.keys(this._observers).forEach((key: string) => {
                const fn = this._observers[key];

                if (fn)
                    fn();
            });
        });
    }
}