---
title: Interactions
slug: /usage/interactions
---

### DOM API

The DOM API relies on `data-*` attributes. They all live under the `data-a11y-dialog-*` namespace for consistency (with 1’s, not L’s), clarity and robustness. Two attributes are recognised:

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

```js
// Show the dialog
dialog.show()

// Hide the dialog
dialog.hide()
```

For advanced usages, there are `create()` and `destroy()` methods. These are responsible for attaching click event listeners to dialog openers and closers. Note that the `create()` method is **automatically called on instantiation** so there is no need to call it again directly.

```js
// Unbind click listeners from dialog openers and closers and remove all bound
// custom event listeners registered with `.on()`
dialog.destroy()

// Bind click listeners to dialog openers and closers
dialog.create()
```

If necessary, the `create()` method also accepts the `targets` containers (the one toggled along with the dialog element) in the same form as the second argument from the constructor. If omitted, the one given to the constructor (or default) will be used.
