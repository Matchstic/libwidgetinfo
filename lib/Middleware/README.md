## Introduction

The Xen HTML API aims to be a combination of all previous attempts to bridge iOS and JavaScript-based widgets.

In all widgets, you have access to the `api` object in the global namespace. This serves as entrypoint to the Xen HTML API, making access to it simple.

### Syntax

The Xen HTML API provides two approaches for interaction: **[Inline](additional-documentation/syntax:-inline-data.html)**, and **[JavaScript](additional-documentation/syntax:-javascript.html)**.

Both can be used interchangably inside the same widget.

The **JavaScript Syntax** is the approach all developers will be used to; writing code to interact with an API. It relies on the idea of callbacks to notify your code when new data is available, for you to then handle appropriately.

In constrast, the new **Inline Syntax** uses the idea of data binding. It allows you to build widgets that can fit in a single Tweet:

```html
<html><head></head><body><p>{ weather.now.temperature.current }</p></body></html>
```

The end result is that you no longer have to rely on JavaScript to write widgets, with basic implementations just requiring HTML and CSS.

### Other features and improvements

A number of other features and improvements are also made available through the Xen HTML API:

- [Resource Packs](additional-documentation/resource-packs.html)
    - This allows for sharing resources between widgets, such as icons and backgrounds
- [Logging](additional-documentation/logging.html)
    - Access real-time logs from your widgets
- [Widget Layout](additional-documentation/widget-setup/layout.html)
    - A central (and organised) folder on the filesystem to install widgets
- [Improved Configuration](additional-documentation/widget-setup/configuration.html)
    - Simplified settings interfaces for widgets
- [URL Scheme Handling](additional-documentation/url-scheme-handling.html)
    - Open URLs in Safari and deep link to installed apps

### Example widgets

A number of example widgets are available to use for learning the API, or simply to use on a daily basis.

After installing Xen HTML, these can be found at `/var/mobile/Library/Widgets/Universal`. More information can be found [here](additional-documentation/widget-setup/examples.html)

### Backwards compatibility

Backwards compatibility is provided to older widgets, allowing them to run on newer versions of iOS.

Support is available for widgets that need:

- XenInfo
- WidgetWeather
- InfoStats 2 (and 1)
- myLocation

This works "by magic". There is no need to install anything else, or make any changes to widgets.

It is strongly recommended to write new widgets that target the Xen HTML API, to gain access to newer features.

### iOS version compatibility

The Xen HTML API is available on iOS 10 and later. This is due to reliance on some ES6 features not available on prior iOS versions.
