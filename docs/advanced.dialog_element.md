---
title: Dialog element
slug: /advanced/dialog-element
---

The native `<dialog>` HTML element is notoriously inconsistent, so much so that it is actively discouraged to use it. From version 7 onwards, a11y-dialog no longer supports using the `<dialog>` element. If you insist on using it, use the latest version from v6.

Amongst other, here are the issues with the HTML `<dialog>` element:

- Clicking the backdrop does not close the dialog on Chrome.
- The native `::backdrop` only shows when programatically opening the dialog, not when using the `open` attribute.
- Default styles are left to the browsers’ discretion and can be inconsistent.
- The [alert dialog pattern](advanced.alert_dialog.md) (`role="alertdialog"`) simply does not work with the dialog element.
- It still requires JavaScript anyway, so it’s not even 100% HTML.
- [Read more about the shortcoming of the dialog element by Scott O'hara](https://www.scottohara.me/blog/2019/03/05/open-dialog.html).
