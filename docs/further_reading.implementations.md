---
title: Implementations
slug: /further-reading/implementations
---

If you happen to work with React, Vue, Solid or Svelte in your project, you’re lucky! There are already great lightweight wrappers implemented for `a11y-dialog`:

- [react-a11y-dialog](https://github.com/KittyGiraudel/react-a11y-dialog)
- [vue-a11y-dialog](https://github.com/morkro/vue-a11y-dialog)
- [svelte-a11y-dialog](https://github.com/AgnosticUI/svelte-a11y-dialog)
- [solid-a11y-dialog](https://github.com/Matth10/solid-a11y-dialog)

## Alternatives to `react-a11y-dialog`

:::info

This section was originally posted on the [react-a11y-dialog repository](https://github.com/KittyGiraudel/react-a11y-dialog/issues/58) in 2021. While the situation may have changed a little, it remains a solid comparison of react-a11y-dialog and its popular alternatives.

:::

The major difference between `react-a11y-dialog` and `@reach/dialog`, `@react-aria/dialog` or `@headlessui/dialog` is that they ultimately belong to an encompassing framework (`@reach`, `@react-aria` and `@headlessui/react` respectively). So if you are using their toolbelts already, you might as well use their dialog implementation, since it’s included in.

I’m going to assume you are in fact not using `@reach`, `@react-aria` or `@headlessui/react` fully, so let’s break it down a little and see what’s going on.

### File size

Let’s start by talking about file size. Here is the information gathered from [bundlephobia](https://bundlephobia.com/):

- [@reach/dialog@0.13.2](https://bundlephobia.com/result?p=@reach/dialog@0.13.2): 9Kb
- [@react-aria/dialog@3.1.2](https://bundlephobia.com/result?p=@react-aria/dialog@3.1.2): 4.4Kb
- [react-a11y-dialog@5.1.1](https://bundlephobia.com/result?p=react-a11y-dialog@5.1.1): 3.2Kb
- [@headlessui/react@1.4.0](https://bundlephobia.com/package/@headlessui/react@1.4.0) doesn’t have sub-packages for individual components, so you gotta take the whole 17.8Kb (although it will be tree-shaken I guess). Looking at the break down, 6.7Kb go into `Dialog`, and 3.7Kb into `FocusTrap`.

If you ask me, 9Kb for a dialog script is too much. The composition of the `@react/dialog` package is interesting though: 20% of it is a package intended to lock the window scroll. This is something `a11y-dialog` does not do natively, but offers [a 2-lines solution](advanced.scroll_lock.md).

After that we have 30% in 2 focus trap packages, which is not too surprising since that is the core of a dialog. Still, 2.9Kb is a lot in my opinion—that’s almost the entire size of `react-a11y-dialog`. The only reason I can think of for why trapping the focus is that heavy is because it handles more cases than a11y-dialog (see [focus trap](#focus-trap) below).

On `@react-aria/dialog`’s side, 50% of its size comes from `@react-aria/interactions`, a utility library providing all `@react-aria` packages some handy hooks and functions to handle keyboard shortcuts and focus management. Do they need all of it in the dialog component/hook? Most likely not. I guess tree-shaking will shuffle down what’s not needed, but still. That makes a lot of sense in the context of their overall framework though. The more packages you use from the framework, the more code can be reused—that’s a good approach for both of these libs.

Since there is no way to get only the dialog from `@headlessui/react`, I’d say only use it if you’re going to use more of its components otherwise that feels like an overpriced dialog honestly.

### Focus trap

Trapping the focus within the dialog is probably what’s hardest in building a dialog library. The basics are very easy to cover, but if you want to cover every single case, it takes a lot of effort. And that’s because getting all focusable elements is way harder than it should be.

a11y-dialog uses [focusable-selectors](https://github.com/kittygiraudel/focusable-selectors), a micro-package of my own, which exposes a collection of CSS selectors aiming at querying all the focusable elements. Unfortunately, it is not possible with CSS only, because of certains cases outlined in the documentation of another package attempting to do this more reliable, [focus-trap/tabbable](https://github.com/focus-trap/tabbable#more-details).

Looking at how [focus-lock](https://github.com/theKashey/focus-lock/blob/master/src/utils/tabbables.ts) (the library used by `@reach/dialog`) queries tabbable elements, I would say there is a lot they do not cover here (although the code is so fragmented, it’s a little hard to be certain). Naming just a few: `audio` and `video` should have the `controls` attribute to be focusable, elements with the `tabindex` attribute are only tabbable if the value is not negative, hidden inputs should not be considered tabbable and radio inputs are their own mess as well. That being said, the library itself is 2.5Kb, so I assume it does quite a lot of things, still.

Looking at [FocusScope](https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/focus/src/FocusScope.tsx#L152) (the component used by `@react-aria`), it looks a little more solid to me, but still it’s _a lot of code_, so I hope they do handle focusable elements more comprehensively than what a11y-dialog does, otherwise I wonder why one needs so much code.

The way `@headlessui/react` finds focusable elements is similar to the one from a11y-dialog but omits quite a few cases, such as `audio` and `video` elements with the `controls` attribute, and yields false positives like considering hidden inputs and visually hidden elements focusable. So not bad, but also not perfect I’d say (if there is even such a thing), especially considering it ships almost 4Kb for that purpose only.

### Implementation

When it comes to making anything but the dialog itself “inert” (as in, non discoverable/focusable), you have 2 big methods:

1. Setting `aria-hidden="true"` to the content container (or containers, if your application is divided in multiple root containers) when the dialog is open, and turning it off when the dialog is closed. Similarly, the dialog (or its container) should have `aria-hidden="true"` when closed so it’s also only usable when open.

2. Setting `aria-modal="true"` on the dialog to essentially do the same thing and make it stand out.

As far as I know, the first method was there first, before the `aria-modal` attribute was formally introduced, and has long been the most solid way to make it happen. My understanding is that as of now, both methods are equally fine.

- [Birkir Gunnarsson](https://twitter.com/birkir_gun/status/1366261145066176514?s=20) told me on Twitter that `aria-modal="true"` should be fine provided the focus is handled properly (which goes without saying).
- [Aurélien Levy](https://twitter.com/goetsu/) told me old versions of VoiceOver didn’t handle `aria-modal` well but as of now, his company Temesis, recommends the `aria-modal` approach to less mature development team because the implementation is easier than toggling `aria-hidden` on a few containers.

`@react-aria/dialog` (and `a11y-dialog` v6 and below) use the `aria-hidden="true"` strategy while `@reach/dialog`, `@headlessui/react` and `a11y-dialog` all use the `aria-modal="true"` strategy.

All that being said, if support with old assistive technologies is of any concern for you, you might want to stick to an implementation that switches the `aria-hidden` attribute to be on the safe side.

### Other features

#### Alert dialogs

It seems that all libraries but `@headlessui/react` support using alert dialogs, which are dialogs that require user interaction and therefore cannot be closed via <kbd>ESC</kbd> or clicking on the backdrop. `@reach` offers it as another package though (`@reach/alert-dialog`), which weighs 9.7Kb (although it probably share a lot of code with the `@reach/dialog` one so it’s going to be less than 19Kb in practice). I couldn’t figure out how to do it with `@react-aria/dialog` but their documentation says it’s possible, and their codebase mentions an `AlertDialog` component, so maybe it just doesn’t exist with the hook.

#### Events

They also all provide some sort of event system to react to the dialog being open or closed, which is sometimes necessary to buid more complex interfaces.

#### Nested dialogs

I didn’t really dig for nested dialogs’ support since it’s a pretty fishy design pattern anyway, but this is supported by `a11y-dialog` under the hood. I don’t know whether it’s handled properly by `react-a11y-dialog` though—I never tried. `@react-aria/dialog` mentions it in its documentation, so it must be supported. `@headlessui/react` does not mention it in its documentation but [supports it](https://twitter.com/malfaitrobin/status/1423271008350482434?s=20) and `@reach/dialog` doesn’t mention it anywhere, so probably not.

#### Flexibility

All libraries provide decent flexibility overall: `@reach/dialog` and `@headlessui/react` do not have a hook, but they have several components for the container, the overlay, the dialog… `react-a11y-dialog` exports both a component and a hook for more advanced use cases. `@react-aria/dialog` provides the most flexibility with a lot of hooks and components which can be brought together.

#### Miscellaneous

Another thing I noticed is that `@reach/dialog` provides a way to determine which element should receive focus when opening the dialog, which can be handy in some cases where you have an extremely long dialog, and the first focusable element would cause it to scroll all the way to the bottom. In a case like this, being able to focus, say, the title instead is a good solution.

### License & support

`@react/reach` is published under MIT, and is now maintained mainly by one person from what I can see on their repository, Chance Strickland. It’s a big React framework though, so I don’t see it disappearing any time soon.

`@react-aria` is maintained by Adobe under the Apache-2.0 license, which I assume is less permissive than MIT but still allows commercial use, so that’s basically just as good for most use cases I guess. There seem to be more contributors, which is kind of nice.

`@headlessui/react` is maintained by one person only (as far as I can tell, Robin Malfait) under the MIT license. It’s part of the TailwindLabs GitHub organization though, so probably not going anywhere.

`react-a11y-dialog` and `a11y-dialog` are solely maintained by me and published under MIT. I authored `a11y-dialog` in 2016 and have published it 50 times across 8 different major releases since then. That’s the open-source project I enjoy working on the most, but ultimately, it’s subject to me maintaining it of course.

All that being said, a dialog is a dialog. Once it’s up and running, it should be able to stand the test of time. The accessibility/browser landscape doesn’t move so fast that our current implementations will become obsolete a year down the line. Heck, years old implementations are still totally great to this day because nothing really changed that much.

### Conclusion

First off: **any of these 4 libraries will be great.** They are all solving the main problem: creating accessible dialogs. So you can’t really go wrong. I’m not a fan of the absence of sub-packages for `@headlessui/react`, and between `@reach/dialog` and `@react-aria/dialog`, I personally prefer the latter, because it’s half the size of the former but provides the same feature set and flexibility as far as I can tell.

I will keep using `react-a11y-dialog` because it’s small, and built on top of a tiny and solid library I maintain myself.

Ultimately, it’s going to depend what you value the most. If you want to do fancy things and want a lot of flexibility, `react-a11y-dialog` might fall a little short (although I think you’ll still be able to manage to do whatever with it). In a case like this, one of the other libraries would provide you more of a toolbelt to build dialog-based interactions the way you intend it.

If you want something lightweight and simple, `react-a11y-dialog` is probably a good idea. Heck, you could even use `a11y-dialog` instead and build your own component or hook. Ultimately, it’s not much more than:

```js
const MyDialogComponent = props => {
  const container = React.useRef()

  React.useEffect(() => {
    const instance = new A11yDialog(container.current)

    return () => {
      if (instance) instance.destroy()
    }
  }, [])

  return ReactDOM.createPortal(
    <div
      ref={container}
      id={props.id}
      aria-labelledby={props.id + '-title'}
      aria-hidden="true"
    >
      <div data-a11y-dialog-hide></div>
      <div role="document">
        <h1 id={props.id + '-title'}>{props.title}</h1>
        {props.children}
        <button type="button" data-a11y-dialog-hide>
          Close
        </button>
      </div>
    </div>,
    document.body
  )
}
```
