---
title: Instantiation
slug: /usage/instantiation
---

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

As recommended in the [HTML section](usage.markup.md) of this documentation, the dialog element is supposed to be on the same level as your content container(s). Therefore, the script will toggle the `aria-hidden` attribute of the siblings of the dialog element as a default. You can change this behaviour by passing a `NodeList`, an `Element` or a selector as second argument to the `A11yDialog` constructor:

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

### JS API

Regarding the JS API, it simply consists on `show()` and `hide()` methods on the dialog instance.

```javascript
// Show the dialog
dialog.show()

// Hide the dialog
dialog.hide()
```

For advanced usages, there are `create()` and `destroy()` methods. These are responsible for attaching click event listeners to dialog openers and closers. Note that the `create()` method is **automatically called on instantiation** so there is no need to call it again directly.

```javascript
// Unbind click listeners from dialog openers and closers and remove all bound
// custom event listeners registered with `.on()`
dialog.destroy()

// Bind click listeners to dialog openers and closers
dialog.create()
```

If necessary, the `create()` method also accepts the `targets` containers (the one toggled along with the dialog element) in the same form as the second argument from the constructor. If omitted, the one given to the constructor (or default) will be used.
