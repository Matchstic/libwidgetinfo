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
    - See below for how to setup this field

To allow for existing widgets using older systems to function correctly, your widget must be installed in any of the [Install Locations](layout.html) for this file to be read.

#### **Example and Local Development**

An example widget that shows how to use every possible field, and access them in code, **[is available here](https://incendo.ws/files/config-example-widget.zip)**.

**As described in [Emulation](../emulation.html), widget configuration can be used during development off-device**. Simply update the appropriate section of the script provided on that page with your configuration options, then your code will be able to pick it up.

<hr />

### `options`

The `options` key is where you specify configuration for your widget, that is then shown to the user when applying your widget. This is designed to be flexible - you can even specify nested pages of settings for organisation if you need to.

Here's an idea of what you can build:

![All options](everything.gif)

<hr />

#### **Basics**

Every row in widget settings you display to the user needs to have two properties:

| Property | Usage                        |
|----------|------------------------------|
| type     | The type of the row.         |
| text     | Text to display for the row. |

All rows that set values into your code have two more common properties:

| Property | Usage                                                                                                 |
|----------|-------------------------------------------------------------------------------------------------------|
| key      | The variable name in code that this row should map to. For example, setting `key` to `test` will be accessible as `config.test` in your widget code |
| default  | A default value that is given to your code for the `key` field if the user doesn't fill it in |

All possible row types below have an associated example with them. The usage in code sections all use the `const` JavaScript keyword. If you've not encountered this before, think of it as a `var` that cannot be modified.

A simple example of a widget that has one toggle switch for a setting:

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "switch",
            "text": "Switch input",
            "default": true,
            "key": "switchOne"
        }
    ]
}
```

This renders like so:

![Basic example](basic.png)

And is accessed in code as follows:

```js
if (config.switchOne) {
    // Do something
}
```

Notice how the `key` property of the switch matches up to the code.

<hr />

#### **`title`**

The `title` row lets you place a title above one or more other rows.

**Properties:**

| Property | Required | Usage                                                                                           |
|----------|----------|-------------------------------------------------------------------------------------------------|
| type     |   yes    | Set to `title`                                                                                  |
| text     |   yes    | The text of the title, which is automatically capitalised. Try to keep it short and informative |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "title",
            "text": "Text of the title"
        },
        {
            "type": "switch",
            "text": "Switch input",
            "default": true,
            "key": "switchOne"
        }
    ]
}
```

*An additional switch row is added here to give some context of how it'll look in real-world usage.*

**Screenshot:**

![Title example](title.png)

*An additional switch row is shown here to give some context of how it'll look in real-world usage.*

<hr />

#### **`comment`**

The `comment` row is a way to add informative text below a row. This helps users to understand what an option does if its fairly complicated in its usage.

**Properties:**

| Property | Required | Usage                                                       |
|----------|----------|-------------------------------------------------------------|
| type     |   yes    | Set to `comment`                                            |
| text     |   yes    | The text of the comment. This can be as long as you want! You can specify line breaks by placing `\n` anywhere in your text |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "switch",
            "text": "Switch input",
            "default": true,
            "key": "switchOne"
        },
        {
            "type": "comment",
            "text": "Some super informative text about something.\n\nThis line is rendered as a new paragraph below the previous one!"
        }
    ]
}
```

*An additional switch row is added here to give some context of how it'll look in real-world usage.*

**Screenshot:**

![Comment example](comment.png)

*An additional switch row is shown here to give some context of how it'll look in real-world usage.*

<hr />

#### **`link`**

The `link` row is a way to add links to websites and apps into your widget settings. This is useful to, for example, link to your social media accounts. Alternatively, you could link to a bug tracking page for users to record any issues with your widget.

**Properties:**

| Property | Required | Usage                        |
|----------|----------|------------------------------|
| type     |   yes    | Set to `link`                |
| text     |   yes    | The text describing the link |
| url      |   yes    | The URL the link points to   |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "link",
            "text": "Link to Google",
            "url": "https://google.com"
        }
    ]
}
```

**Screenshot:**

![Link example](link.png)

<hr />

#### **`gap`**

If you want to split up a group of rows, but don't want to add a `title` or `comment` row, you can use a `gap`. This option is the only exception to the rule that every row needs at least a `type` and `text` property.

Note: if you place multiple `gap` rows together, they will be condensed down into a single `gap` row.

**Properties:**

