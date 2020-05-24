## Emulation
### Description

Developing widgets directly on a device can be difficult.

As part of the Xen Widget API, a script is made available to you that you can add into widgets during development. This hooks up a set of default data which you can then use (and modify) to develop your widgets.

It can be downloaded from [here](https://raw.githubusercontent.com/Matchstic/libwidgetinfo/master/emulation/emulation.js).

The version of the script is at the top of the file. You can typically expect it to be updated when new API changes occur.

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

 You are free to edit individual data points in the emulation script. This is to allow you to check how your widget will function under different conditions.

 ### Future Changes

 It is planned to provide a full desktop emulator, negating the need for this standalone script. Progress on this can be followed [here](https://github.com/Matchstic/Xen-HTML/issues/125).