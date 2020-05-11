import Media, { MediaProperties } from '../data/media';

import { DataProviderUpdateNamespace } from '../types';

/**
 * @ignore
 */
export default class XenInfoMedia {

    constructor(providers: Map<DataProviderUpdateNamespace, any>,
        private notifyXenInfoDataChanged: (namespace: string) => void) {

        // Monitor resources data
        providers.get(DataProviderUpdateNamespace.Media).observeData((newData: MediaProperties) => {

            this.onDataChanged(newData);
            this.notifyXenInfoDataChanged('music');
        });

        // Do initial update
        this.onDataChanged(providers.get(DataProviderUpdateNamespace.Media));
    }

    onDataChanged(data: MediaProperties) {

        // Update media info
        (window as any).artist = data.nowPlaying.artist;
        (window as any).album = data.nowPlaying.album;
        (window as any).title = data.nowPlaying.title;
        (window as any).isplaying = data.isPlaying;

        // Why the hell weren't these documented for XI?!

        (window as any).musicBundle = data.nowPlayingApplication.identifier;
        (window as any).currentDuration = data.nowPlaying.length;
        (window as any).currentElapsedTime = data.nowPlaying.elapsed;
        (window as any).shuffleEnabled = false;
        (window as any).repeatEnabled = false;
    }
}