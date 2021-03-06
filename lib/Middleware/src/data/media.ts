import { Base, DataProviderUpdateNamespace } from '../types';
import { ApplicationMetadata } from './applications';

/**
 * @ignore
 */
export interface MediaLibrary {
    artists: MediaLibraryArtist[];
    albums: MediaLibraryAlbum[];
}

/**
 * @ignore
 */
export interface MediaLibraryAlbum {
    id: string; // Used to reference the album to load tracks
    title: string;
    artwork: string; // URL of the album artwork, loaded by the native side. May be an empty string, if so, no artwork
    trackCount: number;
}

/**
 * @ignore
 */
export interface MediaLibraryArtist {
    id: string; // Used to reference the artist to load albums
    name: string;
}

/**
 * Different media sources may support different sets of actions. For example,
 * you cannot skip music on a radio station.
 */
export interface MediaSupportedActions {
    /**
     * If enabled, the user can skip between tracks, and set the current elapsed time.
     */
    skip: boolean;

    /**
     * If enabled, the users can jump 15 seconds ahead in the current track.
     */
    skipFifteenSeconds: boolean;

    /**
     * If enabled, the users can rewind by 15 seconds in the current track.
     */
    goBackFifteenSeconds: boolean;
}

/**
 * This interface represents a media track, including music videos. Be aware that not all fields will
 * always have data; not all apps report the same level of detail.
 */
export interface MediaTrack {
    /**
     * Internal usage only
     * @ignore
     */
    id: string;

    /**
     * The title of the track
     */
    title: string;

    /**
     * The name of the album this track belongs to, if available
     */
    album: string;

    /**
     * The artist this track was created by, if available
     */
    artist: string;

    /**
     * A URL to the track's artwork, intended to be directly set to the `src` attribute of an `img` tag.
     *
     * If it is an empty string (`""`), then there is no artwork available.
     */
    artwork: string;

    /**
     * The composer of the track, if available
     */
    composer: string;

    /**
     * The genre of the track, if available
     */
    genre: string;

    /**
     * The length of the track, measured in seconds.
     *
     * NOTE: This may be reported as 0 in some cases, if the playing application doesn't make this information available
     *
     * NOTE: This may also be reported as negative, such as when streaming media over AirPlay. This can be assumed to be representative of a "buffering" state.
     */
    length: number;

    /**
     * The track number on its corresponding album, starting from 1
     */
    number: number;

    /**
     * The elapsed playback time, measured in seconds. This is only available on the currently playing track
     *
     * NOTE: This may be reported as 0 in some cases, if the playing application doesn't make this information available.
     * It may also be reported as negative, such as when streaming media over AirPlay. This can be assumed to be representative of a "buffering" state.
     */
    elapsed: number; // available only on the current track
}

// Always keep as ignore
/**
 * @ignore
 */
export interface MediaProperties {
    nowPlaying: MediaTrack;
    queue: MediaTrack[]; // Only the next 15 tracks, need to provide total queue length too

    isPlaying: boolean;
    isStopped: boolean;
    isShuffleEnabled: boolean;

    volume: number;
    nowPlayingApplication: ApplicationMetadata;

    supportedActions: MediaSupportedActions;

    // internal only
    _elapsedChangedTime: number;
}

/**
 * The Media provider brings together data about any currently playing media on the user's device.
 *
 * It provides access to everything available to the stock "Now Playing" widget of the Control Centre. This includes artwork, track title, and so forth.
 *
 * Also provided are a few utility functions, such as:
 * - "Seeking" within the current track
 * - Changing play/pause state
 * - Skipping forward or backwards between tracks
 *
 * You can register for an update timer, which notifies your code when the `elapsed` time of the current track changes.
 */
export default class Media extends Base implements MediaProperties {

    private volumeSetDebouncer: any = null;
    private seekDebouncer: any = null;
    private elapsedTimeObservers = [];

    // Elapsed time handling
    private elapsedInterval: any = null;
    private elapsedTimeSeed: number = 0;

    // NOTE: Don't rely on native layer to push through elapsed time
    // It'll come through on pause/play etc, but need to manually run a timer here to update
    // observers of it - likely with its own observer array?

