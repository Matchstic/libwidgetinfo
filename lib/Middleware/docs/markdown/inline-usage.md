
## Syntax: Inline
### Usage

Inline syntax can be written directly inside elements using the `{ }` delimeters, or can be used to bind data directly to attributes in your HTML.

When using the `{ }` delimeters, you can access anything in the Xen HTML API; you simply omit the `api.` prefix.

### Attributes
Replicated from: [tinybind reference](https://blikblum.github.io/tinybind/docs/reference/)</a>

#### `[attribute]`

Sets the value of an attribute (whatever value is in place of `[attribute]`) on the element.

```html
<input type="text" xui-placeholder="media.currentTrack.artist.name" />
```

#### `show`

Shows the element when the value evaluates to true and hides the element when the value evaluates to false.

```html
<p xui-show="media.isPlaying">is playing</p>
```

#### `hide`

Hides the element when the value evaluates to true and shows the element when the value evaluates to false.

```html
<section xui-hide="media.isStopped"></section>
```

#### `enabled`

Enables the element when the value evaluates to true and disables the element when the value evaluates to false.

```html
<button xui-enabled="system.isNetworkConnected">Disconnect</button>
```

#### `disabled`

Disables the element when the value evaluates to true and enables the element when the value evaluates to false.

```html
<div xui-disabled="system.isLowPowerModeEnabled"></div>
```

#### `if`

Inserts the element as well as it's child nodes into the DOM when the value evaluates to true and removes the element when the value evaluates to false.

```html
<section xui-if="weather.now._isValid"></section>
```

#### `on-[event]`

Binds an event listener on the element using the event specified in [event] and the bound object (should return a function) as the callback.

If the end value of the binding changes to a different function, this binder will automatically unbind the old callback and bind a new listener to the new function.

```html
<button xui-on-click="media.togglePlayState">Pause</button>
```

#### `each-[item]`

Appends a new instance of the element in place for each item in an array. Each element is bound in a scope with three special properties:

- the current iterated item in the array, named whatever value is in place of `[item]`
- `$index`: the current iterated item index. Can be configured by setting index-property attribute
- `$parent`: the parent scope, if any

```html
<ul>
  <li xui-each-forecast="weather.hourly" xui-data-id="forecast.hourIndex">
    <span>{ forecast.temperature.feelsLike }</span>
  </li>
<ul>
```

#### `class-[classname]`

Adds a class (whatever value is in place of `[classname]`) on the element when the value evaluates to true and removes that class if the value evaluates to false.

```html
<li xui-class-playing="media.isPlaying">{ media.currentTrack.artist.name }</li>
```