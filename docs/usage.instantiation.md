---
title: Instantiation
slug: /usage/instantiation
---

By default, any element with the `data-a11y-dialog` attribute (with 1’s, not L’s) will be automatically instantiated as a dialog. This is so that there is no need for any JavaScript (besides loading the script). The value of the attribute should be a unique identifier for the dialog, similar to an `id`.

```html
<div
  class="dialog-container"
  aria-hidden="true"
  data-a11y-dialog="your-dialog-id"
>
  …
</div>
```

If automatic loading is not an option because the expected dialog markup is not present in the DOM on script execution (or the dialog instance is needed to do more complicated things), the `data-a11y-dialog` should be omitted and it can be instantiated through JavaScript. In that case, **it must have an `id`.**

```html
<div class="dialog-container" aria-hidden="true" id="your-dialog-id">…</div>
```

```js
// Get the dialog container HTML element (with the accessor method you want)
const element = document.getElementById('your-dialog-id')

// Instantiate a new A11yDialog module
const dialog = new A11yDialog(element)
```
