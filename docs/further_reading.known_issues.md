---
title: Known issues
slug: /further-reading/known-issues
---

## aria-hidden content on VoiceOver

Content with `aria-hidden` appears to be sometimes read by VoiceOver on iOS and macOS. It is unclear in which case this happens, and does not appear to be an issue directly related to the library. Refer to this [WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=201887#c2) for more information.

## aria-labelledby announcement on VoiceOver

The dialog name associated via `aria-labelledby` is not read by VoiceOver in Chrome and FireFox (but is in Safari). This peculiar behavior appears when the close button is located before the dialog name.

Making sure the element associated with `aria-labelledby` comes as a first child of the dialog is a simple workaround to this minor issue.

## Mobile issues

The library relies on `aria-modal`, a standardized attribute from [WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-1.1/#aria-modal). Unfortunately, the [support for this attribute](https://a11ysupport.io/tech/aria/aria-modal_attribute) is not incredible with certain mobile assistive technologies, as reported in [issue #408](https://github.com/KittyGiraudel/a11y-dialog/pull/408). If that’s an issue for you, you have two equally viable options:

- Use [version 6](/6.1.0/) of the library which did not rely on the `aria-modal` attribute. Keep in mind the setup is significantly more complex though — pay attention to the documentation.

- Use the library in conjunction with the [aria-hidden](https://github.com/theKashey/aria-hidden) package (<1kb) to combine both implementations for maximum support. Refer to [this demo](https://codesandbox.io/s/a11y-dialog-w-aria-hidden-v8-u3unbr) for implementation details.

```js {2,6,8-15}
import A11yDialog from 'a11y-dialog'
import { hideOthers } from 'aria-hidden'

const container = document.querySelector('#my-dialog')
const dialog = new A11yDialog(container)
let registered = false

dialog.on('show', function (event) {
  const undo = hideOthers(container)

  if (!registered) {
    dialog.on('hide', undo)
    registered = true
  }
})
```

## popover considerations

Be cautious if you use a11y-dialog alongside the [native popover API](https://developer.chrome.com/blog/introducing-popover-api/), as mentioned in [this article by Adrian Roselli](https://adrianroselli.com/2023/05/brief-note-on-popovers-with-dialogs.html).

When processing <kbd>ESC</kbd> key presses, a11y-dialog will first check whether the dialog contains an open popover, and if it does, will **not** close the dialog since the key press was intended to hide the popover.

However, this is **not** done for clicks on the backdrop. So clicking the backdrop of the dialog while a popover is open will actually close the dialog, which is not intended.

Feel free to bump [issue #667](https://github.com/KittyGiraudel/a11y-dialog/issues/667) with your recommendations in order to give traction to this issue.
