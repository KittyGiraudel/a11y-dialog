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
 * 1. Add an animation delay equal to the overlay animation duration to wait for
 *    the overlay to appear before animation in the dialog.
 */
.dialog-content {
  animation: fade-in 400ms 200ms both, slide-up 400ms 200ms both; /* 1 */
}
```

We'd invite you to consider your user's motion preferences by utilizing the `prefers-reduced-motion` media query when adding animations to your CSS. For example, you can place a small snippet below the animation or transition code from above with:

```css
@media (prefers-reduced-motion: reduce) {
  .dialog-close {
    transition: none;
  }
  .dialog-content {
    animation: none;
  }
}
```

Here, we have turned the animation and transition completely off if the user prefers reduced motion. This approach is [only suitable](https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/#taking-it-to-code) if core functionality is not removed by doing so. In our case, the core showing and hiding of the dialog is done through `dialog[aria-hidden='true']` which is unrelated to the animation code entirely.

This step is crucial for users with vestibular motion disorders:

- [Designing With Reduced Motion For Motion Sensitivities](https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities/) by [Val Head](https://valhead.com/)
- [prefers-reduced-motion: Taking a no-motion-first approach to animations](https://www.tatianamac.com/posts/prefers-reduced-motion/) by [Tatiana Mac](https://www.tatianamac.com/)
- [Implementing a reduced-motion mode](https://kittygiraudel.com/2018/03/19/implementing-a-reduced-motion-mode/) by [Kitty Giraudel](https://kittygiraudel.com/)
- [MDN's prefers-reduced-motion docs](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
