## URL Scheme Handling
### Description

The Xen HTML API allows you to launch arbitrary URLs from your widgets, including opening webpages in Safari, or invoking custom URL Schemes made available by user applications.

### Usage

The usage of this is simple: set a new URL to `window.location` at runtime, which is the same as if you were to change the current page.

### Example

The following shows how to open [https://apple.com](https://apple.com) in Safari:

```js
/**
 * Example function to open a URL in the Safari app
 * @param url The URL to open
 */
openSafari(url) {
    // This is where the URL is actually launched
    window.location = url;
}

// Elsewhere in your code
openSafari('https://apple.com');
```

You can use an identical approach for URL schemes, such as opening the Twitter app to a user:

```js
window.location = 'twitter://user?screen_name=_Matchstic';
```