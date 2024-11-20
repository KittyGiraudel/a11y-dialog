---
title: Dialog element
slug: /further-reading/dialog-element
description: The native HTML <dialog> element has come a long way. While it used to be very inconsistent, not to mention somewhat unfinished, it is now in a pretty healthy place and can generally be used — provided one is aware of the remaining caveats.
---

The native HTML `<dialog>` element has come a long way. While it used to be very inconsistent, not to mention somewhat unfinished, it is now in a pretty healthy place and [can generally be used](https://www.scottohara.me/blog/2023/01/26/use-the-dialog-element.html) — provided one is aware of the [remaining caveats](#remaining-caveats).

:::info  
For extensive information about the `<dialog>` element, do read [Having an open dialog](https://www.scottohara.me/blog/2019/03/05/open-dialog.html) and more importantly [Use the dialog element (reasonably)](https://www.scottohara.me/blog/2023/01/26/use-the-dialog-element.html), from Scott O’Hara.  
:::

## Remaining caveats

Here are some of the remaining issues with the HTML `<dialog>` element:

- Clicking outside the dialog does not close the dialog in some browsers such as Chrome.
- The `::backdrop` pseudo-element only shows when programatically opening the dialog, not when using the `open` attribute.
- Default styles are left to the browsers’ discretion and can be inconsistent.
- The events emitted by the `<dialog>` element are a little confusing (there is both `cancel` and `close` but no `open`) and not very reliable (only fired in certain situations).
- Using the `<dialog>` element still requires JavaScript (unlike `<details>` for instance).
- Using `role="alertdialog"` on the `<dialog>` element does not prevent the <kbd>ESC</kbd> key from closing the dialog, which is not a violation of the spec, but potentially problematic (e.g. with forms).

:::note  
If you are aware of a downside or pitfall of the `<dialog>` element that was not mentioned here, please kindly [open an issue](https://github.com/KittyGiraudel/a11y-dialog/issues) so we can keep this document relevant and informative.  
:::

## Why a11y-dialog

This brings us to the reasons why one may stick to using a11y-dialog (or a similar library):

- Needing cross-browser consistency. Browsers may apply different styles to the `<dialog>` element, or may handle user interactions slightly differently.
- Needing to support browsers that do not support the `<dialog>` element. Google has created [a polyfill for `<dialog>`](https://github.com/GoogleChrome/dialog-polyfill)), but it is larger than a11y-dialog, provides _fewer_ features, and doesn’t cover all the accessibility expectations that a dialog should covers.
- Building interactions that rely on events. The native `<dialog>` element supports [`cancel` and `close` events](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement#events), but their behaviors aren’t reliable. The `<dialog>` does not support an `open` event at all.
- Using a framework-specific wrapper around it, like React or Vue.js. It’s going to be easier to integrate with a11y-dialog than the native element.
- Relying on a11y-dialog in an existing project already and not wanting to migrate to the `<dialog>` element. a11y-dialog is about 1.6Kb when minified and gzipped, and even smaller when compressed with brotli. It won’t add significant bloat to your application.
