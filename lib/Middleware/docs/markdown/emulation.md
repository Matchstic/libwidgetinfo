## Emulation
### Description

Developing widgets directly on a device can be difficult.

As part of the Xen HTML API, a script is made available to you that you can add into widgets during development. This hooks up a set of default data which you can then use (and modify) to develop your widgets. It also hooks up the widget configuration as detailed [here](widget-setup/configuration.html)

The latest release of it can be downloaded from [here](https://raw.githubusercontent.com/Matchstic/libwidgetinfo/master/emulation/emulation.js).

The version of the script is at the top of the file. You can typically expect it to be updated when new API changes occur. However, you will have to check manually for updates.

### Usage

To use this script, download it to your widget's folder, and then add it to your main HTML file as follows:

```html
<head>
    <script src="emulation.js"></script>
    <!-- everything else below -->
 </head>
 ```

 You MUST place the script as the first entry into your `<head>` element.

 The script will automatically detect if it is running on a real device, and disables itself in that case. However, you MUST remove the script before releasing your widget to a wider audience.

 You are free to edit individual data points in the emulation script. This allows you to check how your widget will function under different conditions.

 ### Caveats

 It is important to note that [Resource Packs](resource-packs.html) do not work when running your widget on a desktop, via `emulation.js`. You will need to test that on a real device.

 ### Future Changes

 It is planned to provide a full desktop emulator, negating the need for this standalone script. Progress on this can be followed [here](https://github.com/Matchstic/Xen-HTML/issues/125).