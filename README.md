## libwidgetinfo

This is an Objective-C and TypeScript API that provides useful data to widgets running in WKWebViews.

The Objective-C layer provides all required extensions to WKWebView necessary to provide such data, and automatically injects the TypeScript API into said webviews.

It is built around a multi-process model:

```
WKWebView <-> SpringBoard (or whatever else) <-> daemon
```

### Backwards Compatibility

Support for the following older widget data libraries is as follows:

- InfoStats 2: all functionality provided by the library itself, but no arbitrary calls on e.g. SpringBoard objects
- GroovyAPI: all functionality
- Exo: ported to, and utilised in, the TypeScript API layer

### Current Issues

This is currently only built for Xen HTML to integrate with. Using it in other tweaks really doesn't work right now. You'll end up with some really nasty things going on with `dpkg` and `launchd`.

### Usage

This project can be bundled by doing the following:

1. Link `libwidgetinfo.a` to the main tweak `.dylib`
2. Create a wrapper binary for `libwidgetinfodaemon.a`, and setup `main()` as follows:

```
#import "libwidgetinfo/daemon/Connection/XENDXPCDaemonListener.h"

int main() {
    return libwidgetinfo_main(nil);
}
```

3. Add a LaunchDaemon plist to `/Library/LaunchDaemons/` in the end `.deb`, with the example contents from `daemon/launchd.plist`.
4. Compile the TypeScript layer:

    - Install `npm` and `yarn`
    - `cd` to `libwidgetinfo/lib/Middleware`
    - Run `yarn package`
    - Copy `libwidgetinfo/lib/Middleware/build/libwidgetinfo.js` to `/Library/Application Support/libwidgetinfo/` in the end `.deb`
    
    ### Testbed
    
    The Testbed Xcode project allows for running libwidgetinfo in a Simulated mode.
    
    This works out of the box, but you will need to update ViewController.m to point to a widget on your local filesystem.