| Property | Required | Usage        |
|----------|----------|--------------|
| type     |   yes    | Set to `gap` |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "switch",
            "text": "Switch input",
            "default": true,
            "key": "switchOne"
        },
        {
            "type": "gap",
        },
        {
            "type": "switch",
            "text": "Another switch",
            "default": false,
            "key": "switchTwo"
        }
    ]
}
```

*Two additional switch rows are added here to give some context of how it'll look in real-world usage*

**Screenshot:**

![Gap example](gap.png)

*Two additional switch rows are shown here to give some context of how it'll look in real-world usage*

<hr />

#### **`switch`**

The `switch` row allows you to ask the user for a `true` or `false` state on a variable, and is displayed as a toggle to turn on or off.

**Properties:**

| Property | Required | Usage                                                              |
|----------|----------|--------------------------------------------------------------------|
| type     |   yes    | Set to `switch`                                                    |
| text     |   yes    | A short descriptive text shown on the left of the switch           |
| key      |   yes    | The variable in your code this switch should map onto              |
| default  |   yes    | Default value of the switch. This must be either `true` or `false` |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "switch",
            "text": "Switch input",
            "default": true,
            "key": "switchVariable"
        }
    ]
}
```

**Screenshot:**

![Switch example](switch.png)

**Usage in code:**

```js
if (config.switchVariable) {
    // Do something
}
```

<hr />

#### **`number`**

The `number` row displays an input box that the user can type a number into. The keyboard is automatically placed into a style that only allows numerical inputs.

**Properties:**

| Property | Required | Usage                                                           |
|----------|----------|-----------------------------------------------------------------|
| type     |   yes    | Set to `number`                                                 |
| text     |   yes    | A short descriptive text shown on the left of the number input  |
| key      |   yes    | The variable in your code the number input should map onto      |
| default  |   yes    | Default value of the number input. This must be a number.       |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "number",
            "text": "Number input",
            "default": 1,
            "key": "numberVariable"
        }
    ]
}
```

**Screenshot:**

![Number example](number.png)

**Usage in code:**

```js
const count = config.numberVariable;
// Do something with count variable - its a number
```

<hr />

#### **`text`**

The `text` row is a configurable text box the user can type any characters into. You can specify different modes, which affect how the text box is displayed to the user.

Auto-correct is disabled on the keyboard, and the first character will be capitalized if the `mode` property is not provided.

**Properties:**

| Property    | Required | Usage                                                                           |
|-------------|----------|---------------------------------------------------------------------------------|
| type        |   yes    | Set to `text`                                                                   |
| text        |   yes    | A short descriptive text shown on the left of the text input                    |
| key         |   yes    | The variable in your code the text input should map onto                        |
| default     |   yes    | Default value of the text input. This must be a string, but can be empty (`""`) |
| placeholder |    no    | Placeholder text to show when the text input is empty                           |
| mode        |    no    | This property changes how the text input is displayed:<br/><br/>• `plain` - the default mode if not set<br/>• `email` - changes the keyboard into a mode that is easier to enter email addresses<br/>• `password` - entered text will be obscured as the user types (useful for API keys)<br/>• `short` - changes the input area into a small block, useful for 4 to 5 letter inputs |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "text",
            "text": "Plain text field",
            "default": "Hello World",
            "key": "textPlain",
            "placeholder": "Example"
        },
        {
            "type": "text",
            "text": "Short text field",
            "default": "",
            "key": "textShort",
            "placeholder": "Text",
            "mode": "short"
        },
        {
            "type": "text",
            "text": "Email field",
            "default": "",
            "key": "textEmail",
            "placeholder": "stevejobs@apple.com",
            "mode": "email"
        },
        {
            "type": "text",
            "text": "Password field",
            "default": "",
            "key": "textPassword",
            "placeholder": "Password",
            "mode": "password"
        }
    ]
}
```

*This example includes all the possible `mode` variations - you only need one text row per variable.*

**Screenshot:**

![Text example](text.png)

**Usage in code:**

```js
// Plain text input from above example
const userText = config.textPlain;
document.getElementById('something').innerText = userText;

// Short text input
const shortText = config.textShort;
if (shortText === 'xyz') {
    // Do something
}

// Email input
const email = config.textEmail;

// Password input - this will be exactly what the user typed, not the obscured text displayed in the UI
const password = config.textPassword;
```

<hr />

#### **`slider`**

The `slider` row allows the user to select a value in a continuous range, such as anything between `0.0` and `1.0`.

Selected values will usually be an arbitrary number of decimal places, but are displayed in the UI as two decimal places.

**Properties:**

| Property    | Required | Usage                                                                       |
|-------------|----------|-----------------------------------------------------------------------------|
| type        |   yes    | Set to `slider`                                                             |
| text        |   yes    | A short descriptive text shown on the top left of the slider                |
| key         |   yes    | The variable in your code the slider should map onto                        |
| default     |   yes    | Default value of the slider. This must be a number, between `min` and `max` |
| min         |   yes    | Minimum value of the slider                                                 |
| max         |   yes    | Maximum value of the slider                                                 |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "slider",
            "min": 0.0,
            "max": 1.0,
            "text": "Slider input",
            "default": 1.0,
            "key": "sliderVariable"
        }
    ]
}
```

**Screenshot:**

![Slider example](slider.png)

**Usage in code:**

```js
// The above config defined this variable to be between 0.0 and 1.0
document.getElementById('movable-element').style.left = (config.sliderVariable * 100) + '%';
```

<hr />

#### **`color`**

The `color` row provides an easy way for users to select a color, with a visual picker. This allows for selecting from a color wheel, adjusting brightness of the color, as well as manually defining RGB values and a hex code.

The chosen color is provided to your code as a 6-character hex string, for example: `#AA66DD`.

