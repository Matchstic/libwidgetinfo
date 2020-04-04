import NativeInterface from './native-interface';

/**
 * @ignore
 */
export interface XenHTMLMiddleware {
    initialise(parent: NativeInterface, providers: Map<DataProviderUpdateNamespace, any>): void;
}

/**
 * @ignore
 */
export enum DataProviderUpdateNamespace {
    Weather = 'weather',
    Media = 'media',
    Calendar = 'calendar',
    Reminders = 'reminders',
    Resources = 'resources',
    Applications = 'applications',
    System = 'system'
}

/**
 * @ignore
 */
export interface DataProviderUpdate {
    namespace: DataProviderUpdateNamespace;
    payload: any;
}

/**
 * @ignore
 */
export interface NativeError {
    code: number;
    message: string;
}

/**
 * @ignore
 */
export class XENDBaseProvider {


    constructor(protected connection: NativeInterface) {
        // Configure with default data, so that everything has sane defaults
        this._destructureData(this.defaultData());
    }

    private observers: Array<(newData: any) => void> = [];

    protected defaultData(): any {
        return {};
    }

    _setData(payload: any) {
        // Destructure incoming data
        this._destructureData(payload);

        // Notify observers of change
        this.observers.forEach((fn: (newdata: any) => void) => {
            fn(this);
        });
    }

    private _destructureData(payload: any) {
        Object.assign(this, payload);
    }

    // Can be overriden by subclasses
    _documentLoaded() {}

    /**
     * Add a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: any) => void) {
        this.observers.push(callback);
    }
}