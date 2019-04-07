# [A11y Dialog](http://edenspiekermann.github.io/a11y-dialog/)

[a11y-dialog](http://edenspiekermann.github.io/a11y-dialog/) is a lightweight (1.4Kb) yet flexible script to create accessible dialog windows.

✔︎ No dependencies  
✔︎ Leveraging the native `<dialog>` element  
✔︎ Closing dialog on overlay click and <kbd>ESC</kbd>  
✔︎ Toggling `aria-*` attributes  
✔︎ Trapping and restoring focus  
✔︎ Firing events  
✔︎ DOM and JS APIs  
✔︎ Fast and tiny  

You can try the [live demo ↗](http://edenspiekermann.github.io/a11y-dialog/example/).

## Installation

```
npm install a11y-dialog --save
```

## Usage

You will find a concrete demo in the [example](https://github.com/edenspiekermann/a11y-dialog/tree/master/example) folder of this repository, but basically here is the gist:

### Expected DOM structure

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
  - It can have a different id than `my-accessible-dialog`, but it needs an `id`
  anyway.
-->
<div id="my-accessible-dialog">

  <!--
    Overlay related notes:
    - It has to have the `tabindex="-1"` attribute.
    - It doesn’t have to have the `data-a11y-dialog-hide` attribute, however this is recommended. It hides the dialog when clicking outside of it.
  -->
  <div tabindex="-1" data-a11y-dialog-hide></div>

  <!--
    Dialog window content related notes:
    - It is the actual visual dialog element.
    - It may have the `alertdialog` role to make it behave like a “modal”. See the “Usage as a modal” section of the docs.
    - It doesn’t have to be a `<dialog>` element, it can be a `<div>` element with the `dialog` or `alertdialog` role (e.g. `<div role="dialog">`).
    - It doesn’t have to have the `aria-labelledby` attribute however this is recommended. It should match the `id` of the dialog title.
  -->
  <dialog aria-labelledby="dialog-title">
    <!--
      Closing button related notes:
      - It does have to have the `type="button"` attribute.
      - It does have to have the `data-a11y-dialog-hide` attribute.
      - It does have to have an aria-label attribute if you use an icon as content.
    -->
    <button type="button" data-a11y-dialog-hide aria-label="Close this dialog window">
      &times;
    </button>

    <!--
      Dialog title related notes:
      - It should have a different content than `Dialog Title`.
      - It can have a different id than `dialog-title`.
    -->
    <h1 id="dialog-title">Dialog Title</h1>

    <!--
      Here lives the main content of the dialog.
    -->
  </dialog>
</div>
```

### Styling layer

The script itself does not take care of any styling whatsoever, not even the `display` property. It basically mostly toggles the `aria-hidden` attribute on the dialog itself and its counterpart containers.

In browsers supporting the `<dialog>` element, its visibility will be handled by the user-agent itself. Until support gets better across the board, the styling layer is up to the implementor (you).

We recommend using at least the following styles to make everything work on both supporting and non-supporting user-agents:

```css
/**
 * When the native `<dialog>` element is supported, the overlay is implied and
 * can be styled with `::backdrop`, which means the DOM one should be removed.
 *
 * The `data-a11y-dialog-native` attribute is set by the script when the
 * `<dialog>` element is properly supported.
 *
 * Feel free to replace `:first-child` with the overlay selector you prefer.
 */
[data-a11y-dialog-native] > :first-child {
  display: none;
}

/**
 * When the `<dialog>` element is not supported, its default display is `inline`
 * which can cause layout issues. This makes sure the dialog is correctly
 * displayed when open.
 */
dialog[open] {
  display: block;
}

/**
 * When the native `<dialog>` element is not supported, the script toggles the
 * `aria-hidden` attribute on the container. If `aria-hidden` is set to `true`,
 * the container should be hidden entirely.
 *
 * Feel free to replace `.dialog-container` with the container selector you
 * prefer.
 */
.dialog-container[aria-hidden='true'] {
  display: none;
}
```

### JavaScript instantiation

```javascript
// Get the dialog element (with the accessor method you want)
const el = document.getElementById('my-accessible-dialog');

// Instantiate a new A11yDialog module
const dialog = new A11yDialog(el);
```

As recommended in the [HTML section](#expected-dom-structure) of this documentation, the dialog element is supposed to be on the same level as your content container(s). Therefore, the script will toggle the `aria-hidden` attribute of the siblings of the dialog element as a default. You can change this behaviour by passing a `NodeList`, an `Element` or a selector as second argument to the `A11yDialog` constructor:

```javascript
const dialog = new A11yDialog(el, containers);
```

### Usage as a “modal”

By default, a11y-dialog behaves as a dialog: it is closable with the <kbd>ESC</kbd> key, and by clicking the backdrop. However, it is possible to make it work like a “modal”, which would remove these features.

To do so:

1. Add `role="alertdialog"` to the `<dialog>` element or replace`role="dialog"` with `role="alertdialog"` in case you don’t use the `<dialog>` element. This will make sure <kbd>ESC</kbd> doesn’t close the modal.
2. Remove `data-a11y-dialog-hide` from the overlay element. This makes sure it is not possible to close the modal by clicking outside of it.
3. In case the user actively needs to operate with the modal, you might consider removing the close button from it. Be sure to still offer a way to eventually close the modal.

For more information about modals, refer to the [WAI ARIA recommendations](https://www.w3.org/TR/wai-aria-1.1/#alertdialog).

## DOM API

The DOM API relies on `data-*` attributes. They all live under the `data-a11y-dialog-*` namespace for consistency, clarity and robustness. Two attributes are recognised:

* `data-a11y-dialog-show`: the `id` of the dialog element is expected as a value
* `data-a11y-dialog-hide`: the `id` of the dialog element is expected as a value; if omitted, the closest parent dialog element (if any) will be the target

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

In addition, the library adds a `data-a11y-dialog-native` attribute (with no value) when the `<dialog>` element is natively supported. This attribute is essentially used to customise the styling layer based on user-agent support (or lack thereof).

## JS API

Regarding the JS API, it simply consists on `show()` and `hide()` methods on the dialog instance.

```javascript
// Show the dialog
dialog.show();

// Hide the dialog
dialog.hide();
```

When the `<dialog>` element is natively supported, the argument passed to `show()` and `hide()` is being passed to the native call to [`showModal()`](https://www.w3.org/TR/html52/interactive-elements.html#dom-htmldialogelement-showmodal) and [`close()`](https://www.w3.org/TR/html52/interactive-elements.html#dom-htmldialogelement-close). If necessary, the `returnValue` can be read using `dialog.dialog.returnValue`.

For advanced usages, there are `create()` and `destroy()` methods. These are responsible for attaching click event listeners to dialog openers and closers. Note that the `create()` method is **automatically called on instantiation** so there is no need to call it again directly.

```javascript
// Unbind click listeners from dialog openers and closers and remove all bound
// custom event listeners registered with `.on()`
dialog.destroy();

// Bind click listeners to dialog openers and closers
dialog.create();
```

If necessary, the `create()` method also accepts the `targets` containers (the one toggled along with the dialog element) in the same form as the second argument from the constructor. If omitted, the one given to the constructor (or default) will be used.

## Events

When shown, hidden and destroyed, the instance will emit certain events. It is possible to subscribe to these with the `on()` method which will receive the dialog DOM element and the [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) (if any).

The event object can be used to know which trigger (opener / closer) has been used in case of a `show` or `hide` event.

```javascript
dialog.on('show', function (dialogEl, event) {
  // Do something when dialog gets shown
  // Note: opener is `event.currentTarget`
});

dialog.on('hide', function (dialogEl, event) {
  // Do something when dialog gets hidden
  // Note: closer is `event.currentTarget`
});

dialog.on('destroy', function (dialogEl) {
  // Do something when dialog gets destroyed
});

dialog.on('create', function (dialogEl) {
  // Do something when dialog gets created
  // Note: because the initial `create()` call is made from the constructor, it
  // is not possible to react to this particular one (as registering will be
  // done after instantiation)
});
```

You can unregister these handlers with the `off()` method.

```javascript
dialog.on('show', doSomething);
// …
dialog.off('show', doSomething);
```


## Nested dialogs

Nested dialogs is a [questionable design pattern](https://ux.stackexchange.com/questions/52042/is-it-acceptable-to-open-a-modal-popup-on-top-of-another-modal-popup) that is not referenced anywhere in the [HTML 5.2 Dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). Therefore it is discouraged and not supported by default by the library. That being said, if you still want to run with it, [Renato de Leão explains how in edenspiekermann/a11y-dialog#80](https://github.com/edenspiekermann/a11y-dialog/issues/80#issuecomment-377691629).

## Implementations

If you happen to work with [React](https://github.com/facebook/react/) or [Vue](https://github.com/vuejs/vue) in your project, you’re lucky! There are already great light-weight wrapper implemented for a11y-dialog:

- [React A11yDialog](https://github.com/HugoGiraudel/react-a11y-dialog)
- [Vue A11yDialog](https://github.com/morkro/vue-a11y-dialog)

## Disclaimer & credits

Originally, this repository was a fork from [accessible-modal-dialog ↗](https://github.com/gdkraus/accessible-modal-dialog) by Greg Kraus. It has gone through various stages since the initial implementation and both packages are no longer similar in the way they work.
