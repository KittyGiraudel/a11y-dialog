---
title: Web components
slug: /further-reading/web-components
---

Although a11y-dialog does not provide a custom element out of the box, it should play nicely with [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) and [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM).

Here are things that the library pays particular attention to:

- The [focus trap](advanced.focus_considerations.md#focus-trap) properly considers Shadow DOM so it will find the first and last focusable elements within the dialog even if these elements live within web components.
- The [focus restoration](advanced.focus_considerations.md#focus-restoration) properly considers Shadow DOM, so if the focused element before opening the dialog lives inside a custom element, it will be properly focused when closing the dialog.
- [Clicking a dialog opener or closer](usage.interactions.md#dom-api) (elements with `data-a11y-dialog-*` attributes) within a custom element works as expected, and can find the dialog to open or close through Shadow DOM boundaries.
- [Nested dialogs](advanced.nested_dialogs.md) (however questionable) also behave properly even if they are rendered using Shadow DOM and custom elements.

:::tip  
There are some automated tests to cover integrations with web components, but it is not impossible for a11y-dialog to have some shortcomings, so be sure to open an issue if you struggle to integrate it with a custom element.  
:::
