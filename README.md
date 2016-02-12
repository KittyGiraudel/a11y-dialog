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
- Proper usage of the `hidden` attribute;
- Cleaner code.

## Install

```
npm install accessible-modal-dialog --save
```

Or you could also copy/paste the script in your project directly, but you will be disconnected from this repository, making it hard for your to get updates.

## Usage

You will find a concrete demo in the [example](https://github.com/edenspiekermann/accessible-modal-dialog/tree/master/example) folder of this repository, but basically here is the gist:

### HTML

Here is the basic markup, which can be enhanced. Pay extra attention to the comments.

```html
<!--
  Main container related notes:
  - It doesn’t have to be a `main` element, however this is recommended.
  - It doesn’t have to have the `aria-label="Content"` attribute, however this is recommended.
  - It can have a different id than `main`, however you will have to pass it as a second argument to the Modal instance. See further down.
-->
<main id="main" aria-label="Content">
  <!--
    Here lives the main content of the page.
  -->
</main>

<!--
  Modal container related notes:
  - It is not the actual modal, just the container with which the script interacts.
  - It has to have the `hidden` attribute.
  - It can have a different id than `my-accessible-modal`.
-->
<div id="my-accessible-modal" hidden>

  <!--
    Overlay related notes:
    - It has to have the `tabindex="-1"` attribute.
    - It doesn’t have to have the `data-modal-hide` attribute, however this is recommended. It hides the modal when clicking outside of it.
  -->
  <div tabindex="-1" data-modal-hide></div>

  <!--
    Modal content relates notes:
    - It is the actual visual modal element.
    - It has to have the `role="dialog"` attribute.
    - It doesn’t have to have a direct child with the `role="document"`, however this is recommended.
  -->
  <div role="dialog">
    <div role="document">
      <!-- 
        Here lives the main content of the modal.
      -->

      <!--
        Closing button related notes:
        - It does have to have the `type="button"` attribute.
        - It does have to have the `data-modal-hide` attribute.
        - It does have to have an aria-label attribute if you use an icon as content.
      -->
      <button type="button" data-modal-hide aria-label="Close this modal">
        &times;
      </button>
    </div>
  </div>
</div>
```

### CSS

Internet Explorer does not support the `hidden` attribute, so you have to specify the following rule to make it work on IE:

```css
[hidden] {
  display: none;
}
```

### JavaScript

```javascript
// Get the modal element (with the accessor method you want)
var modalEl = document.getElementById('my-awesome-modal');

// Instanciate a new Modal module
var modal = new Modal(modalEl);
```

The script assumes the main document of the page has a `main` id. If it is not the case, you can pass the main node as second argument to the `Modal` constructor:

```javascript
var modal = new Modal(modalEl, mainEl);
```

## Toggling the modal

There are 2 ways of toggling the modal. Either through the DOM API, or directly with JavaScript. Both ways are inter-operable so feel free to use both if you need it.

The following button will open the modal with the `my-awesome-modal` id when interacted with.

```html
<button type="button" data-modal-show="my-awesome-modal">Open the modal</button>
```

The following button will close the modal in which it lives when interacted with.

```html
<button type="button" data-modal-hide aria-label="Close the modal">&times;</button>
```

The following button will close the modal with the `my-awesome-modal` id when interacted with. Given that the only focusable elements when the modal is open are the focusable children of the modal itself, it seems rather unlikely that you will ever need this but in case you do, well you can.g

```html
<button type="button" data-modal-hide="my-awesome-modal" aria-label="Close the modal">&times;</button>
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