    /////////////////////////////////////////////////////////
    // MediaProperties stub implementation
    /////////////////////////////////////////////////////////

    /**
     * Specifies details about the currently playing track.
     */
    nowPlaying: MediaTrack;

    /**
     * Provides a list of the next few tracks that will be played.
     *
     * This is only populated if the playing application supports it. Otherwise, it's an empty list.
     *
     * NOTE: Information is only available up to the next 15 tracks.
     *
     * @ignore
     */
    queue: MediaTrack[];

    /**
     * Specifies whether the user has currently paused playback or not.
     */
    isPlaying: boolean;

    /**
     * Specifies whether playback is actually possible right now.
     *
     * For example, this will be `false` when the user closes the currently playing app from the App Switcher.
     */
    isStopped: boolean;

    /**
     * @ignore
     */
    isShuffleEnabled: boolean;

    /**
     * Specifies the current volume used for audio output.
     *
     * Value: 0% to 100%
     */
    volume: number;

    /**
     * Provides details about the application that is currently playing media
     */
    nowPlayingApplication: ApplicationMetadata;

    /**
     * Provides details about what actions are currently supported by the playing application.
     */
    supportedActions: MediaSupportedActions;

    /**
     * @ignore
     */
    _elapsedChangedTime: number;

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: MediaProperties) => void) {
        super.observeData(callback);
    }

    /**
     * Register a function that gets called whenever elapsed time of the current track changes.
     *
     * This automatically handles pause/play for you.
     *
     * The current elapsed time (in seconds) is provided as the parameter to your callback function.
     *
     * @param callback A callback that is notified whenever the elapsed time changes. You can expect it to be called once a second when media is playing.
     *
     * @example
     * api.media.observeElapsedTime(function(newElapsedTime) {
     *               // Update UI with new elapsed time value
     * });
     */
    public observeElapsedTime(callback: (elapsedTime: number) => void) {
        this.elapsedTimeObservers.push(callback);
    }

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    /**
     * Toggles play/pause of the current media item.
     *
     * @example
     * api.media.togglePlayPause();
     */
    public togglePlayPause(): void {
        this.connection.sendNativeMessage({
            namespace: DataProviderUpdateNamespace.Media,
            functionDefinition: 'togglePlayPause',
            data: {}
        });
    }

    /**
     * Advances playback to the next media item, if possible.
     *
     * @example
     * api.media.nextTrack();
     */
    public nextTrack(): void {
        this.connection.sendNativeMessage({
            namespace: DataProviderUpdateNamespace.Media,
            functionDefinition: 'nextTrack',
            data: {}
        });
    }

    /**
     * Changes playback to the previous media item, if possible.
     *
     * @example
     * api.media.previousTrack();
     */
    public previousTrack(): void {
        this.connection.sendNativeMessage({
            namespace: DataProviderUpdateNamespace.Media,
            functionDefinition: 'previousTrack',
            data: {}
        });
    }

    /**
     * Toggles the current shuffle state; only available for music playback
     *
     * @example
     * api.media.toggleShuffle();
     */
    public toggleShuffle(): void {
        this.connection.sendNativeMessage({
            namespace: DataProviderUpdateNamespace.Media,
            functionDefinition: 'toggleShuffle',
            data: {}
        });
    }

    /**
     * Toggles the current repeat state; only available for music playback
     *
     * @example
     * api.media.toggleRepeat();
     */
    public toggleRepeat(): void {
        this.connection.sendNativeMessage({
            namespace: DataProviderUpdateNamespace.Media,
            functionDefinition: 'toggleRepeat',
            data: {}
        });
    }

    /**
     * Jumps back playback by 15 seconds, or to the start of the track if necessary.
     *
     * @example
     * api.media.goBackFifteenSeconds();
     */
    public goBackFifteenSeconds(): void {
        // Deny if not available
        if (this.supportedActions.goBackFifteenSeconds === false) return;

        this.connection.sendNativeMessage({
            namespace: DataProviderUpdateNamespace.Media,
            functionDefinition: 'goBackFifteenSeconds',
            data: {}
        });
    }

    /**
     * Jumps forward playback by 15 seconds, or to the start of the track if necessary.
     *
     * @example
     * api.media.skipFifteenSeconds();
     */
    public skipFifteenSeconds(): void {
        // Deny if not available
        if (this.supportedActions.skipFifteenSeconds === false) return;

        this.connection.sendNativeMessage({
            namespace: DataProviderUpdateNamespace.Media,
            functionDefinition: 'skipFifteenSeconds',
            data: {}
        });
    }

    /**
     * Sets the volume of audio for playback.
     *
     * Internally, this will "debounce" any requests to set the volume, so that only the latest value
     * will be applied.
     *
     * @param level A percentage between 0 and 100
     *
     * @example
     * api.media.setVolume(50); // Sets volume to 50%
     */
    public setVolume(level: number): void {
        if (this.volumeSetDebouncer) {
            clearTimeout(this.volumeSetDebouncer);
            this.volumeSetDebouncer = null;
        }

        this.volumeSetDebouncer = setTimeout(() => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Media,
                functionDefinition: 'setVolume',
                data: {
                    value: level
                }
            });
        }, 50);
    }

    /**
     * Seeks playback to the specified position in the currently playing track.
     *
     * Internally, this will "debounce" any requests to change playback position, so that only the latest value
     * will be applied.
     *
     * @param time A value between 0 and the current `length` parameter of the playing track.
     *
     * @example
     * api.media.seekToPosition(20); // Seeks to 20 seconds into the track
     */
    public seekToPosition(time: number): void {
        // Deny if not available
        if (this.supportedActions.skip === false) return;

        if (this.seekDebouncer) {
            clearTimeout(this.seekDebouncer);
            this.seekDebouncer = null;
        }

        this.seekDebouncer = setTimeout(() => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Media,
                functionDefinition: 'seekToPosition',
                data: {
                    value: time
                }
            });
        }, 50);

        // Stop elapsed timer, set new value, and await new API data
        this.dropNextInterval = true;

        this.stopElapsedInterval();
        this.nowPlaying.elapsed = time;
    }

    /**
     * @ignore
     * Retrieves the user's music library at the current point in time.
     *
     * @example
     * api.media.getUserLibrary().then(function(library) {
     *              // Work with the `library` object
     * });
     *
     * @return A promise that resolves with the user's library as an object. See {@link MediaLibrary} for details.
     */
    public async getUserLibrary(): Promise<MediaLibrary> {
        return new Promise<MediaLibrary>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Media,
                functionDefinition: 'userLibrary',
                data: {}
            }, (newState: MediaLibrary) => {
                resolve(newState);
            });
        });
    }

    /**
     * @ignore
     * Retrieves the list of albums associated with this artist
     * @param artist The artist to lookup. This parameter may the artist `id`, or an object that represents the artist
     *
     * @example
     * // Example of getting albums for an artist in the user's library
     * // Previously, getUserLibrary has been called to get the `library` variable.
     *
     * var artist = library.artists[0];
     * api.media.getAlbumsForArtist(artist).then(function(albums) {
     *              // Work with the `albums` array
     * });
     *
     * @example
     * // Example of retrieving associated albums for the currently playing track
     * var artist = api.media.nowPlaying.artist;
     * api.media.getAlbumsForArtist(artist).then(function(albums) {
     *              // Work with the `albums` array
     * });
     *
     * @return A promise that resolves with an array of {@link MediaAlbum}.
     */
    public async getAlbumsForArtist(artist: string | MediaLibraryArtist): Promise<MediaLibraryAlbum[]> {
        const id = typeof artist === 'string' ? artist : artist.id;

        return new Promise<MediaLibraryAlbum[]>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Media,
                functionDefinition: 'getAlbumsForArtist',
                data: {
                    id: id
                }
            }, (newState: MediaLibraryAlbum[]) => {
                resolve(newState);
            });
        });
    }

    /**
     * @ignore
     * Retrieves the list of tracks associated with this album
     * @param album The album to lookup. This parameter may the album `id`, or an object that represents the album
     *
     * @example
     * // Example of getting tracks for an album in the user's library
     * // Previously, getAlbumsForArtist has been called to get the `albums` variable.
     *
     * var album = albums[0];
     * api.media.getTracksForAlbum(album).then(function(tracks) {
     *              // Work with the `tracks` array
     * });
     *
     * // Alternatively, where getUserLibrary has been called to get the `library` variable.
     * var album = library.albums[0];
     * api.media.getTracksForAlbum(album).then(function(tracks) {
     *              // Work with the `tracks` array
     * });
     *
     * @example
     * // Example of retrieving the other tracks in the same album as the currently playing track
     * var album = api.media.nowPlaying.album;
     * api.media.getTracksForAlbum(album).then(function(tracks) {
     *              // Work with the `tracks` array
     * });
     *
     * @return A promise that resolves with an array of {@link MediaTrack}.
     */
    public async getTracksForAlbum(album: string | MediaLibraryAlbum): Promise<MediaTrack[]> {
        const id = typeof album === 'string' ? album : album.id;

        return new Promise<MediaTrack[]>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Media,
                functionDefinition: 'getTracksForAlbum',
                data: {
                    id: id
                }
            }, (newState: MediaTrack[]) => {
                resolve(newState);
            });
        });
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // Internal API
    //////////////////////////////////////////////////////////////////////////////////////////

    private dropNextInterval: boolean = false;
    private clearElapsedInterval() {
        if (this.elapsedInterval) {
            clearInterval(this.elapsedInterval);
        }
    }

    private restartElapsedInterval() {
        this.clearElapsedInterval();

        // No point running the interval if length is <= 0
        if (this.nowPlaying.length <= 0) {
            return;
        }

        this.dropNextInterval = false;

        this.elapsedTimeSeed = this.nowPlaying.elapsed;

        this.elapsedInterval = setInterval(() => {
            // Calculate elapsed interval based on the seed and observation time.
            const observationDifference = Date.now() - this._elapsedChangedTime;

            let newValue = Math.ceil(this.elapsedTimeSeed + (observationDifference / 1000));

            // Cap at track length if required
            if (newValue > this.nowPlaying.length) newValue = this.nowPlaying.length;

            // Ignore duplicated updates
            if (newValue === this.nowPlaying.elapsed || this.dropNextInterval) {
                return;
            }

            this.nowPlaying.elapsed = newValue;

            // Notify observers
            this.elapsedTimeObservers.forEach((fn: (time: number) => void) => {
                fn(this.nowPlaying.elapsed);
            });
        }, 100);
    }

    private stopElapsedInterval() {
        this.clearElapsedInterval();
    }

    // Overridden for elapsed timer handling
    /**
     * @ignore
     */
    _setData(payload: MediaProperties) {
        let seedChanged = true;

        if (payload._elapsedChangedTime === this._elapsedChangedTime) {
            // Time seed has not changed, so keep using the same elapsed time
            seedChanged = false;
            payload.nowPlaying.elapsed = this.nowPlaying.elapsed;
        }

        super._setData(payload);

        if (!payload.isPlaying || payload.isStopped) {
            // Stop the updater since we are now paused or stopped
            this.stopElapsedInterval();
        } else if (seedChanged) {
            // Restart for new playing state
            this.restartElapsedInterval();
        }
    }

    protected defaultData(): MediaProperties {
        return {
            _elapsedChangedTime: 0,
            nowPlaying: {
                id: '',
                title: '',
                artist: '',
                album: '',
                artwork: '',
                composer: '',
                genre: '',
                length: 0,
                elapsed: 0,
                number: 0,
            },
            queue: [],
            isPlaying: false,
            isStopped: true,
            isShuffleEnabled: false,
            volume: 0,
            nowPlayingApplication: {
                name: '',
                identifier: '',
                icon: '',
                badge: '',
                isInstalling: false,
                isSystemApplication: false
            },
            supportedActions: {
                skip: true,
                skipFifteenSeconds: false,
                goBackFifteenSeconds: false
            }
        };
    }
}