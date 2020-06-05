## Logging
### Description

The Xen HTML API allows you to view logs from your widgets in real-time, on a Mac. You can use this by simply using these built-in JavaScript functions:

- `console.log`
- `console.info`
- `console.warn`
- `console.error`

### Filesystem logging

You can setup Xen HTML to log these messages to the filesystem.

To turn this on, go to Settings -> Xen HTML -> Advanced, and enable "Widget Logging". You will need to respring to apply this change.

Logs can then be found in the following directory: `/var/mobile/Library/Logs/Xen-HTML/`.

### Realtime monitoring (macOS)

Any log messages will appear in the built-in Console application of macOS when your device is connected over USB. You can search for the name of your widget to filter out everything else.

For example, the logs for the widget `Weather | Card` can be found by searching for `"Weather | Card"` in Console, when viewing your device.

### Realtime monitoring (SSH)

You can also view realtime logs over SSH. This requires filesystem logging to be enabled first.

First, connect to your device in a terminal via SSH. Then, run the following command:

`tail -f "/var/mobile/Library/Logs/Xen-HTML/<name-of-your-widget>.log"`

Make sure to replace `<name-of-your-widget>` with the folder name of your widget.