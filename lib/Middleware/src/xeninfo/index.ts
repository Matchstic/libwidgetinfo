import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';

import XenInfoWeather from './weather-compat';

export default class XenInfoMiddleware implements XenHTMLMiddleware {
    private providers: Map<DataProviderUpdateNamespace, any>;

    private weatherCompat: XenInfoWeather = null;

    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        if (!this.requiresXenInfoCompat()) return;

        this.providers = providers;

        // Setup compatibility things
        this.weatherCompat = new XenInfoWeather(this.providers, this.notifyXenInfoDataChanged);
    }

    private requiresXenInfoCompat(): boolean {
        return (window as any).mainUpdate !== undefined;
    }

    private notifyXenInfoDataChanged(namespace: string) {
        // Call mainUpdate with changed namespace
        if ((window as any).mainUpdate !== undefined) {
            (window as any).mainUpdate(namespace);
        }
    }

    invokeAction(action: any): void {}
}