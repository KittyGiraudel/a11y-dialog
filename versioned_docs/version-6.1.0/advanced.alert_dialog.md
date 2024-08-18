---
title: Alert Dialogs
slug: /advanced/alert-dialog
---

By default, a11y-dialog behaves as a dialog: it is closable with the <kbd>ESC</kbd> key, and by clicking the backdrop (provided the `data-a11y-dialog-hide` attribute is given to it). However, it is possible to make it an “alert dialog” for critical interactions, which would remove these features.

To do so:

1. Replace `role="dialog"` with `role="alertdialog"`. This will make sure <kbd>ESC</kbd> doesn’t close the modal. Note that this role does not work properly with the [native `<dialog>` element](advanced.dialog_element.md) so make sure to use `<div role="alertdialog">`.
2. Remove `data-a11y-dialog-hide` from the overlay element. This makes sure it is not possible to close the modal by clicking outside of it.
3. In case the user actively needs to operate with the modal, you might consider removing the close button from it. Be sure to still offer a way to eventually close the modal.

:::info Alert dialogs  
For more information about modals, refer to the [WAI-ARIA 1.1 recommendations](https://www.w3.org/TR/wai-aria-1.1/#alertdialog).  
:::
