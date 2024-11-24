---
title: Dialog element
slug: /further-reading/dialog-element
description: The native HTML <dialog> element is notoriously inconsistent, so much so that it has long been discouraged to use it.
---

The native HTML `<dialog>` element is notoriously inconsistent, so much so that it has long been discouraged to use it. Among other things, here are some of the issues with the HTML `<dialog>` element:

- Clicking the backdrop does not close the dialog on Chrome.
- The native `::backdrop` only shows when programatically opening the dialog, not when using the `open` attribute.
- Default styles are left to the browsers’ discretion and can be inconsistent.
- It still requires JavaScript anyway, so it’s not even 100% HTML.
- [Read more about the shortcoming of the dialog element by Scott O'hara](https://www.scottohara.me/blog/2019/03/05/open-dialog.html).
- Using `role="alertdialog"` on the `<dialog>` element does not prevent the <kbd>ESC</kbd> key from closing the dialog, which is not a violation of the spec, but potentially problematic (e.g. with forms).

Additionally, there are still reasons to use a11y-dialog (or a similar library):

- Not wanting to deal with browsers inconsistencies. It would be a bad reason to use a JavaScript library **if** `<dialog>` worked without JavaScript, which it doesn’t. So if one wants a dialog that looks the same everywhere, then a library like a11y-dialog remains the way to go.
- Having to support old browsers without the `<dialog>` element. I guess a polyfill might be better in a case like that, but also maybe not. Might as well use the same library for everything.
- Building more complex interactions relying on events. The native `<dialog>` element doesn’t come with an event API, so one cannot react to it being open or closed.
- Using a framework-specific wrapper around it, like React or Vue.js. It’s going to be easier to integrate with a11y-dialog than the native element.
