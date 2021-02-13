import { Base } from '../types';

/**
 * A set of data points relating to the WiFi modem inside the current
 * device.
 *
 * Note: when your widget is being shown inside Settings, these
 * properties will be set to preview data.
 */
export interface CommunicationsWiFi {
    /**
     * If WiFi is enabled or not
     */
    enabled: boolean;

    /**
     * The number of WiFi bars shown in the status bar to the user.
     *
     * Maximum is 3
     */
    bars: number;

    /**
     * Name of the network currently connected to
     */
    ssid: string;
}

/**
 * A set of data points relating to the cellular modem
 * inside an iPhone, or cellular iPad.
 *
 * Note: when your widget is being shown inside Settings, these
 * properties will be set to preview data.
 */
export interface CommunicationsTelephony {
    /**
     * Whether Airplane Mode is enabled
     */
    airplaneMode: boolean;

    /**
     * The number of signal bars shown in the status bar to the user.
     *
     * Maximum is 5
     */
    bars: number;

    /**
     * The operator of the network the user is connected to.
     *
     * e.g., Vodafone, O2, T-Mobile, and so forth
     */
    operator: string;

    /**
     * The current data connection type
     */
    type: '' | '2G' | '3G' | 'CDMA' | 'LTE' | '5G';
}

/**
 * A device connected via Bluetooth
 */
export interface CommunicationsBluetoothDevice {
    /**
     * The name of the Bluetooth device.
     *
     * This is escaped for you.
     */
    name: string;

    /**
     * The Bluetooth address of the device
     */
    address: string;

    /**
     * Battery level of the device, if supported.
     *
     * Not all Bluetooth devices advertise their current battery levels. You should also check
     * <code>supportsBattery</code> in conjunction with this property.
     */
    battery: number;

    /**
     * Whether the device advertises its battery level
     */
    supportsBattery: number;

    /**
     * Whether the device is classed as a Bluetooth accessory
     */
    isAccessory: boolean;

    /**
     * Whether the device is an official Apple audio device, like AirPods.
     */
    isAppleAudioDevice: boolean;

    /**
     * The Bluetooth major class the device advertises
     */
    majorClass: number;

    /**
     * The Bluetooth minor class the device advertises
     */
    minorClass: number;
}

/**
 * A set of data points relating to the Bluetooth modem inside
 * the current device
 *
 * Note: when your widget is being shown inside Settings, these
 * properties will be set to preview data.
 */
export interface CommunicationsBluetooth {
    /**
     * If Bluetooth is on or off
     */
    enabled: boolean;

    /**
     * Whether the Bluetooth subsystem is scanning for other devices to
     * connect to
     */
    scanning: boolean;

    /**
     * Whether the current device is discoverable to other Bluetooth devices
     */
    discoverable: boolean;

    /**
     * A list of devices that are currently connected
     */
    devices: CommunicationsBluetoothDevice[];
}

/**
 * @ignore
 */
export interface CommunicationsProperties {
    wifi: CommunicationsWiFi;
    telephony: CommunicationsTelephony;
    bluetooth: CommunicationsBluetooth;
}

/**
 * The Communications provider gives you access to data relating to communication radios available
 * on the current device: WiFi, cellular and Bluetooth.
 *
 * This provider is read-only - you can observe the current state of radios, but cannot make changes
 * like turning them on or off.
 *
 * Additionally, there is up to a 5 second lag between changing a setting, and it being reflected inside
 * widgets.
 *
 * <b>Available in Xen HTML 2.0~beta7 or newer</b>
 *
 * @example
 * Pure Javascript:
 * <script>
 * api.comms.observeData(function (newData) {
 *              console.log('Communications data has updated');
 *
 *              // Set some data to document elements
 *              document.getElementById('#airplane-mode').innerHTML = newData.telephony.airplaneMode ? 'ON' : 'OFF';
 *              document.getElementById('#wifi-network').innerHTML = newData.wifi.ssid;
 * });
 * </script>
 *
 * Inline:
 * <div id="commsDisplay">
 *               <p id="operator">{ comms.telephony.operator }</p>
 *               <p id="signal">{ comms.telephony.bars }</p>
 *               <p id="bluetooth">{ comms.bluetooth.enabled }</p>
 * </div>
 */
export default class Communications extends Base implements CommunicationsProperties {

    /////////////////////////////////////////////////////////
    // CommunicationsProperties stub implementation
    /////////////////////////////////////////////////////////

    wifi: CommunicationsWiFi;
    telephony: CommunicationsTelephony;
    bluetooth: CommunicationsBluetooth;

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * The new data is provided as the parameter into your callback function.
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: CommunicationsProperties) => void) {
        super.observeData(callback);
    }

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    protected defaultData(): CommunicationsProperties {
        return {
            wifi: {
                enabled: false,
                bars: 0,
                ssid: ''
            },
            telephony: {
                airplaneMode: false,
                bars: 0,
                operator: '',
                type: ''
            },
            bluetooth: {
                enabled: false,
                scanning: false,
                discoverable: false,
                devices: []
            }
        }
    }

}