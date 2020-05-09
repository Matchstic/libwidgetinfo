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
 * @ignore
 */
export interface MediaTrack {
    title: string;
    album: string;
    artist: string;
    artwork: string; // URL of the track artwork, loaded by the native side. May be an empty string, if so, no artwork
    composer: string;
    genre: string;
    length: number;
    number: number; // The track number on its corresponding album
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
 * @ignore
 */
export default class Media extends Base implements MediaProperties {

    // NOTE: Don't rely on native layer to push through elapsed time
    // It'll come through on pause/play etc, but need to manually run a timer here to update
    // observers of it - likely with its own observer array?

    /////////////////////////////////////////////////////////
    // MediaProperties stub implementation
    /////////////////////////////////////////////////////////

    nowPlaying: MediaTrack;
    queue: MediaTrack[];

    isPlaying: boolean;
    isStopped: boolean;
    isShuffleEnabled: boolean;

    volume: number;
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