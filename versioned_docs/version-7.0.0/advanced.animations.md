---
title: Animations
slug: /advanced/animations
---

As mentioned in the [styling](usage.styling.md) section, how the dialog looks is entirely up to the implementor (you). The following boilerplate code can be used to add a simple entering animation to the dialog.

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(10%);
  }
}

.dialog-overlay {
  animation: fade-in 200ms both;
}

/**
 * 1. Add an animation delay equal to the overlay animation duration to
 *    wait for the overlay to appear before animation in the dialog.
 */
.dialog-content {
  animation: fade-in 400ms 200ms both, slide-up 400ms 200ms both; /* 1 */
}
```
