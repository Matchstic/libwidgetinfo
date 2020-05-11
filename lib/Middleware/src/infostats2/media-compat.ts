import Media, {
    MediaProperties
} from '../data/media';

import IS2Base from './base';

/**
 * @ignore
 */
export default class IS2Calendar extends IS2Base {
    private provider: Media;

    constructor() {
        super();
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

        this._lookupMap['skipToNextTrack']              = () => { this.provider.nextTrack(); };
        this._lookupMap['skipToPreviousTrack']          = () => { this.provider.previousTrack(); };
        this._lookupMap['togglePlayPause']              = () => { this.provider.togglePlayPause(); };
        this._lookupMap['play']                         = () => { this.provider.togglePlayPause(); };
        this._lookupMap['pause']                        = () => { this.provider.togglePlayPause(); };
        this._lookupMap['setVolume:withVolumeHUD: ']    = (args: any[]) => { this.provider.setVolume(args[0] * 100); };

        this._lookupMap['currentTrackTitle']            = () => { return this.provider.nowPlaying.title; };
        this._lookupMap['currentTrackArtist']           = () => { return this.provider.nowPlaying.artist; };
        this._lookupMap['currentTrackAlbum']            = () => { return this.provider.nowPlaying.album; };
        this._lookupMap['currentTrackArtwork']          = () => { return this.provider.nowPlaying.artwork; };
        this._lookupMap['currentTrackArtworkBase64']    = () => { return this.provider.nowPlaying.artwork; };
        this._lookupMap['currentTrackLength']           = () => { return this.provider.nowPlaying.length; };
        this._lookupMap['elapsedTrackLength']           = () => { return this.provider.nowPlaying.elapsed; };
        this._lookupMap['trackNumber']                  = () => { return this.provider.nowPlaying.number; };
        this._lookupMap['totalTrackCount']              = () => { /* not implemented */ return 0; };
        this._lookupMap['currentPlayingAppIdentifier']  = () => { return this.provider.nowPlayingApplication.identifier };
        this._lookupMap['shuffleEnabled']               = () => { return this.provider.isShuffleEnabled; };
        this._lookupMap['iTunesRadioPlaying']           = () => { /* not implemented */ return false; };
        this._lookupMap['isPlaying']                    = () => { return this.provider.isPlaying; };
        this._lookupMap['hasMedia']                     = () => { return !this.provider.isStopped; };
        this._lookupMap['getVolume ']                   = () => { return this.provider.volume / 100.0; };
    }

    public initialise(provider: Media) {
        this.provider = provider;

        this.provider.observeData((newData: MediaProperties) => {
            // Update observers so that they fetch new data
            this.notifyObservers();
        });

        this.notifyObservers();
    }
}