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
 * @ignore
 */
export default class Applications extends Base implements ApplicationsProperties {

    /////////////////////////////////////////////////////////
    // ApplicationsProperties stub implementation
    /////////////////////////////////////////////////////////

    allApplications: ApplicationMetadata[];

    // Replicate here for documentation purposes
    /**
     * Register a function that gets called whenever the data of this
     * provider changes.
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
     */
    public get userApplications(): ApplicationMetadata[] {
        return this.allApplications.filter((app: ApplicationMetadata) => {
            return !app.isSystemApplication;
        });
    }

    /**
     * Provides a filtered list of applications to only those that are system applications
     */
    public get systemApplications(): ApplicationMetadata[] {
        return this.allApplications.filter((app: ApplicationMetadata) => {
            return app.isSystemApplication;
        });
    }

    /**
     * Launches an application, requesting a device unlock if necessary
     * @param bundleIdentifier The application to launch
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
     */
    public async deleteApplication(bundleIdentifier: string): Promise<NativeError> {
        return new Promise<NativeError>((resolve, reject) => {
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