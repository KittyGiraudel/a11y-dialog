---
title: Quick start
slug: /usage/quick_start
---

The minimal setup follows the [WAI-ARIA dialog modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/): a dialog container, an overlay, a titled dialog panel, and one or more open/close triggers. Find detailed explanation in [Markup](./usage.markup.md).

```html
<button type="button" data-a11y-dialog-show="my-dialog">Open dialog</button>

<div
  id="your-dialog-id"
  aria-labelledby="your-dialog-title-id"
  aria-hidden="true"
  data-a11y-dialog="your-dialog-identifier"
  class="dialog-container"
>
  <div data-a11y-dialog-hide class="dialog-overlay"></div>

  <div role="document" class="dialog-content">
    <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
      &times;
    </button>

    <h1 id="your-dialog-title-id">Your dialog title</h1>
    <p>Dialog content goes here.</p>
  </div>
</div>
```

When you include the a11y-dialog bundle on the page (see [Instantiation](./usage.instantiation.md)), any element with `data-a11y-dialog` is automatically instantiated as a dialog on DOM ready. You do not need additional JavaScript for basic usage.

If you prefer to instantiate dialogs yourself (for example to keep a reference to the instance for programmatic control or to work in a bundler environment), omit `data-a11y-dialog` and use the JavaScript API instead:

```js
import A11yDialog from 'a11y-dialog'

const el = document.querySelector('#my-dialog')
const dialog = new A11yDialog(el)

dialog.show()
// …
dialog.hide()
```

Finally, you’ll need some styles to make it behave like a dialog window. It’s largely up to you, but this should cover the basics. Check [the styling documentation](./usage.styling.md) for more information.

```css
.dialog-container {
  z-index: 2;
  display: flex;
  position: fixed;
  inset: 0;
}

.dialog-container[aria-hidden='true'] {
  display: none;
}

.dialog-overlay {
  background-color: rgb(43 46 56 / 0.9);
  position: fixed;
  inset: 0;
}

.dialog-content {
  margin: auto;
  z-index: 2;
  position: relative;
  background-color: white;
}
```
