## Introduction

The Widget API aims to be a combination of all previous attempts to bridge iOS and JavaScript-based widgets.

In all widgets, you have access to the `api` object in the global namespace. This serves as entrypoint to the Widget API, making access to it simple.

Through the use of the new **Inline Syntax**, you can build widgets that can fit in a single Tweet:

```html
<html><head></head><body><p>{ weather.now.temperature.current }</p></body></html>
```

The end result is that you no longer have to rely on JavaScript to write widgets, with basic implementations just requiring HTML and CSS.

### Syntax

The Widget API provides two approaches for interaction: **[Inline](additional-documentation/syntax:-inline-data.html)**, and **[Callback-based](additional-documentation/syntax:-callback-based.html)**.

Both can be used interchangably inside the same widget.

### Other features

A number of other features are also made available through the Widget API:

- [Resource Packs](additional-documentation/resource-packs.html)
    - This allows for sharing resources between widgets, such as icons and backgrounds

### Backwards compatibility

Backwards compatibility is provided to older widgets, allowing them to run on newer versions of iOS.

Support is available for widgets that need:

- XenInfo
- WidgetWeather
- InfoStats 2

This works "by magic". There is no need to install anything else, or make any changes to widgets.

It is strongly recommended to write new widgets that target the Widget API, to gain access to newer features.

### iOS version compatibility

The Widget API is available on iOS 10 and later. This is due to reliance on some ES6 features not available on prior iOS versions.