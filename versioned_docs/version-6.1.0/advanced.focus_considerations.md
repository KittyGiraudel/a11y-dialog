---
title: Focus considerations
slug: /advanced/focus-considerations
---

When the dialog opens, the first focusable element receives the focus. From there, the focus is being “trapped” within the dialog: pressing <kbd>TAB</kbd> while focusing the last element will move the focus to the first, and pressing <kbd>SHIFT</kbd> + <kbd>TAB</kbd> while focusing the first element will move the focus to the last.

Note that [the way focusable elements are queried](https://github.com/KittyGiraudel/focusable-selectors) to handle the first and last ones as mentioned above is not completely bulletproof. For instance, it does not consider `<object>` elements, `<embed>` elements and `<details>` element without any child `<summary>` as focusable while it technically should. It also shows some [inconsistencies with `<iframe>` elements when first or last focusable element](https://github.com/KittyGiraudel/a11y-dialog/issues/149).

Additionally, if a form control within the dialog has the `autofocus` HTML attribute, it will receive focus when the dialog gets open instead of the first focusable item. The focus trap is not impacted by this whatsoever.

When the dialog closes, the element which was previously focused before opening should receive the focus back.
