---
id: advanced.dialog_element
title: Dialog element
sidebar_label: Dialog element
slug: /advanced/dialog-element
---

As mentioned in the [HTML section](#html-boilerplate), the script works fine with the native HTML `<dialog>` element and will polyfill its behaviour so the dialog works in any browser, regardless of their support for that HTML element. However, it is recommended _not_ to use it and to rely on a `<div>` with `role="dialog"` instead. Amongst other, here are the issues with the HTML `<dialog>` element:

- Clicking the backdrop does not close the dialog on Chrome.
- The native `::backdrop` only shows when programatically opening the dialog, not when using the `open` attribute.
- Default styles are left to the browsers’ discretion and can be inconsistent.
- The [modal pattern](#usage-as-a-modal) (`role="alertdialog"`) simply does not work with the dialog element.
- It still requires JavaScript anyway, so it’s not even 100% HTML.
- [Read more about the shortcoming of the dialog element by Scott O'hara](https://www.scottohara.me/blog/2019/03/05/open-dialog.html).

If you really want to use the `<dialog>` HTML element nevertheless, here are a few things you should know.

The [provided base styles](#styling) will not quite work because the dialog container does not receive the `aria-hidden` attribute when hidden. That is because the dialog’s visibility is handled by the user-agent itself. This means the container is essentially always displayed. For that reason, it should not made fixed on top of everything, otherwise it prevents interacting with the page at all.

Fortunately, the library adds a `data-a11y-dialog-native` attribute (with no value) when the `<dialog>` element is used and natively supported. This attribute can be used to customise the styling layer based on user-agent support (or lack thereof).

The following styles are more suited to using `<dialog>`.

```css
/**
 * 1. When the native `<dialog>` element is supported and used, the overlay is
 *    handled natively and can be styled with `::backdrop`, which means the DOM
 *    one should be removed. Feel free to replace `:first-child` with the
 *    overlay selector of your choice.
 */
[data-a11y-dialog-native] > :first-child {
  display: none; /* 1 */
}

/**
 * 1. Absolutely center the dialog on top of the page.
 */
dialog {
  position: fixed; /* 1 */
  top: 50%; /* 1 */
  left: 50%; /* 1 */
  transform: translate(-50%, -50%); /* 1 */
  z-index: 2; /* 1 */
}

/**
 * 1. When the `<dialog>` element is used but not supported by the user agent,
 *    its default display is `inline` which can cause layout issues. This makes
 *    sure the dialog is correctly displayed when open.
 */
dialog[open] {
  display: block; /* 1 */
}

/**
 * 1. Make the overlay look like an overlay.
 */
dialog::backdrop {
  background-color: rgba(43, 46, 56, 0.9); /* 1 */
}
```

When the `<dialog>` element is used and natively supported, the argument passed to `show()` and `hide()` is being passed to the native call to [`showModal()`](https://www.w3.org/TR/html52/interactive-elements.html#dom-htmldialogelement-showmodal) and [`close()`](https://www.w3.org/TR/html52/interactive-elements.html#dom-htmldialogelement-close). If necessary, the `returnValue` can be read using `<instance>.dialog.returnValue`.
