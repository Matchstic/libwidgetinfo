import { XENDBaseProvider, DataProviderUpdateNamespace } from '../types';
import NativeInterface, { NativeInterfaceMessage } from '../native-interface';

export interface XENDSystemProperties {
    deviceName: string;
    deviceType: string;
    deviceModel: string;
    deviceModelPromotional: string;
    systemVersion: string;

    deviceDisplayHeight: number;
    deviceDisplayWidth: number;
    deviceDisplayBrightness: number;

    isTwentyFourHourTimeEnabled: boolean;
    isLowPowerModeEnabled: boolean;
    isNetworkConnected: boolean;
}

export default class XENDSystemProvider extends XENDBaseProvider {

    constructor(protected connection: NativeInterface) {
        super(connection);

        // Override console.log etc with our own

        let newConsole = (oldConsole: any) => {
            return {
                log: (text: string) => {
                    oldConsole.log(text);
                    this.log(text);
                },
                info: (text: string) => {
                    oldConsole.info(text);
                    this.log('INFO: ' + text);
                },
                warn: (text: string) => {
                    oldConsole.warn(text);
                    this.log('WARN: ' + text);
                },
                error: (text: string) => {
                    oldConsole.error(text);
                    this.log('ERROR: ' + text);
                }
            }
        };

        (window as any).console = newConsole(window.console);
    }


    public get data(): XENDSystemProperties {
        return this._data;
    }

    /**
     * TODO docs
     */
    public async invokeScreenshot(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'invokeScreenshot',
                data: {}
            }, () => {
                resolve();
            });
        });
    }

    /**
     * TODO docs
     */
    public async lockDevice(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'lockDevice',
                data: {}
            }, () => {
                resolve();
            });
        });
    }

    /**
     * TODO docs
     */
    public async openApplicationSwitcher(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'openApplicationSwitcher',
                data: {}
            }, () => {
                resolve();
            });
        });
    }

    /**
     * TODO docs
     */
    public async openSiri(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'openSiri',
                data: {}
            }, () => {
                resolve();
            });
        });
    }

    /**
     * TODO docs
     */
    public async respringDevice(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'respringDevice',
                data: {}
            }, () => {
                resolve();
            });
        });
    }

    /**
     * TODO docs
     */
    public async vibrateDevice(duration: number = 0.25): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'vibrateDevice',
                data: { duration: duration }
            }, () => {
                resolve();
            });
        });
    }

    /**
     * TODO docs
     */
    public async log(message: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'log',
                data: { message: message }
            }, () => {
                resolve();
            });

        });
    }
}