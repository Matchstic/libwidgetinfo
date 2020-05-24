## Native JavaScript APIs
### Description

Since widgets effectively run inside a web browser, you have full access to all native APIs exposed to JavaScript.

These are categoried here: [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API).

### Caveats

Be aware that because widgets run from local files, some Web APIs may not work as expected.

Therefore, some have been adjusted to work inside the context of a widget, whilst others are non-functional. This is detailed below:

| Name                 | Working?    | Notes                                                    |
|----------------------|-------------|----------------------------------------------------------|
| DeviceMotionEvent    | Y           | requestPermission() is patched to be always granted      |
| Geolocation          | N           | This is unavailable since widgets run inside SpringBoard |
| WebRTC               | Partial     | The device camera is not available to local webpages     |


This table is incomplete.
You can help improve it by creating a new ticket [here](https://github.com/Matchstic/libwidgetinfo/issues) for APIs that are not available.

### `toLocaleTimeString`

To support 24- versus 12-hour time, the `toLocaleTimeString` function on `Date` objects has been hooked to automatically request 12-hour time if `api.system.isTwentyFourHourTimeEnabled` is `true`.

To disable this behaviour, you need to use it like follows:

```js
var date = new Date();
var timestring = date.toLocaleTimeString(undefined, { 'no12HourHook': true, ... /* any other options */ });
```


