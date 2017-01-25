# A11y Dialog

This repository is a fork from [accessible-modal-dialog](https://github.com/gdkraus/accessible-modal-dialog) by [Greg Kraus](https://github.com/gdkraus). We at [Edenspiekermann](http://edenspiekermann.com) are big fans of the original version, although we discovered we could improve it and make it even better. On top of that, the original script depends on jQuery, which happened to be a problem for us.

The original repository being apparently unmaintained, we decided to fork it and release our own version of the accessible modal dialog. All credits to the original author.

You can try the [live demo](http://edenspiekermann.github.io/a11y-dialog/).

## Nice things to know

- No dependency (not even jQuery)
- Possibility to have several different dialog windows on the page
- DOM API (`data-a11y-dialog-show="dialog-id"`, `data-a11y-dialog-hide`)
- JS API (`dialog.show()`, `dialog.hide()`, `dialog.destroy()`, `dialog.shown`)
- JS events (`show`, `hide`, `destroy`)
- No `display` manipulation in JS, the hiding mechanism is entirely up to the CSS layer (using `[aria-hidden]` selectors)
- Full test coverage with Mocha
- Clean code resulting in only 1.2Kb once gzipped

*Note: the script should run seamlessly in Internet Explorer 9 and above.*

## Install

```
npm install a11y-dialog --save
```

```
bower install espi-a11y-dialog
```

Or you could also copy/paste the script in your project directly, but you will be disconnected from this repository, making it hard for your to get updates.

## Usage

You will find a concrete demo in the [example](https://github.com/edenspiekermann/a11y-dialog/tree/master/example) folder of this repository, but basically here is the gist:

### HTML

Here is the basic markup, which can be enhanced. Pay extra attention to the comments.

```html
<!--
  Main container related notes:
  - It can have a different id than `main`, however you will have to pass it as a second argument to the A11yDialog instance. See further down.
-->
<div id="main">
  <!--
    Here lives the main content of the page.
  -->
</div>

<!--
  Dialog container related notes:
  - It is not the actual dialog window, just the container with which the script interacts.
  - It has to have the `aria-hidden="true"` attribute.
  - It can have a different id than `my-accessible-dialog`, but it needs an `id`
  anyway.
-->
<div id="my-accessible-dialog" aria-hidden="true">

  <!--
    Overlay related notes:
    - It has to have the `tabindex="-1"` attribute.
    - It doesn’t have to have the `data-a11y-dialog-hide` attribute, however this is recommended. It hides the dialog when clicking outside of it.
  -->
  <div tabindex="-1" data-a11y-dialog-hide></div>

  <!--
    Dialog window content related notes:
    - It is the actual visual dialog element.
    - It has to have the `role="dialog"` attribute.
    - It doesn’t have to have the `aria-labelledby` attribute however this is recommended. It should match the `id` of the dialog title.
    - It doesn’t have to have a direct child with the `role="document"`, however this is recommended.
  -->
  <div role="dialog" aria-labelledby="dialog-title">
    <div role="document">
      <!--
        Dialog title related notes:
        - It should have a different content than `Dialog Title`.
        - It can have a different id than `dialog-title`.
        - It does not have to have the `tabindex="0"` attribute however it is recommended so the dialog doesn’t jump directly to a field, displaying keyboard on mobiles.
      -->
      <h1 id="dialog-title" tabindex="0">Dialog Title</h1>

      <!--
        Here lives the main content of the dialog.
      -->

      <!--
        Closing button related notes:
        - It does have to have the `type="button"` attribute.
        - It does have to have the `data-a11y-dialog-hide` attribute.
        - It does have to have an aria-label attribute if you use an icon as content.
      -->
      <button type="button" data-a11y-dialog-hide aria-label="Close this dialog window">
        &times;
      </button>
    </div>
  </div>
</div>
```

### CSS

You will have to implement some styles for the dialog to “work” (visually speaking). The script itself does not take care of any styling whatsoever, not even the `display` property. It basically mostly toggles the `aria-hidden` attribute on the main container element and the dialog itself. You can use this to show and hide the dialog:

```css
.dialog[aria-hidden="true"] {
  display: none;
}
```

### JavaScript

```javascript
// Get the dialog element (with the accessor method you want)
var dialogEl = document.getElementById('my-accessible-dialog');

// Instanciate a new A11yDialog module
var dialog = new A11yDialog(dialogEl);
```

The script will toggle the `aria-hidden` attribute of the siblings of the dialog element as a default. You can change this behaviour by passing a `NodeList`, an `Element` or a selector as second argument to the `A11yDialog` constructor:

```javascript
var dialog = new A11yDialog(dialogEl, targetsEl);
```

## Toggling the dialog window

There are 2 ways of toggling the dialog. Either through the DOM API, or directly with JavaScript. Both ways are inter-operable so feel free to use both if you need it.

The following button will open the dialog with the `my-accessible-dialog` id when interacted with.

```html
<button type="button" data-a11y-dialog-show="my-accessible-dialog">Open the dialog</button>
```

The following button will close the dialog in which it lives when interacted with.

```html
<button type="button" data-a11y-dialog-hide aria-label="Close the dialog">&times;</button>
```

The following button will close the dialog with the `my-accessible-dialog` id when interacted with. Given that the only focusable elements when the dialog is open are the focusable children of the dialog itself, it seems rather unlikely that you will ever need this but in case you do, well you can.

```html
<button type="button" data-a11y-dialog-hide="my-accessible-dialog" aria-label="Close the dialog">&times;</button>
```

Regarding the JS API, it simply consists on `show()` and `hide()` methods on the dialog instance.

```javascript
// Show the dialog
dialog.show();

// Hide the dialog
dialog.hide();
```

There is also a `destroy()` method that will hide the dialog and remove the event listeners the instance registered. Note that it will *not* remove the dialog element from the DOM.

```javascript
dialog.destroy();
```

## Events

When shown, hidden and destroyed, the instance will emit certain events. It is possible to subscribe to these with the `on()` method which will receive the dialog DOM element and the trigger DOM element (if any).

```javascript
dialog.on('show', function (dialogEl, triggerEl) {
  // Do something when dialog gets shown
});

dialog.on('hide', function (dialogEl, triggerEl) {
  // Do something when dialog gets hidden
});

dialog.on('destroy', function (dialogEl, triggerEl) {
  // Do something when dialog gets destroyed
});
```

You can unregister these handlers with the `off()` method.

```javascript
dialog.on('show', doSomething);
// …
dialog.off('show', doSomething);
```

## Tests

[Mocha](https://mochajs.org/) and [expect.js](https://github.com/Automattic/expect.js) are used to run browser tests.

```
npm test
```

## Deploy example

The [example page](http://edenspiekermann.github.io/a11y-dialog/) is deployed through [GitHub Pages](https://pages.github.com/).

```
npm run deploy
```

## Supported browsers

* Chrome
* Firefox
* Safari
* Opera 11.60+
* Internet Explorer 9+
