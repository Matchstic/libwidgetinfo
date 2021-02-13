import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';

import XenInfoWeather from './weather-compat';
import XenInfoBattery from './battery-compat';
import XenInfoSystem from './system-compat';
import XenInfoMedia from './media-compat';
import XenInfoEvents from './events-compat';
import XenInfoStatusbar from './statusbar-compat';

/**
 * @ignore
 */
export default class XenInfoMiddleware implements XenHTMLMiddleware {
    private providers: Map<DataProviderUpdateNamespace, any>;
    private compat: any[] = [];

    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        if (!this.requiresXenInfoCompat()) return;

        this.providers = providers;

        // Setup compatibility things
        this.compat.push(new XenInfoWeather(this.providers, this.notifyXenInfoDataChanged));
        this.compat.push(new XenInfoBattery(this.providers, this.notifyXenInfoDataChanged));
        this.compat.push(new XenInfoSystem(this.providers, this.notifyXenInfoDataChanged));
        this.compat.push(new XenInfoMedia(this.providers, this.notifyXenInfoDataChanged));
        this.compat.push(new XenInfoEvents(this.providers, this.notifyXenInfoDataChanged));
        this.compat.push(new XenInfoStatusbar(this.providers, this.notifyXenInfoDataChanged));
    }

    public onFirstUpdate() {
        // Fire off first updates - ensures that if a widget uses data from another provider
        // than the specified namespace, everything just *works*

        this.compat.forEach((compat: any) => {
            try {
                compat.onFirstUpdate();
            } catch (e) {
                window.onerror(e);
            }
        });
    }

    private requiresXenInfoCompat(): boolean {
        return (window as any).mainUpdate !== undefined;
    }

    private notifyXenInfoDataChanged(namespace: string) {
        // Call mainUpdate with changed namespace
        if ((window as any).mainUpdate !== undefined) {
            // Hitting user-defined code at this point, which very well may throw an exception
            try {
                (window as any).mainUpdate(namespace);
            } catch (e) {
                // This does lose callstack symbols, but its legacy widgets so idc
                window.onerror(e);
            }
        }
    }
}