import { Base, DataProviderUpdateNamespace } from '../types';
import NativeInterface, { NativeInterfaceMessage } from '../native-interface';

/**
 * @ignore
 */
export interface SystemProperties {
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

/**
 * **This API is not yet available**
 */
export default class System extends Base implements SystemProperties {

    /////////////////////////////////////////////////////////
    // SystemProperties stub implementation
    /////////////////////////////////////////////////////////

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

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: SystemProperties) => void) {
        super.observeData(callback);
    }

    /////////////////////////////////////////////////////////
    // Provider implementation
    /////////////////////////////////////////////////////////

    private documentSplitByNewline: string[] = null;

    /**
     * @ignore
     */
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
        (window as any).onerror = (message, source, lineno, colno, error: Error) => {
            if (!error || !error.stack) {
                console.error(message);
                return;
            }

            message += '\nCall Stack: \n';

            error.stack.split('\n').forEach((line: string) => {
                line = line.trim();

                if (line === '') {
                    message += '<unknown>@[native code]\n';
                    return;
                }

                // Handle case of not yet loaded
                if (this.documentSplitByNewline === null) {
                    const functionPart = line.split('@')[0];

                    message += functionPart + '@[unknown]' + '\n';

                    return;
                }

                // Find source mapping for this line
                const globalLineParts = line.split('/:');
                if (globalLineParts.length > 1) {
                    const functionPart = globalLineParts[0].split('@')[0];
                    const globalLine = globalLineParts[1].split(':');
                    if (globalLine.length > 0) {
                        const parsedLineNumber = parseInt(globalLine[0]);

                        const sourceMap = {
                            line: -1,
                            script: ''
                        };

                        // Backwards lookup this line to its source entry
                        let preceedingSourceMapInserts = 0;
                        for (let i = parsedLineNumber; i >= 0; i--) {

                            const test = this.documentSplitByNewline[i];

                            if (test && test.trim().startsWith('//# source=')) {
                                // Update the sourcemap line if necessary, and make sure to account
                                // for the injected source map lines

                                if (sourceMap.line === -1) {
                                    sourceMap.line = i;

                                    let match = /\/\/# source=([\w/.]+)/g.exec(test.trim());
                                    if (match !== null) {
                                        let sourceName = match[1];
                                        if (sourceName === '.html') {
                                            sourceName = '[document]';
                                        }
                                        sourceMap.script = sourceName;
                                    } else {
                                        sourceMap.script = '[unknown]';
                                    }
                                } else {
                                    preceedingSourceMapInserts++;
                                }
                            }
                        }

                        // Update the line with the inserts
                        sourceMap.line += preceedingSourceMapInserts;

                        // Add default state if the search failed
                        if (sourceMap.line === -1) {
                            sourceMap.line = 0;
                            sourceMap.script = '[unknown]';
                        }

                        // Re-generate the line based off the source map
                        line = functionPart + '@' + sourceMap.script + ':' + (parsedLineNumber - sourceMap.line + 1) + ':' + globalLine[1];
                    }
                }

                message += line + '\n';
            });

            console.error(message);
        }
    }

    /**
     * @ignore
     */
    _documentLoaded() {
        // Setup document
        this.documentSplitByNewline = document.documentElement.innerHTML.split(/\r?\n/);
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

    // This is not exposed publicly
    // To do logging, console.* is sufficient
    private async log(message: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.System,
                functionDefinition: 'log',
                data: { message: message, path: window.location.pathname }
            }, () => {
                resolve();
            });

        });
    }
}