# [A11y Dialog](http://hugogiraudel.github.io/a11y-dialog/)

[a11y-dialog](http://hugogiraudel.github.io/a11y-dialog/) is a lightweight (1.6Kb) yet flexible script to create accessible dialog windows.

✔︎ Leveraging the native `<dialog>` element if desired  
✔︎ Closing dialog on overlay click and <kbd>ESC</kbd>  
✔︎ Toggling `aria-*` attributes  
✔︎ Trapping and restoring focus  
✔︎ Firing events  
✔︎ DOM and JS APIs  
✔︎ Fast and tiny

You can try the [live demo ↗](http://hugogiraudel.github.io/a11y-dialog/example/).

## Installation

```
npm install a11y-dialog --save
```

## Usage

You will find a concrete demo in the [example](https://github.com/HugoGiraudel/a11y-dialog/tree/main/example) folder of this repository, but basically here is the gist:

### HTML boilerplate

Here is the basic markup, which can be enhanced. Pay extra attention to the comments.

```html
<!-- 1. The main content container -->
<div id="main"></div>
<!-- 2. The dialog container -->
<div id="your-dialog-id" aria-hidden="true">
  <!-- 3. The dialog overlay -->
  <div tabindex="-1" data-a11y-dialog-hide></div>
  <!-- 4. The actual dialog -->
  <div role="dialog" aria-labelledby="your-dialog-title-id">
    <!-- 5. The inner document -->
    <div role="document">
      <!-- 6. The close button -->
      <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
        &times;
      </button>
      <!-- 7. The dialog title -->
      <h1 id="your-dialog-title-id">Your dialog title</h1>
      <!-- 8. Dialog content -->
    </div>
  </div>
</div>
```

1. The main container is where your site/app content lives.

   - It can have a different id than `main`, however you will have to pass it as a second argument to the A11yDialog instance. See [instantiation instructions](#instantiation) further down.

2. The dialog container.

   - It is not the actual dialog window, just the container with which the script interacts.
   - It can have a different id than `your-dialog-id`, but it needs an `id` anyway.
   - It might need a class for you to be able to style it.
   - It should have an initial `aria-hidden="true"` to avoid a “flash of unhidden dialog” on page load.
   - It can have the `data-a11y-dialog` attribute (with the “targets” as value, see [Instantiation](#instantiation)) to automatically instantiate the dialog without JavaScript.

3. The dialog overlay.

   - It has to have the `tabindex="-1"` attribute.
   - It doesn’t have to have the `data-a11y-dialog-hide` attribute, however this is recommended. It hides the dialog when clicking outside of it.
   - It should not have the `data-a11y-dialog-hide` if the dialog window has the `alertdialog` role (see below).

4. The actual dialog.

   - It may have the `alertdialog` role to make it behave like a “modal”. See the [Usage as a modal](#usage-as-a-modal) section of the docs.
   - It can be a `<dialog>` element, but there might be [browsers inconsistencies](#about-the-html-dialog-element).
   - It doesn’t have to have the `aria-labelledby` attribute however this is recommended. It should match the `id` of the dialog title.

5. The inner document.

   - It doesn’t have to exist but improves support in NVDA.
   - It doesn’t have to exist when using `<dialog>` because is implied.

6. The dialog close button.

   - It does have to have the `type="button"` attribute.
   - It does have to have the `data-a11y-dialog-hide` attribute.
   - It does have to have an `aria-label` attribute if you use an icon as content.

7. The dialog title.

   - It should have a different content than “Dialog Title”.
   - It can have a different id than `your-dialog-title-id`.

8. The dialog content.

   - This is where your dialog content lives.

#### About the HTML dialog element

As mentioned in the comments above, the script works fine with the native HTML `<dialog>` element and will polyfill its behaviour so the dialog works in any browser, regardless of their support for that HTML element. However, it is recommended _not_ to use it and to rely on a `<div>` with `role="dialog"` instead. Amongst other, here are the issues with the HTML `<dialog>` element:

- Clicking the backdrop does not close the dialog on Chrome.
- The native `::backdrop` only shows when programatically opening the dialog, not when using the `open` attribute.
- Default styles are left to the browsers’ discretion and can be inconsistent.
- The [modal pattern](#usage-as-a-modal) (`role="alertdialog"`) simply does not work with the dialog element.
- It still requires JavaScript anyway, so it’s not even 100% HTML.
- [Read more about the shortcoming of the dialog element by Scott Ohara](https://www.scottohara.me/blog/2019/03/05/open-dialog.html).

### Styling layer

The script itself does not take care of any styling whatsoever, not even the `display` property. It basically mostly toggles the `aria-hidden` attribute on the dialog itself and its counterpart content containers (where the rest of the site/app lives).

If using the `<dialog>` element (which is [not recommended due to browser inconsistencies](#about-the-html-dialog-element)), its visibility will be handled by the user-agent itself. If using a `<div>` with the `dialog` role (which is recommended for consistency), the styling layer is up to the implementor (you).

We recommend using at least the following styles to make everything work on both supporting and non-supporting user-agents:

```css
/**
 * When the native `<dialog>` element is supported and used, the overlay is
 * handled natively and can be styled with `::backdrop`, which means the DOM one
 * should be removed.
 *
 * The `data-a11y-dialog-native` attribute is set by the script when the
 * `<dialog>` element is properly supported. Feel free to replace `:first-child`
 * with the overlay selector you prefer.
 *
 * This rule can be safely omitted when *not* using the <dialog> element.
 */
[data-a11y-dialog-native] > :first-child {
  display: none;
}

/**
 * When the `<dialog>` element is used but not supported by the user agent, its
 * default display is `inline` which can cause layout issues. This makes sure
 * the dialog is correctly displayed when open.
 *
 * This rule can be safely omitted when *not* using the <dialog> element.
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

### Instantiation

By default, any dialog container having the `data-a11y-dialog` attribute will be automatically instantiated. This is so that there is no need for any JavaScript (besides loading the script). The value of the attribute, if given, should be a selector, serving the same purpose as the 2nd attribute of the `A11yDialog` constructor (see below).

```html
<!-- The content of the `data-a11y-dialog` attribute should be
     the selector containing the main website’s or app’s code.
     See HTML boilerplate” for more information. -->
<div
  class="dialog-container"
  id="your-dialog-id"
  aria-hidden="true"
  data-a11y-dialog="#root"
>
  …
</div>
```

If automatic loading is not an option because the expected dialog markup is not present in the DOM on script execution (or the dialog instance is needed to do more complicated things), it can be instantiated through JavaScript.

```javascript
// Get the dialog container HTML element (with the accessor method you want)
const el = document.getElementById('your-dialog-id')

// Instantiate a new A11yDialog module
const dialog = new A11yDialog(el)
```

As recommended in the [HTML section](#html-boilerplate) of this documentation, the dialog element is supposed to be on the same level as your content container(s). Therefore, the script will toggle the `aria-hidden` attribute of the siblings of the dialog element as a default. You can change this behaviour by passing a `NodeList`, an `Element` or a selector as second argument to the `A11yDialog` constructor:

```javascript
const container = document.querySelector('#root')
const dialog = new A11yDialog(el, container)
```

### DOM API

The DOM API relies on `data-*` attributes. They all live under the `data-a11y-dialog-*` namespace for consistency, clarity and robustness. Two attributes are recognised:

- `data-a11y-dialog-show`: the `id` of the dialog element is expected as a value
- `data-a11y-dialog-hide`: the `id` of the dialog element is expected as a value; if omitted, the closest parent dialog element (if any) will be the target

The following button will open the dialog with the `your-dialog-id` id when interacted with.

```html
<button type="button" data-a11y-dialog-show="your-dialog-id">
  Open the dialog
</button>
```

The following button will close the dialog in which it lives when interacted with.

```html
<button type="button" data-a11y-dialog-hide aria-label="Close the dialog">
  &times;
</button>
```

The following button will close the dialog with the `your-dialog-id` id when interacted with. Given that the only focusable elements when the dialog is open are the focusable children of the dialog itself, it seems rather unlikely that you will ever need this but in case you do, well you can.

```html
<button
  type="button"
  data-a11y-dialog-hide="your-dialog-id"
  aria-label="Close the dialog"
>
  &times;
</button>
```

In addition, the library adds a `data-a11y-dialog-native` attribute (with no value) when the `<dialog>` element is used and natively supported. This attribute is essentially used to customise the styling layer based on user-agent support (or lack thereof).

### JS API

Regarding the JS API, it simply consists on `show()` and `hide()` methods on the dialog instance.

```javascript
// Show the dialog
dialog.show()

// Hide the dialog
dialog.hide()
```

When the `<dialog>` element is used and natively supported, the argument passed to `show()` and `hide()` is being passed to the native call to [`showModal()`](https://www.w3.org/TR/html52/interactive-elements.html#dom-htmldialogelement-showmodal) and [`close()`](https://www.w3.org/TR/html52/interactive-elements.html#dom-htmldialogelement-close). If necessary, the `returnValue` can be read using `<instance>.dialog.returnValue`.

For advanced usages, there are `create()` and `destroy()` methods. These are responsible for attaching click event listeners to dialog openers and closers. Note that the `create()` method is **automatically called on instantiation** so there is no need to call it again directly.

```javascript
// Unbind click listeners from dialog openers and closers and remove all bound
// custom event listeners registered with `.on()`
dialog.destroy()

// Bind click listeners to dialog openers and closers
dialog.create()
```

If necessary, the `create()` method also accepts the `targets` containers (the one toggled along with the dialog element) in the same form as the second argument from the constructor. If omitted, the one given to the constructor (or default) will be used.

## Advanced

### Events

When shown, hidden and destroyed, the instance will emit certain events. It is possible to subscribe to these with the `on()` method which will receive the dialog container element and the [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) (if any).

The event object can be used to know which trigger (opener / closer) has been used in case of a `show` or `hide` event.

```javascript
dialog.on('show', function (dialogEl, event) {
  // Do something when dialog gets shown
  // Note: opener is `event.currentTarget`
})

dialog.on('hide', function (dialogEl, event) {
  // Do something when dialog gets hidden
  // Note: closer is `event.currentTarget`
})

dialog.on('destroy', function (dialogEl) {
  // Do something when dialog gets destroyed
})

dialog.on('create', function (dialogEl) {
  // Do something when dialog gets created
  // Note: because the initial `create()` call is made from the constructor, it
  // is not possible to react to this particular one (as registering will be
  // done after instantiation)
})
```

You can unregister these handlers with the `off()` method.

```javascript
dialog.on('show', doSomething)
// …
dialog.off('show', doSomething)
```

### Usage as a “modal”

By default, a11y-dialog behaves as a dialog: it is closable with the <kbd>ESC</kbd> key, and by clicking the backdrop (provided the `data-a11y-dialog-hide` attribute is given to is). However, it is possible to make it work like a “modal”, which would remove these features.

To do so:

1. Replace `role="dialog"` with `role="alertdialog"`. This will make sure <kbd>ESC</kbd> doesn’t close the modal. Note that this role does not work properly with the native `<dialog>` element so make sure to use `<div role="alertdialog">`.
2. Remove `data-a11y-dialog-hide` from the overlay element. This makes sure it is not possible to close the modal by clicking outside of it.
3. In case the user actively needs to operate with the modal, you might consider removing the close button from it. Be sure to still offer a way to eventually close the modal.

For more information about modals, refer to the [WAI ARIA recommendations](https://www.w3.org/TR/wai-aria-1.1/#alertdialog).

### Nested dialogs

Nested dialogs is a [questionable design pattern](https://ux.stackexchange.com/questions/52042/is-it-acceptable-to-open-a-modal-popup-on-top-of-another-modal-popup) that is not referenced anywhere in the [HTML 5.2 Dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). Therefore it is discouraged and not supported by default by the library. That being said, if you still want to run with it, [Renato de Leão explains how in issue #80](https://github.com/HugoGiraudel/a11y-dialog/issues/80#issuecomment-377691629).

## Further reading

### Known issues

1. It has been reported that the focus restoration to the formerly active element when closing the dialog does not always work properly on iOS. It is unclear what causes this or even if it happens consistently. Refer to [issue #102](https://github.com/HugoGiraudel/a11y-dialog/issues/102) as a reference.

2. Content with `aria-hidden` appears to be sometimes read by VoiceOver on iOS and macOS. It is unclear in which case this happens, and does not appear to be an issue directly related to the library. Refer to this [WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=201887#c2) for reference.

### Implementations

If you happen to work with [React](https://github.com/facebook/react/) or [Vue](https://github.com/vuejs/vue) in your project, you’re lucky! There are already great light-weight wrapper implemented for a11y-dialog:

- [React A11yDialog](https://github.com/HugoGiraudel/react-a11y-dialog)
- [Vue A11yDialog](https://github.com/morkro/vue-a11y-dialog)

### Disclaimer & credits

Originally, this repository was a fork from [accessible-modal-dialog ↗](https://github.com/gdkraus/accessible-modal-dialog) by Greg Kraus. It has gone through various stages since the initial implementation and both packages are no longer similar in the way they work.
