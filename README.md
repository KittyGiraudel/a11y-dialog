# The Incredible Accessible Modal Window

This repository is a fork from [accessible-modal-dialog](https://github.com/gdkraus/accessible-modal-dialog) by [Greg Kraus](https://github.com/gdkraus). We at [Edenspiekermann](http://edenspiekermann.com) are big fans of the original version, although we discovered we could improve it and make it even better. On top of that, the original script depends on jQuery, which happened to be a problem for us.

The original repository being apparently unmaintained, we decided to fork it and release our own version of the accessible modal dialog. All credits to the original author.

You can try the [live demo](http://edenspiekermann.github.io/accessible-modal-dialog/).

## What’s new in Edenspiekermann’s version?

- No more dependency to jQuery (vanilla JS only); 
- Possibility to have several different modals on the page;
- DOM API for modal openers (`data-modal-show="modal-id"`) and closers (`data-modal-hide`);
- JS API to manually show and hide modals (`modal.show()`, `modal.hide()`);
- JS API to know whether a modal is hidden or shown (`modal.shown`);
- Addition of `[tabindex]:not([value="-1"])` to focusable elements;
- Cleaner code.

## Install

```
npm install accessible-modal-dialog --save
```

Or you could also copy/paste the script in your project directly, but you will be disconnected from this repository, making it hard for your to get updates.

## Initialising the modal

You will find a concrete demo in the [example](https://github.com/edenspiekermann/accessible-modal-dialog/tree/master/example) folder of this repository, but basically here is the gist:

```javascript
// Get the modal element (with the accessor method you want)
var modalEl = document.getElementById('my-awesome-modal');

// Instanciate a new Modal module
var modal = new Modal(modalEl);
```

The script assumes the main document of the page has a `main` id, and the overlay element has a `modal-overlay` id. If it is not the case, you can pass these two nodes respectively as second and third arguments to the `Modal` constructor:

```javascript
var modal = new Modal(modalEl, mainEl, overlayEl);
```

## Toggling the modal

There are 2 ways of toggling the modal. Either through the DOM API, or directly with JavaScript. Both ways are inter-operable so feel free to use both if you need it.

The following button will open the modal with the `my-awesome-modal` id when interacted with.

```html
<button type="button" data-modal-show="my-awesome-modal">Open the modal</button>
```

The following button will close the modal in which it lives when interacted with.

```html
<button type="button" data-modal-hide title="Close the modal">&times;</button>
```

The following button will close the modal with the `my-awesome-modal` id when interacted with. Given that the only focusable elements when the modal is open are the focusable children of the modal itself, it seems rather unlikely that you will ever need this but in case you do, well you can.g

```html
<button type="button" data-modal-hide="my-awesome-modal" title="Close the modal">&times;</button>
```

Regarding the JS API, it simply consists on `show()` and `hide()` methods on the modal instance.

```javascript
// Show the modal
modal.show();

// Hide the modal
modal.hide();
```

## Deploy example

The [example page](http://edenspiekermann.github.io/accessible-modal-dialog/) is deployed through [GitHub Pages](https://pages.github.com/). 

```
npm run example
```
