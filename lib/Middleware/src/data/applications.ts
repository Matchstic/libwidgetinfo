import { Base, NativeError, DataProviderUpdateNamespace } from '../types';

/**
 * Specifies a set of data about an application on the user's device.
 */
export interface ApplicationMetadata {
    /**
     * The name of the application
     */
    name: string;

    /**
     * The bundle identifier of the application, such as `"com.apple.mobilesafari"`
     */
    identifier: string;

    /**
     * The URL to the application's icon.
     *
     * This is ready to be set as the `src` attribute of an `<img>` tag
     */
    icon: string;

    /**
     * The current badge text for this application
     */
    badge: string;

    /**
     * Specifies if this application is currently being installed
     */
    isInstalling: boolean;

    /**
     * Specifies if this application is a system app (e.g., installed to `/Applications`).
     *
     * Any application installed from Cydia/Zebra/Sileo will have this set as `true`.
     *
     * A system app cannot be uninstalled.
     */
    isSystemApplication: boolean;
}

/**
 * @ignore
 */
export interface ApplicationsProperties {
    allApplications: ApplicationMetadata[];
}

/**
 * The Applications data provider aims to provide detail and functionality around applications on the user's device.
 *
 * This includes both user-installed and system apps, which includes those installed by a package manager.
 *
 * @example
 * <script>
 * api.apps.observeData(function(newData) {
 *              console.log('Applications data has updated');
 *
 *              // Update UI for new apps
 *              doSomethingWithAllApps(newData.allApplications);
 *
 *              // Perhaps setup a dock
 *              document.getElementById('dockAppOne').src = api.apps.applicationForIdentifier('com.apple.Music').icon;
 *              document.getElementById('dockAppTwo').src = api.apps.applicationForIdentifier('com.apple.MobileSMS').icon;
 *              // ... and so on
 * });
 * </script>
 */
export default class Applications extends Base implements ApplicationsProperties {

    /////////////////////////////////////////////////////////
    // ApplicationsProperties stub implementation
    /////////////////////////////////////////////////////////

    /**
     * This is an alphabetically ordered list of all applications installed currently on the user's device.
     *
     * It represents all apps that are shown on the user's Homescreen, and is a combination of both user and 'sysem' apps.
     *
     * It is expected that you will use native JavaScript functions like map(), forEach() and
     * find() to work with this array of applications.
     */
    allApplications: ApplicationMetadata[];

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
     *
     * Cases where you will be notified of changes:
     * - An application has been uninstalled or installed
     * - An application's badge gets updated
     *
     * The new data is provided as the parameter into your callback function.
     *
     * @param callback A callback that is notified whenever the provider's data change
     */
    public observeData(callback: (newData: ApplicationsProperties) => void) {
        super.observeData(callback);
    }

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    /**
     * Provides a filtered list of applications to only those that are user-installed
     *
     * @example
     * <script>
     * var userApps = api.apps.userApplications;
     * </script>
     */
    public get userApplications(): ApplicationMetadata[] {
        return this.allApplications.filter((app: ApplicationMetadata) => {
            return !app.isSystemApplication;
        });
    }

    /**
     * Provides a filtered list of applications to only those that are system applications.
     *
     * An application is a 'system' app if it cannot be uninstalled
     *
     * @example
     * <script>
     * var systemApps = api.apps.systemApplications;
     * </script>
     */
    public get systemApplications(): ApplicationMetadata[] {
        return this.allApplications.filter((app: ApplicationMetadata) => {
            return app.isSystemApplication;
        });
    }

    /**
     * A convenience function to get data for a specific application, provided that it is present on the user's device
     * @param bundleIdentifier Application bundle identifier to lookup
     *
     * @example
     * <script>
     * var messagesApp = api.apps.applicationForIdentifier("com.apple.MobileSMS");
     * var unreadMessages = messagesApp.badge;
     * document.getElementById('appIcon').src = messagesApp.icon;
     * </script>
     */
    public applicationForIdentifier(bundleIdentifier: string): ApplicationMetadata {
        return this.allApplications.find((v: ApplicationMetadata) => {
            return v.identifier === bundleIdentifier;
        });
    }

    /**
     * A convenience function to check if a particular application is present on the user's device
     * @param bundleIdentifier Application bundle identifier to lookup
     *
     * @example
     * <script>
     * var spotifyInstalled = api.apps.applicationIsPresent("com.spotify.client");
     * </script>
     */
    public applicationIsPresent(bundleIndentifier: string): boolean {
        return this.applicationForIdentifier(bundleIndentifier) !== undefined;
    }

    /**
     * Launches an application, requesting a device unlock if necessary
     * @param bundleIdentifier The application to launch
     *
     * @example
     * <script>
     * api.apps.launchApplication("com.apple.Music");
     * </script>
     */
    public async launchApplication(bundleIdentifier: string): Promise<NativeError> {
        return new Promise<NativeError>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Applications,
                functionDefinition: 'launchApplication',
                data: { identifier: bundleIdentifier }
            }, (error: NativeError) => {
                resolve(error);
            });
        });
    }

    /**
     * Deletes an application from the user's device
     * The user will be requested to confirm this action by a dialog.
     * @param identifier The application to delete
     *
     * @example
     * <script>
     * api.apps.deleteApplication("com.cardify.tinder");
     * </script>
     */
    public async deleteApplication(bundleIdentifier: string): Promise<NativeError> {
        return new Promise<NativeError>((resolve, reject) => {
            const app = this.applicationForIdentifier(bundleIdentifier);
            if (app.isSystemApplication) {
                resolve({ code: 0, message: '' });
                return;
            }

            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Applications,
                functionDefinition: 'deleteApplication',
                data: { identifier: bundleIdentifier }
            }, (error: NativeError) => {
                resolve(error);
            });
        });
    }
}