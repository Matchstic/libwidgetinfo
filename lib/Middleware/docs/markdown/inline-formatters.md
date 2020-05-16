## Syntax: Inline
### Formatters

You can use `formatters` to change how data is displayed when using inline syntax.

For example:

```html
Markup:
<div>{ weather.metadata.updateTimestamp | time }</div>

Rendered:
<div>15:35</div>
```

Note the usage of the pipe (`|`) operator; this signifies that the data to the left should be piped to the formatter on the right.

### Parameters

Formatters can optionally take parameters. This is written as a set of values after the name of the formatter. For example:

```html
<img xui-src="'xui://resource/default/weather/%s.svg' | inject weather.now.condition.code" />
```

Here, the `inject` formatter is used, which inserts the parameter `weather.now.condition.code` into the string on the left.

The important thing to note is how parameters are written: a space seperated list to the right of the formatter name.

### Available formatters

A number of formatters are available to help with common tasks.

These are as follows:

#### `inject`

Injects any number of parameters into the string on the left.

The string must contain a `%s` where the parameters are to be injected.

#### Example:

```html
Markup:
<div>{ 'some %s of %s' | inject 'example' 'text' }</div>

Rendered:
<div>some example of text</div>
```

#### `time`

Formats the left value to a time, respecting the current user's locale settings for 24-hour time.

#### Example:

```html
Markup:
<div>{ weather.metadata.updateTimestamp | time }</div>

Rendered:
<div>15:35</div>
```

#### `date`

Formats the left value to a date, respecting the current user's locale settings.

Parameters:
- **format**:
    - `"dayname"` : Render just the day name, such as "Tuesday"
    - `"short"` : Render with a short format depending on user locale settings, such as DD/MM/YYYY
    - `"long"` : Render in a long format, such as Tuesday 4 April, 2020

#### Example:

```html
Markup:
<div>{ weather.metadata.updateTimestamp | date 'short' }</div>

Rendered:
<div>06/04/2020</div>
```

#### `fallback`

Outputs the left value if it has a length of more than 0, otherwise outputs the parameter as a fallback value.

Parameters:
- **value**:
    - A string to output if the left value is empty

#### Example:

```html
Markup:
<img xui-src="media.nowPlaying.artwork | fallback 'xui://resource/default/media/no-artwork.svg'" />

Rendered (if media.nowPlaying.artwork has contents):
<img src="xui://media/<whatever>" />

Rendered (if media.nowPlaying.artwork has zero contents):
<img src="xui://resource/default/media/no-artwork.svg" />
```