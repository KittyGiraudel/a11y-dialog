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
const html = document.documentElement
const dialog = new A11yDialog(dialogNode)

dialog
  .on('show', () => (html.style.overflowY = 'hidden'))
  .on('hide', () => (html.style.overflowY = ''))
```
