import { XENDBaseProvider } from '../types';

export interface XENDRemindersProperties {

}

export default class XENDRemindersProvider extends XENDBaseProvider {

    public get data(): XENDRemindersProperties {
        return this._data;
    }

}