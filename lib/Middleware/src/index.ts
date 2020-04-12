import tinybind from 'tinybind';

import IS2Middleware from './infostats2';
import GroovyAPIMiddlware from './groovyapi';
import XenInfoMiddleware from './xeninfo';

import { DataProviderUpdateNamespace, DataProviderUpdate } from './types';
import XENDCalendarProvider from './data/calendar';
import XENDMediaProvider from './data/media';
import XENDRemindersProvider from './data/reminders';
import XENDSystemProvider from './data/system';
import XENDWeatherProvider from './data/weather';
import XENDApplicationsProvider from './data/applications';
import XENDResourcesProvider from './data/resources';

import NativeInterface from './native-interface';

/**
 * @ignore
 */
class XENDMiddleware extends NativeInterface {
    private infostats2: IS2Middleware = new IS2Middleware();
    private groovyAPI: GroovyAPIMiddlware = new GroovyAPIMiddlware();
    private xeninfo: XenInfoMiddleware = new XenInfoMiddleware();

    private dataProviders: Map<DataProviderUpdateNamespace, any> = new Map<DataProviderUpdateNamespace, any>();
    private bindView: any;

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        // Populate data providers
        this.dataProviders.set(DataProviderUpdateNamespace.Calendar, new XENDCalendarProvider(this));
        this.dataProviders.set(DataProviderUpdateNamespace.Media, new XENDMediaProvider(this));
        this.dataProviders.set(DataProviderUpdateNamespace.Reminders, new XENDRemindersProvider(this));
        this.dataProviders.set(DataProviderUpdateNamespace.System, new XENDSystemProvider(this));
        this.dataProviders.set(DataProviderUpdateNamespace.Weather, new XENDWeatherProvider(this));
        this.dataProviders.set(DataProviderUpdateNamespace.Applications, new XENDApplicationsProvider(this));
        this.dataProviders.set(DataProviderUpdateNamespace.Resources, new XENDResourcesProvider(this));

        // Initialise some compat stuff that doesn't rely on code that could be loaded a little later
        this.infostats2.initialise(this, this.dataProviders);

        // Setup tinybind
        tinybind.configure({
            prefix: 'xui',
            preloadData: true,
            templateDelimiters: ['{', '}'],
            formatters: {
                inject: (target: string, ...args) => {
                    for (var i = 0; i < args.length; i++) {
                        var offset = target.indexOf("%s");
                        if (offset === -1){
                            break;
                        }

                        target = target.slice(0, offset) + args[i] + target.slice(offset + 2);
                    }

                    return target;
                },
                time: (target: Date) => {
                    try {
                        return target.toLocaleTimeString();
                    } catch (e) {
                        return 'invalid date';
                    }
                },
                date: (target: Date, mode?: string) => {
                    if (!mode) {
                        mode = 'short';
                    }

                    let options = {};
                    if (mode === 'dayname') {
                        options = { weekday: 'long' };
                    } else if (mode === 'short') {
                        options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    } else if (mode === 'long') {
                        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    }

                    try {
                        return target.toLocaleDateString(undefined, options);
                    } catch (e) {
                        return 'invalid date';
                    }
                }
            }
        });

        const model = {
            calendar:   this.dataProviderInNamespace(DataProviderUpdateNamespace.Calendar),
            media:      this.dataProviderInNamespace(DataProviderUpdateNamespace.Media),
            reminders:  this.dataProviderInNamespace(DataProviderUpdateNamespace.Reminders),
            system:     this.dataProviderInNamespace(DataProviderUpdateNamespace.System),
            weather:    this.dataProviderInNamespace(DataProviderUpdateNamespace.Weather),
            apps:       this.dataProviderInNamespace(DataProviderUpdateNamespace.Applications),
            resources:  this.dataProviderInNamespace(DataProviderUpdateNamespace.Resources)
        };

        window.addEventListener('DOMContentLoaded', (event) => {
            // Notify providers of load
            this.dataProviders.forEach((value, key) => {
                value._documentLoaded();
            });

            // Setup tinybind now that the document has loaded and been parsed
            console.log('Setting up tinybind with model');
            this.bindView = tinybind.bind(document.body, model);
        });
    }

    protected onDataProviderUpdate(update: DataProviderUpdate) {
        // Forward new data to correct provider
        this.dataProviders.get(update.namespace)._setData(update.payload);

        // Notify the tinybind view of new changes
        console.log('Notifying tinybind of new data');
        this.bindView.sync();
    }

    protected onLoad() {
        console.log('Middleware onLoad');

        // Setup backwards compatibility middlewares
        // This is post-load
        this.groovyAPI.initialise(this, this.dataProviders);
        this.xeninfo.initialise(this, this.dataProviders);
    }

    public dataProviderInNamespace(namespace: DataProviderUpdateNamespace) {
        return this.dataProviders.get(namespace);
    }
}

/**
 * @ignore
 */
export default class XENDApi {
    // Called onto by native via 'api._middleware'
    private _middleware = new XENDMiddleware();

    // Aliases to providers
    public calendar: XENDCalendarProvider             = this._middleware.dataProviderInNamespace(DataProviderUpdateNamespace.Calendar);
    public media: XENDMediaProvider                   = this._middleware.dataProviderInNamespace(DataProviderUpdateNamespace.Media);
    public reminders: XENDRemindersProvider           = this._middleware.dataProviderInNamespace(DataProviderUpdateNamespace.Reminders);
    public system: XENDSystemProvider                 = this._middleware.dataProviderInNamespace(DataProviderUpdateNamespace.System);
    public weather: XENDWeatherProvider               = this._middleware.dataProviderInNamespace(DataProviderUpdateNamespace.Weather);
    public apps: XENDApplicationsProvider             = this._middleware.dataProviderInNamespace(DataProviderUpdateNamespace.Applications);
    public resources: XENDResourcesProvider           = this._middleware.dataProviderInNamespace(DataProviderUpdateNamespace.Resources);
}