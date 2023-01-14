---
title: Scroll lock
slug: /advanced/scroll-lock
---

While the page might not be interactive below the dialog, the window will still receive and process scroll events, making it possible to scroll the page while the dialog is open. This might not be desired.

To prevent it from happening, one can hide overflow from the `<html>` element when the dialog opens, and restore it when hidden:

```js
import A11yDialog from 'a11y-dialog'

const container = document.getElementById('your-dialog-id')
const dialog = new A11yDialog(container)

dialog
  // highlight-next-line
  .on('show', () => (document.documentElement.style.overflowY = 'hidden'))
  // highlight-next-line
  .on('hide', () => (document.documentElement.style.overflowY = ''))
```

For more a comprehensive solution, you could use [body-scroll-lock](https://github.com/willmcpo/body-scroll-lock). It clocks at 1Kb, and is a little bit more bulletproof than the solution suggested above.

```js
import A11yDialog from 'a11y-dialog'
// highlight-next-line
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const container = document.getElementById('your-dialog-id')
const dialog = new A11yDialog(container)

dialog
  // highlight-next-line
  .on('show', () => disableBodyScroll(container))
  // highlight-next-line
  .on('hide', () => enableBodyScroll(container))
```
