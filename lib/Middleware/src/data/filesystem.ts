import { Base, DataProviderUpdateNamespace } from '../types';

/**
 * Each method can return an error code which is documented here
 */
enum FilesystemErrorCode {
    /**
     * Equals -3
     *
     * Reading a file failed since it doesn't exist
     */
    MissingFile     = -3,

    /**
     * Equals -2
     * Missing data was expected by the filesystem API
     */
    BadRequest      = -2,

    /**
     * Equals -1
     *
     * Usually raised when trying to read a file outside /var/mobile,
     * or writing/deleting a file when not running inside SpringBoard
     */
    SecurityError   = -1,

    /**
     * Equals 0
     *
     * Default - no problems
     */
    OK              = 0
}

enum FileType {
    /**
     * A block special file
     */
    'NSFileTypeBlockSpecial',

    /**
     * A character special file
     */
    'NSFileTypeCharacterSpecial',

    /**
     * A directory
     */
    'NSFileTypeDirectory',

    /**
     * A regular file
     */
    'NSFileTypeRegular',

    /**
     * A socket
     */
    'NSFileTypeSocket',

    /**
     * A symbolic link
     */
    'NSFileTypeSymbolicLink'
}

/**
 * Metadata for a given file or directory on the filesystem
 */
interface FilesystemMetadata {
    /**
     * Shorthand check for whether this item is a file or directory
     */
    isDirectory: boolean;

    /**
     * Type of the underlying item
     */
    type: FileType;

    /**
     * UNIX timestamp of when the file was created
     */
    created: number;

    /**
     * UNIX timestamp of when the file was last modified
     */
    modified: number;

    /**
     * Size of the file in bytes
     */
    size: number;

    /**
     * Permissions of the file as a decimal
     *
     * You will need to do bitshift operations to check for particular
     * flags, or convert to octal for rendering purposes
     */
    permissions: number;

    /**
     * Owner of the item
     */
    owner: string;

    /**
     * Group of the item
     */
    group: string;
}

/**
 * The Filesystem provider gives access to filesystem operations including
 * read, write, and delete.
 *
 * You cannot read contents of files outside of <code>/var/mobile</code> for security purposes,
 * and you also cannot write/delete files when the widget is being previewed in Settings.
 *
 * All functions provided can be called at any time in your scripts.
 *
 * You can also use the Fileystem API to create your own Settings UI inside your widget. This gives you
 * full control over the presentation of settings, and to apply any logic as needed.
 */
export default class Filesystem extends Base {

    /////////////////////////////////////////////////////////
    // Implementation
    /////////////////////////////////////////////////////////

