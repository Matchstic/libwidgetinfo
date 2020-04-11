## Syntax: Inline Data

The Widget API allows you to completely avoid writing JavaScript in many cases. This is through the use of `Inline Syntax`, with the idea that you are able to reference data directly in your HTML markup.

An example is as follows:

```html
<div>
    <p id="temperature">{ weather.now.temperature.current }</p>
    <p id="city">{ weather.metadata.address.city }</p>
</div>
```

This will automatically be updated whenever changes happen to the data, meaning the above is all you need for a simple widget.

### Behind the scenes

For this to work, the Widget API integrates with [tinybind](https://blikblum.github.io/tinybind/). This integration means that all features of `tinybind` are available by default, and is not limited to replacing text inside of elements.

### Usage
Replicated from: [tinybind reference](https://blikblum.github.io/tinybind/docs/reference/)</a>

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
    <img xui-src="'xui://resource/default/weather/' + forecast.condition.code + '.svg'" />
    <span>{ forecast.temperature.feelsLike }</span>
  </li>
<ul>
```

#### `class-[classname]`

Adds a class (whatever value is in place of `[classname]`) on the element when the value evaluates to true and removes that class if the value evaluates to false.

```html
<li xui-class-playing="media.isPlaying">{ media.currentTrack.artist.name }</li>
```