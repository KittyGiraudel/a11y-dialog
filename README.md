# A11y Dialog

This repository is a fork from [accessible-modal-dialog](https://github.com/gdkraus/a11y-dialog) by [Greg Kraus](https://github.com/gdkraus). We at [Edenspiekermann](http://edenspiekermann.com) are big fans of the original version, although we discovered we could improve it and make it even better. On top of that, the original script depends on jQuery, which happened to be a problem for us.

The original repository being apparently unmaintained, we decided to fork it and release our own version of the accessible modal dialog. All credits to the original author.

You can try the [live demo](http://edenspiekermann.github.io/a11y-dialog/).

![CodeShip test status](https://codeship.com/projects/7dd06120-b6f8-0133-792c-265d84c132f8/status?branch=master)

## Nice things to know

- No dependency (not even jQuery);
- Possibility to have several different dialog windows on the page;
- DOM API (`data-a11y-dialog-show="dialog-id"`, `data-a11y-dialog-hide`);
- JS API (`dialog.show()`, `dialog.hide()`, `dialog.shown`);
- No `display` manipulation in JS, the hiding mechanism is entirely up to the CSS layer (using `[aria-hidden]` selectors);
- Full test coverage with [CasperJS](http://casperjs.org) and [CodeShip](https://codeship.com);
- Clean code resulting in only 650 bytes (0.65Kb!) once gzipped.

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
  - It doesn’t have to be a `main` element, however this is recommended.
  - It doesn’t have to have the `aria-label="Content"` attribute, however this is recommended.
  - It can have a different id than `main`, however you will have to pass it as a second argument to the A11yDialog instance. See further down.
-->
<main id="main" aria-label="Content">
  <!--
    Here lives the main content of the page.
  -->
</main>

<!--
  Dialog container related notes:
  - It is not the actual dialog window, just the container with which the script interacts.
  - It has to have the `aria-hidden="true"` attribute.
  - It can have a different id than `my-accessible-dialog`.
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
    - It doesn’t have to have a direct child with the `role="document"`, however this is recommended.
  -->
  <div role="dialog">
    <div role="document">
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

You will have to implement some styles for the dialog to “work” (visually speaking). The script itself does not take care of any styling whatsoever, not even the `display` property. It basically mostly toggles the `aria-hidden` attribute on the main element and the dialog itself. You can use this to show and hide the dialog:

```css
.dialog[aria-hidden="true"] {
  display: none;
}
```

### JavaScript

```javascript
// Get the dialog element (with the accessor method you want)
var dialogEl = document.getElementById('my-awesome-dialog');

// Instanciate a new A11yDialog module
var dialog = new A11yDialog(dialogEl);
```

The script assumes the main document of the page has a `main` id. If it is not the case, you can pass the main node as second argument to the `A11yDialog` constructor:

```javascript
var dialog = new A11yDialog(dialogEl, mainEl);
```

## Toggling the dialog window

There are 2 ways of toggling the dialog. Either through the DOM API, or directly with JavaScript. Both ways are inter-operable so feel free to use both if you need it.

The following button will open the dialog with the `my-awesome-dialog` id when interacted with.

```html
<button type="button" data-a11y-dialog-show="my-awesome-dialog">Open the dialog</button>
```

The following button will close the dialog in which it lives when interacted with.

```html
<button type="button" data-a11y-dialog-hide aria-label="Close the dialog">&times;</button>
```

The following button will close the dialog with the `my-awesome-dialog` id when interacted with. Given that the only focusable elements when the dialog is open are the focusable children of the dialog itself, it seems rather unlikely that you will ever need this but in case you do, well you can.

```html
<button type="button" data-a11y-dialog-hide="my-awesome-dialog" aria-label="Close the dialog">&times;</button>
```

Regarding the JS API, it simply consists on `show()` and `hide()` methods on the dialog instance.

```javascript
// Show the dialog
dialog.show();

// Hide the dialog
dialog.hide();
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
