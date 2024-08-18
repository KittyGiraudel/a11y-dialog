---
title: Styling
slug: /usage/styling
---

The script itself does not take care of any styling whatsoever, not even the `display` property. It basically mostly toggles the `aria-hidden` attribute on the dialog itself and its counterpart content containers (where the rest of the site/app lives).

Here is a solid set of styles to get started (note that you might have to rename the class names to fit your code):

```css
/**
 * 1. Make the dialog container, and its child overlay spread across the entire 
 *    window.
 */
.dialog-container,
.dialog-overlay {
  position: fixed; /* 1 */
  inset: 0; /* 1 */
}

/**
 * 1. Make sure the dialog container and all its descendants sits on top of the
 *    rest of the page.
 * 2. Make the dialog container a flex container to easily center the dialog.
 */
.dialog-container {
  z-index: 2; /* 1 */
  display: flex; /* 2 */
}

/**
 * 1. Make sure the dialog container and all its descendants are not visible and
 *    not focusable when the dialog is hidden.
 */
.dialog-container[aria-hidden='true'] {
  display: none; /* 1 */
}

/**
 * 1. Make the overlay look like an overlay.
 */
.dialog-overlay {
  background-color: rgba(43, 46, 56, 0.9); /* 1 */
}

/**
 * 1. Vertically and horizontally center the dialog in the page.
 * 2. Make sure the dialog sits on top of the overlay.
 * 3. Make sure the dialog has an opaque background.
 */
.dialog-content {
  margin: auto; /* 1 */
  z-index: 2; /* 2 */
  position: relative; /* 2 */
  background-color: white; /* 3 */
}
```

The rest, such as what the dialog really looks like, and how its content is styled, is left at your own discretion. These styles should be enough to get you on the right track.

:::tip  
Feel free to look at the [demo on CodeSandbox](https://codesandbox.io/s/a11y-dialog-v7-pnwqu) for more extensive styles.  
:::

## Scrollable content

For dialogs that may hold a lot of content, or generally to make dialogs resilient to arbitrary content, you may want to make sure it has a maximum height and can scroll. The way you go about it depends on your styles, but the following declarations should get you mostly there:

```css
.dialog-content {
  overflow: auto;
  max-height: 90vh;
}
```

Please refer to [this CodeSandbox](https://codesandbox.io/s/a11y-dialog-v7-scrollable-g5ysc5) for a demo of a dialog with scrollable content.
