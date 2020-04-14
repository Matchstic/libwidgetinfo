import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';

import XenInfoWeather from './weather-compat';

/**
 * @ignore
 */
export default class XenInfoMiddleware implements XenHTMLMiddleware {
    private providers: Map<DataProviderUpdateNamespace, any>;

    private weatherCompat: XenInfoWeather = null;

    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        if (!this.requiresXenInfoCompat()) {
            // If XenInfo is installed, it will attempt to keep calling mainUpdate() resulting in
            // exceptions being thrown. This is *bad*.
            //
            // To avoid this, mainUpdate is defined if it is not present with an empty implementation

            (window as any).mainUpdate = () => {};

            return;
        }

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