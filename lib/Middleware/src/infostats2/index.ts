import { XenHTMLMiddleware, DataProviderUpdateNamespace } from '../types';
import NativeInterface from '../native-interface';
import IS2Weather from './weather-compat';
import IS2Location from './location-compat';
import IS2Calendar from './calendar-compat';
import IS2Media from './media-compat';
import IS2Notifications from './notifications-compat';
import IS2Pedometer from './pedometer-compat';
import IS2System from './system-compat';
import IS2Telephony from './telephony-compat';

/**
 * @ignore
 */
export class Type {
    constructor(private parameterType: string) {}

    blockWith() {
        return (fn) => {
            return fn;
        }
    }
}

/**
 * @ignore
 */
export default class IS2Middleware implements XenHTMLMiddleware {
    private compatProviders: any = {};

    constructor() {
        // Setup compat providers - they observe providers themselves
        this.compatProviders['IS2Weather']          = new IS2Weather();
        this.compatProviders['IS2Location']         = new IS2Location();
        this.compatProviders['IS2Calendar']         = new IS2Calendar();
        this.compatProviders['IS2Media']            = new IS2Media();
        this.compatProviders['IS2Notifications']    = new IS2Notifications();
        this.compatProviders['IS2Pedometer']        = new IS2Pedometer();
        this.compatProviders['IS2System']           = new IS2System();
        this.compatProviders['IS2Telephony']        = new IS2Telephony();

        // Add Type class to global namespace so that IS2 blocks work
        (window as any).Type = Type;
    }

    public initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void {
        this.compatProviders['IS2Weather'].initialise(providers.get(DataProviderUpdateNamespace.Weather));
        this.compatProviders['IS2Calendar'].initialise(providers.get(DataProviderUpdateNamespace.Calendar));
        this.compatProviders['IS2Media'].initialise(providers.get(DataProviderUpdateNamespace.Media));
        this.compatProviders['IS2Notifications'].initialise();
        this.compatProviders['IS2Pedometer'].initialise();
        this.compatProviders['IS2System'].initialise(
            providers.get(DataProviderUpdateNamespace.System),
            providers.get(DataProviderUpdateNamespace.Resources),
            providers.get(DataProviderUpdateNamespace.Applications));
        this.compatProviders['IS2Telephony'].initialise(providers.get(DataProviderUpdateNamespace.Communications));

        // Location utilises the weather provider for data
        this.compatProviders['IS2Location'].initialise(providers.get(DataProviderUpdateNamespace.Weather));
    }

    public objc_msgSend(object: string, selector: string, ...args: any[]): any {
        // Call object[<selector>](arguments)

        // Example with args:
        // api._middleware.infostats2.objc_msgSend("IS2Weather","setWeatherUpdateTimeInterval:forRequester:",30,"test")

        /*
         * IMPORTANT: Due to how ...args works, an array of arguments will be passed down the chain.
         * Therefore, compat providers cannot just declare their parameter types; they need to handle
         * destructuring the args array where necessary.
         */
        const compatProvider = this.compatProviders[object];
        if (compatProvider)
            return compatProvider.callFn(selector, args);
        else
            return null;
    }
}