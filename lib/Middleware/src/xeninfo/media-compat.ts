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
    }
}