import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';
import IS2Weather from './weather-compat';

export default class IS2Middleware implements XenHTMLMiddleware {
    private compatProviders: any = {};

    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        // Setup compat providers - they observe providers themselves
        this.compatProviders['IS2Weather'] = new IS2Weather(providers.get(DataProviderUpdateNamespace.Weather));

    }

    public objc_msgSend(object: string, selector: string, ...args: any): void {
        // Call object[<selector>](arguments)

        // Example with args:
        // WidgetInfo._middleware.infostats2.objc_msgSend("IS2Weather","setWeatherUpdateTimeInterval:forRequester:",30,"test")

        const compatProvider = this.compatProviders[object];
        compatProvider.callFn(selector, args);
    }
}