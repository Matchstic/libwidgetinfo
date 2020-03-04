import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';
import IS2Weather from './weather-compat';

export class Type {
    constructor(private parameterType: string) {}

    blockWith() {
        return (fn) => {
            return fn;
        }
    }
}

export default class IS2Middleware implements XenHTMLMiddleware {
    private compatProviders: any = {};

    constructor() {
        // Setup compat providers - they observe providers themselves
        this.compatProviders['IS2Weather'] = new IS2Weather();

        // Add Type class to global namespace so that IS2 blocks work
        (window as any).Type = Type;
    }

    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        this.compatProviders['IS2Weather'].initialise(providers.get(DataProviderUpdateNamespace.Weather));
    }

    public objc_msgSend(object: string, selector: string, ...args: any[]): any {
        // Call object[<selector>](arguments)

        // Example with args:
        // WidgetInfo._middleware.infostats2.objc_msgSend("IS2Weather","setWeatherUpdateTimeInterval:forRequester:",30,"test")

        /*
         * IMPORTANT: Due to how ...args works, an array of arguments will be passed down the chain.
         * Therefore, compat providers cannot just declare their parameter types; they need to handle
         * destructuring the args array where necessary.
         */
        const compatProvider = this.compatProviders[object];
        return compatProvider.callFn(selector, args);
    }
}