    /**
     * Reads the contents of a file from the filesystem
     *
     * This method supports reading plaintext files, alongside plist documents. The latter
     * is automatically translated into JSON for you. Make sure to set the <code>mimetype</code>
     * parameter to switch between these two options.
     *
     * The return type is a Promise, which either resolves to your data, or rejects with an error code
     * (listed in {@link FilesystemErrorCode})
     *
     * @example
     *
     * <script>
     * // Reading from a text file:
     * api.fs.read('/path/to/file.txt').then((data) => {
     *     // data is a string
     *     console.log(data);
     * }).catch((error) => {
     *     // Handle error when reading the file
     * });
     *
     * // Reading from a plist file:
     * api.fs.read('/path/to/file.plist', 'plist').then((data) => {
     *     // data is an object, with keys corresponding to whatever is in the plist
     *     console.log(data);
     * }).catch((error) => {
     *     // Handle error when reading the file
     * });
     *
     * // You can read JSON directly without having to call `JSON.parse()`:
     * api.fs.read('/path/to/file.json').then((data) => {
     *     // assuming data is an object like: { size: 10 }
     *     console.log(data.size);
     * }).catch((error) => {
     *     // Handle error when reading the file
     * });
     * </script>
     *
     * @param path Path to read from
     * @param mimetype Expected type of the data, either <code>text</code> or <code>plist</code>. Default is <code>text</code>
     */
    public async read(path: string, mimetype?: string): Promise<string | Object> {
        return new Promise<string | Object>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Filesystem,
                functionDefinition: 'read',
                data: {
                    path,
                    mimetype: mimetype ? mimetype : 'text'
                }
            }, (data: any) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.result);
                }
            });
        });
    }

    /**
     * Writes the provided content to the filesystem
     *
     * This method supports writing plaintext files, alongside plist documents. The latter
     * is automatically translated from JSON into plist format for you. Make sure to set the
     * <code>mimetype</code> parameter to switch between these two options.
     *
     * If any parent folder in your path doesn't exist, this will error.
     *
     * The return type is a Promise, which either resolves to <code>true</code>, or rejects with an error code
     * (listed in {@link FilesystemErrorCode})
     *
     * @example
     *
     * <script>
     * // Writing text to a file:
     * api.fs.write('/path/to/file.txt', 'example string to write').catch((error) => {
     *     // Handle error when writing the file
     * });
     *
     * // Writing a plist from an object:
     * api.fs.write('/path/to/file.plist', { data: 'test' }, 'plist').catch((error) => {
     *     // Handle error when writing the file
     * });
     *
     * // You can write JSON content without needing to `JSON.stringify` an object first:
     * api.fs.write('/path/to/file.json', { data: 'test' }).catch((error) => {
     *     // Handle error when writing the file
     * });
     * </script>
     *
     * @param path Path to write to
     * @param content Content to write
     * @param mimetype Type of the data to write, either <code>text</code> or <code>plist</code>. Default is <code>text</code>
     */
    public async write(path: string, content: string | Object, mimetype?: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Filesystem,
                functionDefinition: 'write',
                data: {
                    path,
                    mimetype: mimetype ? mimetype : 'text', content
                }
            }, (data: any) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Deletes the provided path from the filesystem
     *
     * The return type is a Promise, which either resolves to <code>true</code>, or rejects with an error code
     * (listed in {@link FilesystemErrorCode})
     *
     * @example
     * <script>
     * api.fs.delete('/path/to/file.txt').catch((error) => {
     *              // Handle error when deleting the file
     * });
     * </script>
     *
     * @param path Path to delete
     */
    public async delete(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Filesystem,
                functionDefinition: 'delete',
                data: { path }
            }, (data: any) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Checks whether a given path exists on the filesystem; it handles checking for both files
     * and directories.
     *
     * This method has lessened security, and allows checking any file or directory on the device.
     *
     * The return type is a Promise, which resolves to <code>true</code> or <code>false</code>
     *
     * @example
     * <script>
     * api.fs.exists('/path/to/file.txt').then((exists) => {
     *
     * }).catch((error) => {
     *              // Handle error
     * });
     * </script>
     *
     * @param path Path to check
     */
    public async exists(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Filesystem,
                functionDefinition: 'exists',
                data: { path }
            }, (data: any) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.result);
                }
            });
        });
    }

    /**
     * Lists all items in a directory
     *
     * The return type is a Promise, which either resolves to <code>string[]</code>, or rejects with an error code
     * (listed in {@link FilesystemErrorCode})
     *
     * If the directory doesn't exist or its actually a file, this will error!
     *
     * @example
     * <script>
     * api.fs.list('/path/to/directory').then((list) => {
     *              // list is an array of strings
     *              // e.g., [ "file.txt", "thing.json", "subdirectory1", ... ]
     * }).catch((error) => {
     *              // Handle error
     * });
     * </script>
     *
     * @param path Directory to list contents of
     */
    public async list(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Filesystem,
                functionDefinition: 'list',
                data: { path }
            }, (data: any) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.results);
                }
            });
        });
    }

    /**
     * Creates a new directory
     *
     * The return type is a Promise, which either resolves to <code>true</code>, or rejects with an error code
     * (listed in {@link FilesystemErrorCode})
     *
     * @example
     * <script>
     * api.fs.mkdir('/path/to/new/directory').catch((error) => {
     *              // Handle error when creating the directory
     * });
     * </script>
     *
     * @param path Directory path to create
     * @param createIntermediate Whether to create parent directories if they also do not exist yet. Defaults to true
     */
    public async mkdir(path: string, createIntermediate?: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Filesystem,
                functionDefinition: 'mkdir',
                data: {
                    path,
                    createIntermediate: createIntermediate !== undefined ? createIntermediate : true
                }
            }, (data: any) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Looks up metadata for a given file or directory
     *
     * This method has lessened security, and allows lookup for any file or directory on the device.
     *
     * The return type is a Promise, which either resolves to a metadata object ({@link FilesystemMetadata}), or rejects
     * with an error code (listed in {@link FilesystemErrorCode})
     *
     * @example
     * <script>
     * api.fs.metadata('/path/to/file/or/directory').then((metadata) => {
     *              // Metadata can now be worked with
     * }).catch((error) => {
     *              // Handle error
     * });
     * </script>
     *
     * @param path Path to lookup
     */
    public async metadata(path: string): Promise<FilesystemMetadata> {
        return new Promise<FilesystemMetadata>((resolve, reject) => {
            this.connection.sendNativeMessage({
                namespace: DataProviderUpdateNamespace.Filesystem,
                functionDefinition: 'metadata',
                data: { path }
            }, (data: any) => {
                const error = data.error;

                if (error && error !== 0) {
                    reject(error);
                } else {
                    resolve(data.result);
                }
            });
        });
    }

    private preferencesPath() {
        return '/var/mobile/Library/Preferences';
    }

    /**
     * This is a helper function around read() that loads JSON-based preferences for a given
     * identifier.
     *
     * If no preferences exist, this will give you an empty object.
     *
     * Using this allows you to write your own Settings interface inside your widget.
     *
     * The return type is a Promise, which either resolves to your data, or rejects with an error code
     * (listed in {@link FilesystemErrorCode})
     *
     * @example
     *
     * <script>
     * api.fs.preferencesLoad('com.example.widget').then((preferences) => {
     *     // assuming preferences is an object like: { size: 10 }
     *     console.log(preferences.size);
     * }).catch((error) => {
     *     // Handle error when loading
     * });
     * </script>
     *
     * @param identifier A unique identifier for your widget. e.g., "com.example.widget"
     */
    public async preferencesLoad(identifier: string): Promise<any> {
        const path = `${this.preferencesPath()}/${identifier}.json`;
        try {
            return await this.read(path);
        } catch (e) {
            return {};
        }
    }

    /**
     * This is a helper function around write() that stores JSON-based preferences for a given
     * identifier. The storage location can be backed up automatically to iCloud, the same way
     * tweak preferences are.
     *
     * Using this allows you to write your own Settings interface inside your widget.
     *
     * The return type is a Promise, which either resolves to <code>true</code>, or rejects with an error code
     * (listed in {@link FilesystemErrorCode})
     *
     * @example
     *
     * <script>
     * api.fs.preferencesWrite('com.example.widget', { size: 10 }).catch((error) => {
     *     // Handle error when saving preferences
     * });
     * </script>
     *
     * @param identifier A unique identifier for your widget. e.g., "com.example.widget"
     * @param object JSON object to store
     */
    public async preferencesWrite(identifier: string, object: any): Promise<boolean> {
        const path = `${this.preferencesPath()}/${identifier}.json`;
        return this.write(path, object);
    }
}