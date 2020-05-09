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
 * This interface represents a media track, including music videos. Be aware that not all fields will
 * always have data; not all apps report the same level of detail.
 */
export interface MediaTrack {
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
     * The track number on its corresponding album
     */
    number: number;

    /**
     * The elapsed playback time, measured in seconds. This is only available on the currently playing track
     *
     * NOTE: This may be reported as 0 in some cases, if the playing application doesn't make this information available
     *
     * NOTE: This may also be reported as negative, such as when streaming media over AirPlay. This can be assumed to be representative of a "buffering" state.
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
}

/**
 * The Media provider brings together data about any currently playing media on the user's device.
 *
 * It provides access to everything available to the stock "Now Playing" widget of the Control Centre. This includes artwork, the "Up next" queue, and so forth.
 *
 * Also provided is a few utility functions, such as:
 * - "Seeking" within the current track
 * - Changing play/pause state
 * - Skip forward or backwards between tracks
 *
 * You can register for an update timer, which notifies your code when the `elapsed` time of the current track changes.
 */
export default class Media extends Base implements MediaProperties {

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
     * @ignore
     */
    volume: number;

    /**
     * Provides details about the application that is currently playing media
     */
    nowPlayingApplication: ApplicationMetadata;

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

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    /**
     * Toggles play/pause of the current media item.
     *
     * @example
     * api.media.togglePlayState();
     *
     * @example
     * // Alternatively:
     * api.media.togglePlayState().then(function(newState) { });
     *
     * @return A promise that resolves with the new play/pause state
     */
    public async togglePlayState(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Applications,
                functionDefinition: 'togglePlayState',
                data: {}
            }, (newState: boolean) => {
                resolve(newState);
            });
        });
    }

    /**
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
                namespace: DataProviderUpdateNamespace.Applications,
                functionDefinition: 'userLibrary',
                data: {}
            }, (newState: MediaLibrary) => {
                resolve(newState);
            });
        });
    }

    /**
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
                namespace: DataProviderUpdateNamespace.Applications,
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
                namespace: DataProviderUpdateNamespace.Applications,
                functionDefinition: 'getTracksForAlbum',
                data: {
                    id: id
                }
            }, (newState: MediaTrack[]) => {
                resolve(newState);
            });
        });
    }
}