## Syntax: JavaScript
### Description

You are free to interact with the Xen HTML API through pure JavaScript. This is typically done through registering callback functions, which are then executed whenever data changes.

It is recommended to setup these callbacks during an `onload` event for the document, which are then fired after the widget finished loading to update you with initial data. They are also fired whenever data changes during the lifetime of the widget.

### Example

The following sets up a callback for the Weather data provider:

```js
function onload() {
    // Configure callback
    api.weather.observeData(function (newData) {
        // Read changes directly from the `newData` parameter:
        document.getElementById('#temperature') = newData.now.temperature.current;

        // Or, use the `api` namespace:
        document.getElementById('#city') = api.weather.metadata.location.city;
    });
}
```

This observation pattern is identical across all data providers.

### Initial load

It is important to be aware that widget data is loaded asynchronously; it is **not available when your `onload` function is ran**. This is why you should register a callback instead, since this will be called as soon as data becomes available. The delay is typically in the order of a few milliseconds.

### Assumed knowledge

When building widgets to be callback-based, it is assumed that you have an understanding of how JavaScript works. Particularly, you should know how to work with the following data types:

- `number`
- `string`
- `boolean`
- `Date`
- `object`

If not, it's easy to learn! Since widgets are effectively webpages, you can use any resource that teaches how to work with JavaScript. Recommended resources are as follows:

- [W3Schools](https://www.w3schools.com/)
- [Mozilla web docs (MDN)](https://developer.mozilla.org/en-US/)

Of course, you can skip these resources and dive right in! The provided [example widgets](widget-setup/examples.html) show you the basics on how to work with these types.