## Resources Packs
### Description

The Widget API allows you to provide resource packs to share content between widgets. This is to help reduce the download size of widgets, and also to access a variety of iconography installed by default.

### Usage

You can use resource packs via a new URI scheme:

```html
<img src="xui://resource/default/media/play.svg" />
```

This will load an image with its source set to a `media` icon from the `default` resource pack. Anywhere a URL can be referenced, you can use an resource pack, including in CSS.

### Breakdown of URI scheme

As shown above, the `xui://` URI scheme is used to load content from an resource pack. The format is broken down as follows:

- `xui://`
    - Specifies to load via the Widget API
- `resource`
    - Specifies to load from a resource pack
- `default`
    - The name of the resource pack to load from
    - This is where to specify the folder name of your resource pack. For example, specifying `my-great-pack` would load from the `my-great-pack` subfolder inside `/Library/Application Support/Widgets/Resource Packs`
- `media/play.svg`
    - This is the path to load from inside the specified pack
    - In this example, the `default` pack has a subfolder named `media`, which contains a file named `play.svg`
    - If the resource cannot be found inside your resource pack, then the equivalent fallback from the `default` pack will be loaded instead

You are not limited by the subfolder names used inside the `default` pack. For example:

```html
<img src="xui://images/testing/backdrops/big.png">
```

This is perfectly valid, so long as the `testing` resource pack has a subfolder named `backdrops`.

### The `default` pack

The `default` resource pack contains a number of icons available for use, without needing to include them inside your widget. These are styled in the vein of iOS, and are provided as SVG to allow scaling without quality loss.

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