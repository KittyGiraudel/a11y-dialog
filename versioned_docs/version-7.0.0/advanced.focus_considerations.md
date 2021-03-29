---
title: Focus considerations
slug: /advanced/focus-considerations
---

When the dialog opens, the first focusable element receives the focus. From there, the focus is being “trapped” within the dialog: pressing <kbd>TAB</kbd> while focusing the last element will move the focus to the first, and pressing <kbd>SHIFT</kbd> + <kbd>TAB</kbd> while focusing the first element will move the focus to the last.

Note that [the way focusable elements are queried](https://github.com/KittyGiraudel/focusable-selectors) to handle the first and last ones as mentioned above is not completely bulletproof. For instance, it does not consider `<object>` elements, `<embed>` elements and `<details>` element without any child `<summary>` as focusable while it technically should. It also shows some inconsistencies with `<iframe>` elements when first or last focusable element.

Additionally, if a form control within the dialog has the `autofocus` HTML attribute, it will receive focus when the dialog gets open instead of the first focusable item. The focus trap is not impacted by this whatsoever.

When the dialog closes, the element which was previously focused before opening should receive the focus back.

## Advanced integrations

As of 7.1.0, a11y-dialog no longer moves the focus back within the dialog if the focused element lives within an element with the `data-a11y-dialog-ignore-focus-trap` attribute. This is an escape hatch for advanced integrations with other libraries such as popper.js, where some content technically lives outside of the dialog itself (similar to a nested dialog for instance). **Use with caution as this can severely damage screen-reader users’ experience.**
