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
 * The System provider allows access to various system-level properties about the current device.
 *
 * It also provides access to locale-specific information, such as whether 24-hour time is currently enabled.
 *
 * **This provider is not yet feature-complete; the listed items below are functional**
 *
 * @example
 * <script>
 * api.system.observeData(function (newData) {
 *              console.log('System data has updated');
 *
 *              // Set some data to document elements
 *              document.getElementById('#deviceName').innerHTML = newData.deviceName;
 *              document.getElementById('#systemVersion').innerHTML = newData.systemVersion;
 *
 *              // Call a refresh function, or whatever, to account for if 24-hour time has changed
 *              refreshElementsThatDisplayTimes();
 * });
 * </script>
 */
export default class System extends Base implements SystemProperties {
    private timeObservers: Array<() => void> = [];

    /////////////////////////////////////////////////////////
    // SystemProperties stub implementation
    /////////////////////////////////////////////////////////

    /**
     * The user-specified name of the device
     */
    deviceName: string;

    /**
     * The type of the device.
     *
     * Values: "iPod Touch", "iPad", "iPhone"
     */
    deviceType: string;

    /**
     * The model code of the device
     *
     * For example, "iPhone10,2"
     */
    deviceModel: string;

    /**
     * The advertised name of the device, as from Apple
     *
     * For example, "iPhone 11 Pro"
     */
    deviceModelPromotional: string;

    /**
     * The iOS system version the device is running
     */
    systemVersion: string;

    /**
     * The height of the display, in points.
     *
     * For example, the iPhone X has a `deviceDisplayHeight` of 812
     */
    deviceDisplayHeight: number;

    /**
     * The width of the display, in points.
     *
     * For example, the iPhone X has a `deviceDisplayWidth` of 375
     */
    deviceDisplayWidth: number;

    /**
     * @ignore
     */
    deviceDisplayBrightness: number;

    /**
     * Specifies whether twenty-four hour time is currently enabled
     *
     * Make sure to make use of `observeData` to be notified when the user toggles this.
     */
    isTwentyFourHourTimeEnabled: boolean;

    /**
     * Specifies whether Low Power Mode is currently enabled
     *
     * Make sure to make use of `observeData` to be notified when the user toggles this.
     */
    isLowPowerModeEnabled: boolean;

    /**
     * Specifies whether a network connection is currently available
     *
     * Make sure to make use of `observeData` to be notified when its state changes.
     */
    isNetworkConnected: boolean;

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * Data will change due to the following events:
     *
     * - User changes the 24hr time setting of their device
     * - Network connection state changes
     * - Low Power Mode state changes
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

        // Override toLocaleTimeString to use our 12/24 hour metadata
        const oldToLocaleTimeString = Date.prototype.toLocaleTimeString;
        const _this = this;
        Date.prototype.toLocaleTimeString = function(locales?: string | string[], options?: {}) {
            if (!options) options = { 'hour12': !_this.isTwentyFourHourTimeEnabled };
            else options = {
                'hour12': !_this.isTwentyFourHourTimeEnabled,
                ...options
            }

            return oldToLocaleTimeString.apply(this, [locales, options]);
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
     * @ignore
     */
    protected defaultData(): SystemProperties {
        return {
            deviceName: '',
            deviceType:  '',
            deviceModel: '',
            deviceModelPromotional: '',
            systemVersion: '',

            deviceDisplayHeight: 0,
            deviceDisplayWidth: 0,
            deviceDisplayBrightness: 0,

            isTwentyFourHourTimeEnabled: false,
            isLowPowerModeEnabled: false,
            isNetworkConnected: false
        };
    }

    /**
     * @ignore
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
     * @ignore
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
     * @ignore
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
     * @ignore
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
     * @ignore
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
     * @ignore
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