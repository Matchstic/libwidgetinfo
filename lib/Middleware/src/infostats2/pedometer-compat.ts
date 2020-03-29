export default class IS2Pedometer {
    private _observers: any = {};
    private _lookupMap: any = {};

    constructor() {
        // Map ObjC selectors to JS functions

        // System stuff - mostly unimplemented
        this._lookupMap['registerForPedometerNotificationsWithIdentifier:andCallback:'] = (args: any[]) => {
            this._observers[args[0]] = args[1];
        };
        this._lookupMap['unregisterForUpdatesWithIdentifier:'] = (args: any[]) => {
            delete this._observers[args[1]];
        };

        this._lookupMap['numberOfSteps'] = () => { return 0; };
        this._lookupMap['distanceTravelled'] = () => { return 0; };
        this._lookupMap['userCurrentPace'] = () => { return 0; };
        this._lookupMap['userCurrentCadence'] = () => { return 0; };
        this._lookupMap['floorsAscended'] = () => { return 0; };
        this._lookupMap['floorsDescended '] = () => { return 0; };
    }

    public initialise() {
        // no-op
    }
}