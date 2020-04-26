## libwidgetinfo

This is an Objective-C and TypeScript API that provides useful data to widgets running in WKWebViews.

The Objective-C layer provides all required extensions to WKWebView necessary to provide such data, and automatically injects the TypeScript API into said webviews.

It is built around a multi-process model:

```
WKWebView <-> SpringBoard (or whatever else) <-> daemon
```

iOS 10 and higher is supported.

### Backwards Compatibility

Support for the following older widget data libraries is as follows:

- InfoStats 2: all functionality provided by the library itself, but no arbitrary calls on e.g. SpringBoard objects
- Widget Weather: all functionality, via interposing the loading of widgetweather.xml
- XenInfo: all functionality, implemented in the TypeScript API layer

### Current Issues

This is currently only built for Xen HTML to integrate with. Using it in other tweaks really doesn't work right now; it'll lead to at least two instances of the daemon running, and class name clashes inside applications. You'll also have issues with `dpkg` trying to overwrite `libwidgetinfo.js`.

### Usage

This project can be bundled by doing the following:

1. Link `libwidgetinfo.a`, `liblogger.a` and `libobjcipc.a` to the main tweak `.dylib`
2. Add the following to your constructor in the tweak:

```objective-c
%ctor {
    // If WidgetWeather is present, defer to it
    if ([[NSFileManager defaultManager] fileExistsAtPath:@"/Library/MobileSubstrate/DynamicLibraries/WWRefresh.dylib"]) {
        [XENDWidgetWeatherURLHandler setHandlerEnabled:NO];
    }
    
    // Set filesystem logging as required
    [XENDLogger setFilesystemLoggingEnabled:YES];
    
    // Initialise library
    [XENDWidgetManager initialiseLibrary];
    
    %init();
}
```

3. Create a wrapper binary for `libwidgetinfodaemon.a`, and setup `main()` as follows:

```objective-c
#import "libwidgetinfo/daemon/Connection/XENDIPCDaemonListener.h"

int main (int argc, const char * argv[]) {
    return libwidgetinfo_main_ipc();
}
```

4. Link `liblogger.a` and `libobjcipc.a` to the daemon wrapper binary
5. Add a LaunchDaemon plist to `/Library/LaunchDaemons/` in the end `.deb`, with the example contents from `daemon/launchd.plist`.
6. Compile the TypeScript layer:

    - Install `npm` and `yarn`
    - `cd` to `libwidgetinfo/lib/Middleware`
    - Run `yarn package`
    - Copy `libwidgetinfo/lib/Middleware/build/libwidgetinfo.js` to `/Library/Application Support/Widgets/` in the end `.deb`
    
### Testbed
    
The Testbed Xcode project allows for running libwidgetinfo in a Simulated mode.

This works out of the box, but you will need to update ViewController.m to point to a widget on your local filesystem.

### Third-party Software

This project makes use of the following:

- [libobjcipc](https://github.com/a1anyip/libobjcipc) (modified)
- [ObjectiveGumbo](https://github.com/thomasdenney/ObjectiveGumbo) (modified)
- [cycript](https://git.saurik.com/cycript.git) (modified)
- [Reachability](https://github.com/tonymillion/Reachability)

### Licensing

libwidgetinfo is available under the AGPLv3.
