import Weather, {
    WeatherProperties
} from '../data/weather';

import IS2Base from './base';

/**
 * @ignore
 */
export default class IS2Location extends IS2Base {
    // Weather provider has location information
    private provider: Weather;

    constructor() {
        super();
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

        this._lookupMap['currentLatitude']                  = () => { return this.provider.metadata.location.latitude; };
        this._lookupMap['currentLongitude']                 = () => { return this.provider.metadata.location.longitude; };
        this._lookupMap['cityForCurrentLocation']           = () => { return this.provider.metadata.address.city; };
        this._lookupMap['neighbourhoodForCurrentLocation']  = () => { return this.provider.metadata.address.neighbourhood; };
        this._lookupMap['stateForCurrentLocation']          = () => { return this.provider.metadata.address.state; };
        this._lookupMap['countyForCurrentLocation']         = () => { return this.provider.metadata.address.county; };
        this._lookupMap['countryForCurrentLocation']        = () => { return this.provider.metadata.address.country; };
        this._lookupMap['ISOCountryCodeForCurrentLocation'] = () => { return this.provider.metadata.address.countryISOCode; };
        this._lookupMap['postCodeForCurrentLocation']       = () => { return this.provider.metadata.address.postalCode; };
        this._lookupMap['streetForCurrentLocation']         = () => { return this.provider.metadata.address.street; };
        this._lookupMap['houseNumberForCurrentLocation ']   = () => { return this.provider.metadata.address.house; };
    }

    public initialise(provider: Weather) {
        this.provider = provider;

        this.provider.observeData((newData: WeatherProperties) => {
            // Update observers so that they fetch new data
            this.notifyObservers();
        });

        this.notifyObservers();
    }
}