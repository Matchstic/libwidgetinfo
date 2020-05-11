/**
 * @ignore
 * Provides some utility functions to avoid duplication of code
 */
export default class IS2Base {
    protected _observers: any = {};
    protected _lookupMap: any = {};

    protected notifyObservers() {
        Object.keys(this._observers).forEach((key: string) => {
            const fn = this._observers[key];

            if (fn)
                fn();
        });
    }

    public callFn(identifier: string, args: any[]) {
        const fn = this._lookupMap[identifier];
        if (fn) {
            return fn(args);
        } else {
            return undefined;
        }
    }
}