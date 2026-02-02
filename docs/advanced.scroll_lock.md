---
title: Scroll lock
slug: /advanced/scroll-lock
---

While the page might not be interactive below the dialog, the window will still receive and process scroll events, making it possible to scroll the page while the dialog is open. This might not be desired.

To prevent it from happening, one can hide overflow from the `<html>` element when the dialog opens. This can be achieved with native CSS:

```css
/**
 * 1. Prevent page scrolling while the dialog is open
 * 2. Keep the scrollbar width stable
 *    See: https://www.htmhell.dev/adventcalendar/2025/9/
 */
html:has([role='dialog']:not([aria-hidden='true'])) {
  overflow: hidden; /* 1 */
  scrollbar-gutter: stable; /* 2 */
}
```

If the CSS approach does not suit you for any reason (e.g. lack of browser support for `:has`), you can do it in JavaScript instead:

```js
import A11yDialog from 'a11y-dialog'

const container = document.querySelector('#your-dialog-id')
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

const container = document.querySelector('#your-dialog-id')
const dialog = new A11yDialog(container)

dialog
  // highlight-next-line
  .on('show', () => disableBodyScroll(container))
  // highlight-next-line
  .on('hide', () => enableBodyScroll(container))
```
