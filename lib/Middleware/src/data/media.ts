import { Base, DataProviderUpdateNamespace } from '../types';
import { ApplicationMetadata } from './applications';

export interface MediaAlbum {
    title: string;
    tracks: MediaTrack[];
    trackCount: number;
}

export interface MediaArtist {
    name: string;
    albums: MediaAlbum;
}

export interface MediaTrack {
    title: string;
    album: MediaAlbum;
    artist: MediaArtist;
    artwork: string; // URL of the artwork, exposed by the native side
    length: number;
    number: number;
}

export interface MediaCurrentItem {
    track: MediaTrack;
    album: MediaAlbum;
    artist: MediaArtist;
    elapsedDuration: number;
}

/**
 * @ignore
 */
export interface MediaProperties {
    currentTrack: MediaCurrentItem;
    upcomingTracks: MediaTrack[];

    userArtists: MediaArtist[];
    userAlbums: MediaAlbum[];

    isPlaying: boolean;
    isStopped: boolean;
    isShuffleEnabled: boolean;

    volume: number;
    playingApplication: ApplicationMetadata;
}

/**
 * **This API is not yet available**
 */
export default class Media extends Base implements MediaProperties {

    // NOTE: Don't rely on native layer to push through elapsed time
    // It'll come through on pause/play etc, but should really handle that here
    // to avoid massive communication overhead

    /////////////////////////////////////////////////////////
    // MediaProperties stub implementation
    /////////////////////////////////////////////////////////

    currentTrack: MediaCurrentItem;
    upcomingTracks: MediaTrack[];

    userArtists: MediaArtist[];
    userAlbums: MediaAlbum[];

    isPlaying: boolean;
    isStopped: boolean;
    isShuffleEnabled: boolean;

    volume: number;
    playingApplication: ApplicationMetadata;

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
}