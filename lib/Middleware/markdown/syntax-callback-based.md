## Syntax: Callback-based

You are free to interact with the Widget API through pure JavaScript. This is typically done through registering callback functions, which are then executed whenever data changes.

It is recommended to setup these callbacks during an `onload` event for the document, which are then fired immediately to update you with initial data.

### Example

The following sets up a callback for the Weather data provider:

```js
function onload() {
    // Configure callback
    api.weather.observeData(function (data) {
        // Read changes directly from the `data` parameter:
        document.getElementById('#temperature') = data.now.temperature.current;

        // Or, use the `api` namespace:
        document.getElementById('#city') = api.weather.metadata.location.city;
    });
}
```

This observation pattern is identical across all data providers. As mentioned previously, these callbacks will be called immediately after they are registered, meaning you do not need to manually do an initial update.