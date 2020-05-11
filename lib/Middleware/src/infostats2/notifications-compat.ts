import IS2Base from './base';

/**
 * @ignore
 */
export default class IS2Notifications extends IS2Base {
    constructor() {
        super();
        // Map ObjC selectors to JS functions

        // System stuff - mostly unimplemented
        this._lookupMap['registerForBulletinNotificationsWithIdentifier:andCallback:'] = (args: any[]) => {
            this._observers[args[0]] = args[1];
        };
        this._lookupMap['unregisterForUpdatesWithIdentifier:'] = (args: any[]) => {
            delete this._observers[args[1]];
        };

        /* not implemented */
        this._lookupMap['notificationCountForApplication:'] = (args: any[]) => { return 0; };
        this._lookupMap['lockscreenNotificationCountForApplication:'] = (args: any[]) => { return 0; };
        this._lookupMap['lockScreenIsShowingBulletins'] = () => { return false; };
        this._lookupMap['totalNotificationCountOnLockScreenOnly:'] = (args: any[]) => { return 0; };
        this._lookupMap['notificationsForApplication:'] = (args: any[]) => { return '[]'; };
        this._lookupMap['notificationsJSONForApplication:'] = (args: any[]) => { return '[]'; };
    }

    public initialise() {
        // no-op
    }
}