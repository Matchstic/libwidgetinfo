## Syntax: Inline Data
### Description

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