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

### Using a bundler (recommended)

If you’re using a bundler (such as Webpack or Rollup), you can install `a11y-dialog` through npm or yarn like any other dependency:

```sh
npm install a11y-dialog
```

```sh
yarn add a11y-dialog
```

Then you can import the library in your JavaScript codebase to access the `A11yDialog` class and instantiate your dialogs as you intend to.

```js
import A11yDialog from 'a11y-dialog'

const container = document.querySelector('#my-dialog-container')
const dialog = new A11yDialog(container)
```

If you rely on the `data-a11y-dialog` attribute to automate the dialog [instantiation](#instantiation) in order not to write JavaScript at all, you could simplify the import as such:

```js
import 'a11y-dialog'
```

### Using a CDN

If you prefer loading `a11y-dialog` from a third-party CDN such as jsdelivr or unpkg, you can do so by adding this script tag in your HTML:

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/a11y-dialog@6/dist/a11y-dialog.min.js"
></script>
```

If you intend to use ES modules, you can use the ESM version of script (from v6.0.0 onwards only):

```html
<script type="module">
  import A11yDialog from 'https://cdn.jsdelivr.net/npm/a11y-dialog@6/dist/a11y-dialog.esm.min.js'

  const container = document.querySelector('#my-dialog-container')
  const dialog = new A11yDialog(container)
</script>
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

### Styling

The script itself does not take care of any styling whatsoever, not even the `display` property. It basically mostly toggles the `aria-hidden` attribute on the dialog itself and its counterpart content containers (where the rest of the site/app lives).

Here is a solid set of styles to get started (note that you might have to rename the class names to fit your code):

```css
/**
 * 1. Make the dialog container, and its child overlay spread across the entire 
 *    window.
 */
.dialog-container,
.dialog-overlay {
  position: fixed; /* 1 */
  top: 0; /* 1 */
  right: 0; /* 1 */
  bottom: 0; /* 1 */
  left: 0; /* 1 */
}

/**
 * 1. Make sure the dialog container and all its descendants sits on top of the
 *    rest of the page.
 * 2. Make the dialog container a flex container to easily center the dialog.
 */
.dialog-container {
  z-index: 2; /* 1 */
  display: flex; /* 2 */
}

/**
 * 1. Make sure the dialog container and all its descendants are not visible and
 *    not focusable when the dialog is hidden.
 */
.dialog-container[aria-hidden='true'] {
  display: none; /* 1 */
}

/**
 * 1. Make the overlay look like an overlay.
 */
.dialog-overlay {
  background-color: rgba(43, 46, 56, 0.9); /* 1 */
}

/**
 * 1. Vertically and horizontally center the dialog in the page.
 * 2. Make sure the dialog sits on top of the overlay.
 * 3. Make sure the dialog has an opaque background.
 */
.dialog-content {
  margin: auto; /* 1 */
  z-index: 2; /* 2 */
  position: relative; /* 2 */
  background-color: white; /* 3 */
}
```

The rest, such as what the dialog really looks like, and how its content is styled, is left at your own discretion. These styles should be enough to get you on the right track.

If you are using the `<dialog>` element (which is [not recommended due to browser inconsistencies](#about-the-html-dialog-element)), its visibility will be handled by the user-agent itself. We recommend using the following styles to make everything work on both supporting and non-supporting user-agents:

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

### Animations

As mentioned in the [styling](#styling) section, how the dialog looks is entirely up to the implementor (you). The following boilerplate code can be used to add a simple entering animation to the dialog.

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(10%);
  }
}

.dialog-overlay {
  animation: fade-in 200ms both;
}

/**
 * 1. Add an animation delay equal to the overlay animation duration to wait for
 *    the overlay to appear before animation in the dialog.
 */
.dialog-content {
  animation: fade-in 400ms 200ms both, slide-up 400ms 200ms both; /* 1 */
}
```

### Usage as a “modal”

By default, a11y-dialog behaves as a dialog: it is closable with the <kbd>ESC</kbd> key, and by clicking the backdrop (provided the `data-a11y-dialog-hide` attribute is given to is). However, it is possible to make it work like a “modal”, which would remove these features.

To do so:

1. Replace `role="dialog"` with `role="alertdialog"`. This will make sure <kbd>ESC</kbd> doesn’t close the modal. Note that this role does not work properly with the native `<dialog>` element so make sure to use `<div role="alertdialog">`.
2. Remove `data-a11y-dialog-hide` from the overlay element. This makes sure it is not possible to close the modal by clicking outside of it.
3. In case the user actively needs to operate with the modal, you might consider removing the close button from it. Be sure to still offer a way to eventually close the modal.

For more information about modals, refer to the [WAI ARIA recommendations](https://www.w3.org/TR/wai-aria-1.1/#alertdialog).

### Nested dialogs

Nesting dialogs is a [questionable design pattern](https://ux.stackexchange.com/questions/52042/is-it-acceptable-to-open-a-modal-popup-on-top-of-another-modal-popup) that is not referenced anywhere in the [HTML 5.2 Dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). Therefore it is actively discouraged in favour of clearer interface design.

That being said, it is supported by the library, under the following conditions:

- Dialogs should live next to each other in the DOM.
- The `targets` argument of the constructor or value of the `data-a11y-dialog` attribute of every dialog should _not_ include the other dialogs, only the main content container. For instance:

```html
<div id="main">
  <!-- The main content container -->
</div>
<div id="dialog-1" data-a11y-dialog="#main">
  <!-- Dialog 1 content + a button to open dialog 2 -->
</div>
<div id="dialog-2" data-a11y-dialog="#main">
  <!-- Dialog 2 content + a button to open dialog 3 -->
</div>
<div id="dialog-3" data-a11y-dialog="#main">
  <!-- Dialog 3 content -->
</div>
```

Pressing <kbd>ESC</kbd> or clicking the backdrop will only close the top-most dialog, while the other remain untouched. It essentially makes it possible to stack dialogs on top of each other, then closing them one at a time.

There is an example in the [example/tests](https://github.com/HugoGiraudel/a11y-dialog/blob/main/example/tests/nested-dialogs.html) directory of the repository, as well as an associated test in [cypress/integration](https://github.com/HugoGiraudel/a11y-dialog/blob/main/cypress/integration/nestedDialogs.html). The original feature request by Renato de Leão remains in [issue #80](https://github.com/HugoGiraudel/a11y-dialog/issues/80#issuecomment-377691629).

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
