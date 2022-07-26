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
dialog.show()
dialog.hide()
```

There is also a `destroy()` method which you can call if your dialog is no longer used and the DOM gets removed. This ensures there won’t be any memory leak, and is typically done in framework usages.

```js
dialog.destroy()
```
