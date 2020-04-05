import { Base, DataProviderUpdateNamespace } from '../types';
import { XENDApplication } from './applications';

export interface XENDMediaAlbum {
    title: string;
    tracks: XENDMediaTrack[];
    trackCount: number;
}

export interface XENDMediaArtist {
    name: string;
    albums: XENDMediaAlbum;
}

export interface XENDMediaTrack {
    title: string;
    album: XENDMediaAlbum;
    artist: XENDMediaArtist;
    artwork: string; // URL of the artwork, exposed by the native side
    length: number;
    number: number;
}

export interface XENDMediaCurrentItem {
    track: XENDMediaTrack;
    album: XENDMediaAlbum;
    artist: XENDMediaArtist;
    elapsedDuration: number;
}

/**
 * @ignore
 */
export interface XENDMediaProperties {
    currentTrack: XENDMediaCurrentItem;
    upcomingTracks: XENDMediaTrack[];

    userArtists: XENDMediaArtist[];
    userAlbums: XENDMediaAlbum[];

    isPlaying: boolean;
    isStopped: boolean;
    isShuffleEnabled: boolean;

    volume: number;
    playingApplication: XENDApplication;
}

export default class Media extends Base implements XENDMediaProperties {

    // NOTE: Don't rely on native layer to push through elapsed time
    // It'll come through on pause/play etc, but should really handle that here
    // to avoid massive communication overhead

    /////////////////////////////////////////////////////////
    // XENDMediaProperties stub implementation
    /////////////////////////////////////////////////////////

    currentTrack: XENDMediaCurrentItem;
    upcomingTracks: XENDMediaTrack[];

    userArtists: XENDMediaArtist[];
    userAlbums: XENDMediaAlbum[];

    isPlaying: boolean;
    isStopped: boolean;
    isShuffleEnabled: boolean;

    volume: number;
    playingApplication: XENDApplication;

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