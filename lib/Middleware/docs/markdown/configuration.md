## Widget Configuration
### Description

The `config.json` file contains all metadata about your widget. It is set out like a `package.json` file from NPM modules, and allows you to specify sizes of the widget, alongside any options you want the user to choose from.

This file is located at the root of your widget, next to `index.html`.

### Keys

For now, the following keys are recognised:

- `name` (optional)
    - The name of the widget, if different from the folder name
    - This is shown to the user when choosing widgets to apply
- `author`
    - The author's name
- `size` (optional)
    - Specifies the width and height of your widget
    - This can be in `"px"`, or percentage of the screen size
    - Allowed keys:
        - `width`: set as `"px"` or `"%"`
        - `max-width`: set as `"px"`
        - `height`: set as `"px"` or `"%"`
        - `max-height`: set as `"px"`
    - All default widgets include this field, which are useful as an example
- `options` (optional)
    - A list of options to be displayed for the widget
    - Not yet available

To allow for existing widgets using older systems to function correctly, your widget must be installed in any of the [Install Locations](layout.html) for this file to be read.

### `options`

**Available in Xen HTML v2.0 beta 8 or newer**

The `options` key is where you specify configuration for your widget, that is then shown to the user when applying your widget. This is designed to be flexible - you can specify nested pages of settings for organisation if you need to.

The basic layout of this field is as follows:

(Sorry, not yet finalised!)

### Legacy

Widget preferences are currently using existing legacy systems, meaning that a new preferences API will become available as part of the new `config.json` system. This will be in beta 8.

Right now, the following preference systems are respected in the Settings app:

- `Options.plist`
    - The widget must either be installed in the `iWidgets` folder, or in any of the [Install Locations](layout.html)
- `config.js` (case in-sensitive)
    - Will be loaded as a fallback if `Options.plist` cannot be found

**New widgets shouldn't be using these** - they're only supported for compatibility reasons.