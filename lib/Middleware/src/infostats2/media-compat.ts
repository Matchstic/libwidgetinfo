import Media, {
    MediaProperties
} from '../data/media';

/**
 * @ignore
 */
export default class IS2Calendar {
    private _observers: any = {};
    private _lookupMap: any = {};
    private provider: Media;

    constructor() {
        // Map ObjC selectors to JS functions

        // System stuff - mostly unimplemented
        this._lookupMap['registerForNowPlayingNotificationsWithIdentifier:andCallback:'] = (args: any[]) => {
            this._observers[args[0]] = args[1];
        };
        this._lookupMap['unregisterForUpdatesWithIdentifier:'] = (args: any[]) => {
            delete this._observers[args[1]];
        };
        this._lookupMap['registerForTimeInformationWithIdentifier:andCallback:'] = (args: any[]) => {};
        this._lookupMap['unregisterForTimeInformationWithIdentifier:'] = (args: any[]) => {};

        this._lookupMap['skipToNextTrack']              = () => { /* not implemented */ };
        this._lookupMap['skipToPreviousTrack']          = () => { /* not implemented */ };
        this._lookupMap['togglePlayPause']              = () => { /* not implemented */ };
        this._lookupMap['play']                         = () => { /* not implemented */ };
        this._lookupMap['pause']                        = () => { /* not implemented */ };
        this._lookupMap['setVolume:withVolumeHUD: ']    = (args: any[]) => { /* not implemented */ };

        this._lookupMap['currentTrackTitle']            = () => { /* not implemented */ return ''; };
        this._lookupMap['currentTrackArtist']           = () => { /* not implemented */ return ''; };
        this._lookupMap['currentTrackAlbum']            = () => { /* not implemented */ return ''; };
        this._lookupMap['currentTrackArtwork']          = () => { /* not implemented */ return ''; };
        this._lookupMap['currentTrackArtworkBase64']    = () => { /* not implemented */ return ''; };
        this._lookupMap['currentTrackLength']           = () => { /* not implemented */ return 0; };
        this._lookupMap['elapsedTrackLength']           = () => { /* not implemented */ return 0; };
        this._lookupMap['trackNumber']                  = () => { /* not implemented */ return 0; };
        this._lookupMap['totalTrackCount']              = () => { /* not implemented */ return 0; };
        this._lookupMap['currentPlayingAppIdentifier']  = () => { /* not implemented */ return ''; };
        this._lookupMap['shuffleEnabled']               = () => { /* not implemented */ return false; };
        this._lookupMap['iTunesRadioPlaying']           = () => { /* not implemented */ return false; };
        this._lookupMap['isPlaying']                    = () => { /* not implemented */ return false; };
        this._lookupMap['hasMedia']                     = () => { /* not implemented */ return false; };
        this._lookupMap['getVolume ']                   = () => { /* not implemented */ return 0; };
    }

    public initialise(provider: Media) {
        this.provider = provider;

        this.provider.observeData((newData: MediaProperties) => {
            // Update observers so that they fetch new data
            Object.keys(this._observers).forEach((key: string) => {
                const fn = this._observers[key];

                if (fn)
                    fn();
            });
        });
    }

    public callFn(identifier: string, args: any[]) {
        const fn = this._lookupMap[identifier];
        if (fn) {
            return fn(args);
        } else {
            return undefined;
        }
    }
}