---
title: Focus considerations
slug: /advanced/focus-considerations
---

## Focused element

When the dialog opens, the dialog container receives the focus. This is why it is important it has a `tabindex="-1"` attribute — so that it can be programmatically focused with JavaScript.

That is unless there is a form control within the dialog with the `autofocus` HTML attribute, as per [the specification](https://github.com/whatwg/html/commit/a9f103c9f7bd09ef712990194638c75db1f50e3c). In that case, that element will receive the focus when the dialog opens instead of the dialog container. The focus trap (mentioned below) is not impacted by this whatsoever.

## Focus Trap

The focus is being “trapped” within the dialog: pressing <kbd>TAB</kbd> while focusing the last element will move the focus to the first, and pressing <kbd>SHIFT</kbd> + <kbd>TAB</kbd> while focusing the first element will move the focus to the last. Note that the dialog container does not belong to that focus trap since it has `tabindex="-1"`.

:::info  
It is worth mentioning that [the way focusable elements are queried](https://github.com/KittyGiraudel/focusable-selectors) to handle the first and last ones as mentioned above is not completely bulletproof. For instance, it does not consider `<object>` elements, `<embed>` elements and `<details>` element without any child `<summary>` as focusable while it technically should. It also shows some [inconsistencies with `<iframe>` elements when first or last focusable element](https://github.com/KittyGiraudel/a11y-dialog/issues/149).  
:::

## Focus restoration

When the dialog closes, the element which was previously focused before opening the dialog receives the focus back again — typically the dialog opener that was interacted with.

## Advanced integrations

The script does not move the focus back within the dialog if the focused element lives within an element with the `data-a11y-dialog-ignore-focus-trap` attribute (with 1’s, not L’s). This is an escape hatch for advanced integrations with other libraries such as popper.js, where some content technically lives outside of the dialog itself (similar to a nested dialog for instance).

:::danger  
Use this escape hatch with caution as this can severely damage screen-reader users’ experience.  
:::
