---
title: Alert Dialogs
slug: /advanced/alert-dialog
---

By default, a11y-dialog behaves as a dialog: it is closable with the <kbd>ESC</kbd> key, and by clicking the backdrop (provided the `data-a11y-dialog-hide` attribute is given to is). However, it is possible to make it an “alert dialog” for critical interactions, which would remove these features.

To do so:

1. Define `role="alertdialog"` on the dialog container (or replace `role="dialog"` with it if you set it explicitly). This will make sure <kbd>ESC</kbd> doesn’t close the modal.
2. Remove `data-a11y-dialog-hide` from the overlay element. This makes sure it is not possible to close the modal by clicking outside of it.
3. In case the user actively needs to operate with the modal, you might consider removing the close button from it. Be sure to still offer a way to eventually close the modal.

```diff
  <div
    id="your-dialog-id"
    aria-labelledby="your-dialog-title-id"
    aria-hidden="true"
+   role="alertdialog"
  >
-   <div data-a11y-dialog-hide></div>
+   <div></div>
    <div role="document">
      <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
        &times;
      </button>
      <h1 id="your-dialog-title-id">Your dialog title</h1>
    </div>
  </div>
```

For more information about alert dialogs, refer to the [WAI-ARIA 1.1 recommendations](https://www.w3.org/TR/wai-aria-1.1/#alertdialog).
