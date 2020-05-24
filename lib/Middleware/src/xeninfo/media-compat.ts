import Media, { MediaProperties } from '../data/media';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoMedia {

    constructor(providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {

        // Do initial update
        this.onDataChanged(providers.get(DataProviderUpdateNamespace.Media));
        console.log('Set initial media data');

        // Monitor resources data
        providers.get(DataProviderUpdateNamespace.Media).observeData((newData: MediaProperties) => {
            this.onDataChanged(newData);
            this.notifyXenInfoDataChanged('music');
            console.log('Notified of new media data due to API update');
        });
    }

    onFirstUpdate() {
        this.notifyXenInfoDataChanged('music');
        console.log('Notified of new media data due to first update');
    }

    onDataChanged(data: MediaProperties) {
        console.log('Sample: ' + JSON.stringify(data.nowPlaying) + ', isPlaying: ' + data.isPlaying);

        // Update media info
        (window as any).artist = data.nowPlaying.artist.length > 0 ? data.nowPlaying.artist : '(null)';
        (window as any).album = data.nowPlaying.album.length > 0 ? data.nowPlaying.album : '(null)';
        (window as any).title = data.nowPlaying.title.length > 0 ? data.nowPlaying.title : '(null)';
        (window as any).isplaying = data.isPlaying ? 1 : 0;

        // Why the hell weren't these documented for XI?!

        (window as any).musicBundle = data.nowPlayingApplication.identifier;
        (window as any).currentDuration = this.secondsToFormatted(data.nowPlaying.length);
        (window as any).currentElapsedTime = this.secondsToFormatted(data.nowPlaying.elapsed);
        (window as any).shuffleEnabled = 'disabled';
        (window as any).repeatEnabled = 'disabled';
    }

    private secondsToFormatted(seconds: number): string {
        if (seconds === 0) return '0:00';

        const isNegative = seconds < 0;
        if (isNegative) return '0:00';

        seconds = Math.abs(seconds);
        const minutes = Math.floor(seconds / 60)
        const secs = Math.floor(seconds - (minutes * 60));

        return minutes + ':' + (secs < 10 ? '0' : '') + secs;
    }
}