## Image Packs

The widget API allows you to provide image packs to share resources between widgets. This is to help reduce the download size of widgets, and also to access a variety of iconography installed by default.

### Usage

You can use image packs by referencing images via a new URI scheme:

```
<img src="xui://images/default/weather/1.svg" />
```

This will load an image with its source set to a `weather` icon from the `default` image pack. Anywhere a URL can be referenced, you can use an image pack, including in CSS.

### Breakdown of URI scheme

As shown above, the `xui://` URI scheme is use to load a resource from an image pack. The format is broken down as follows:

- `xui://`
    - Specifies to load via the widget library
- `images`
    - Specifies to load from an image pack
- `default`
    - The name of the widget pack to load from
    - This is where to specify the folder name of your image pack. For example, specifying `my-great-pack` would try to load from the `my-great-pack` subfolder inside `/Library/Application Support/Widgets/Image Packs`
- `weather/1.svg`
    - This is the path to load from inside the specified pack
    - In this example, the `default` pack has a subfolder named `weather`, which contains a file named `1.svg`
    - If the resource cannot be found inside your image pack, then the equivalent fallback from the `default` pack will be loaded instead

You are not limited by the subfolder names used inside the `default` pack. For example:

```
<img src="xui://images/testing/backdrops/big.png">
```

This is perfectly valid, so long as the `testing` image pack has a subfolder named `backdrops`.

### The `default` pack

The `default` image pack contains a number of icons available for use, without needing to include them inside your widget. These are styled in the vein of iOS, and are provided as SVG to allow scaling without quality loss.

Available icons, grouped by subfolder:

- `weather`
    - `[0-47].svg` (e.g., all weather icons that relate to a weather condition code)
    - `unknown.svg`
- `media`
    - `backward.svg`
    - `forward.svg`
    - `pause.svg`
    - `play.svg`
    - `repeat.svg`
    - `shuffle.svg`
    - `stop.svg`