**Properties:**

| Property    | Required | Usage                                                                                   |
|-------------|----------|-----------------------------------------------------------------------------------------|
| type        |   yes    | Set to `color`                                                                          |
| text        |   yes    | A short descriptive text shown on left of the color picker. It is also used as the title of the page shown when picking colors. |
| key         |   yes    | The variable in your code the color picker should map onto                              |
| default     |   yes    | Default value of the color picker. This must be a 6-character hex code, prefixed by `#` |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "color",
            "text": "Color input",
            "default": "#FFFFFF",
            "key": "colorSetting",
        }
    ]
}
```

**Video:**

![Color example](color.gif)

**Usage in code:**

```js
// Set background color of some element
document.getElementById('thing').style.backgroundColor = config.colorSetting;
```

<hr />

#### **`option`**

The `option` row gives you the capability to show a multiselect dialog, with pre-defined options. This is then shown to the user as a list of options to tap between.

This supports setting a variable that expects strings, or numbers.

**Properties:**

| Property    | Required | Usage                                                                                   |
|-------------|----------|-----------------------------------------------------------------------------------------|
| type        |   yes    | Set to `option`                                                                          |
| text        |   yes    | A short descriptive text shown on left of the option picker. It is also used as the title of the page shown when picking between options. |
| key         |   yes    | The variable in your code the option picker should map onto                              |
| default     |   yes    | Default value of the color picker. This can be either a string or number, but needs to match any of the `value` fields inside the `options` property |
| options     |   yes    | A pre-defined array of options the user can choose between. Each entry follows the scheme:<br/><br/>• `text` - the text shown to the user to represent this option<br/>• `value` - the value (either a string or number) that this option represents. If this option is selected, this field gets passed into your code |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "text": "Multiselect input (number)",
            "type": "option",
            "default": 1,
            "key": "optionExampleNumber",
            "options": [
                {
                    "text": "First item",
                    "value": 1
                },
                {
                    "text": "Second item",
                    "value": 2
                },
                {
                    "text": "Third item",
                    "value": 3
                }
            ]
        },
        {
            "text": "Multiselect input (string)",
            "type": "option",
            "default": "left",
            "key": "optionExampleString",
            "options": [
                {
                    "text": "Left",
                    "value": "left"
                },
                {
                    "text": "Right",
                    "value": "right"
                },
                {
                    "text": "Up",
                    "value": "up"
                },
                {
                    "text": "Down",
                    "value": "down"
                }
            ]
        }
    ]
}
```

This example shows how the `option` row can work with both strings and numbers. Pay attention to the `default` key in either of the two rows, and notice how it always corresponds to a `value` on any of the provided `options`.

**Video:**

![Option example](option.gif)

**Usage in code:**

```js
// Check the different possible values of the number variant
switch (config.optionExampleNumber) {
    case 1:
        break;
    case 2:
        break;
    case 3:
        break;
}

// Check the different possible values of the string variant
switch (config.optionExampleString) {
    case 'left':
        break;
    case 'right':
        break;
    case 'up':
        break;
    case 'down':
        break;
}
```

<hr />

#### **`page`**

The `page` row is a special case. It allows you to add nested sub-pages of settings to help with organisation.

It follows the same layout as the top-level `options` field of `config.json`.

**Properties:**

| Property    | Required | Usage                                                                                                                |
|-------------|----------|----------------------------------------------------------------------------------------------------------------------|
| type        |   yes    | Set to `page`                                                                                                        |
| text        |   yes    | A short descriptive text shown on left of the page link. It is also used as the title of the page when presented     |
| options     |   yes    | An array of options to show the user. This is the same as the `options` key of `config.json`, but just for this page |

**Example:**

```json
{
    "name": "Config Example",
    "options": [
        {
            "type": "text",
            "text": "Text input",
            "default": "",
            "key": "textVariable",
            "placeholder": "Example"
        },
        {
            "type": "page",
            "text": "Another page",
            "options": [
                {
                    "type": "title",
                    "text": "Second page"
                },
                {
                    "type": "switch",
                    "text": "Switch input 2",
                    "default": true,
                    "key": "switchTwo"
                },
                {
                    "type": "comment",
                    "text": "This is an example comment on a second page"
                }
            ]
        }
    ]
}
```

This example has an extra text input field above the `page` row, and a few rows inside the `options` of the `page` row; a more real-world use case.

**Video:**

![Page example](page.gif)

<hr />

### Legacy Widget Configuration

Existing legacy systems for widget settings are supported for widgets that need them. These are as follows:

- `Options.plist`
    - The widget must be installed in the `iWidgets` folder
- `config.js` (case in-sensitive)
    - Will be loaded as a fallback if `Options.plist` cannot be found

**New widgets shouldn't be using these** - they're only supported for compatibility reasons.