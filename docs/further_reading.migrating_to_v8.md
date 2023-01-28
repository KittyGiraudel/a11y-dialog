---
title: Migrating to v8
slug: /migrating-to-v8
---

import Tabs from '@theme/Tabs';  
import TabItem from '@theme/TabItem';

Version 8 should be backward compatible with version 7 **for the most part** so the required changes should be minor if anything.

## Internet Explorer support

If you need to support Internet Explorer, you will need to stick to version 7 as version 8 made the conscious decision to drop support to keep the library size small and efficient.

## Private properties

“Private” instance properties used to be prefixed with an underscore (e.g. `_id`). This is no longer the case in version 8, which leverages TypeScript access support (`private`). Additionally, the `_openers`, `_closers` and `_listeners` properties no longer exist.

If you were doing weird things with these private properties, you’ll have to adjust your code to take the renaming into consideration, and ideally no longer use them at all.

## Events

Events used to be handled with a tiny home made event system. Instead, they now go entirely through the DOM. They are internally bound to the dialog container with `addEventListener` and they are emitted via `CustomEvent` objects.

While the `on` and `off` methods remain, the callback signature has changed. First, it no longer receive the dialog element, and secondly the event itself is different than it used to be since it’s now a `CustomEvent`. This goes for all event types.

<Tabs>
  <TabItem value="js-events" label="JS Events">

**Before (version 7):**

```js
// Version 7
dialog.on('show', function (container, event) {
  const target = event.target
  const opener = event.currentTarget
})
```

**After (version 8):**

```js
// Version 8
dialog.on('show', function (event) {
  // `event.target` contains the dialog container, since it’s where we dispatch
  // the custom event from.
  const container = event.target
  // `event.detail.target` contains the interacted-with element, which may be a
  // child of the actual dialog opener.
  const target = event.detail.target
  // The opener itself is not stored anywhere and needs to be retrieved with
  // `.closest(..)`.
  const opener = target.closest('[data-a11y-dialog-show]')
})
```

  </TabItem>
  <TabItem value="dom-events" label="DOM Events">

```js
// Version 7
container.addEventListener('show', function (event) {
  const container = event.target
  const target = event.detail.target
  const opener = event.detail.currentTarget
})
```

**After (version 8):**

```js
// Version 8
container.addEventListener('show', function (event) {
  const container = event.target
  const target = event.detail.target
  const opener = target.closest('[data-a11y-dialog-show]')
})
```

  </TabItem>
</Tabs>

Refer to the documentation on [events](./advanced.events.md) for more information about listening to dialog events.

### No more `create` event

It used to be possible to listen to `create` events, although it was very awkward because that event would be fired in the constructor. This means it used to fire, but it was technically impossible to bind a listener before it does. This oddity has been addressed.

Again, because it was basically a glitch, it shouldn’t cause any issue.

## Focus trap

The focus trap is improved in version 8. Namely, it addresses issues where certain focusable elements were not properly recognized as such when used as first or last item in the dialog (any other position than first/last worked fine).

It now properly accounts for [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), which means it plays nicely with web components (such as [Lit](https://lit.dev/), [webc](https://github.com/11ty/webc) or [Polymer](https://polymer-library.polymer-project.org/)). If you had problems with them before, you should be able to remove any workaround you might have come up with.

Additionally, it now properly handles `details` and `summary` elements. Namely:

- It considers focusable the first `summary` element directly within a `details` element, provided it doesn’t have a negative tabindex attribute.
- It considers focusable `details` elements provided they do not have a `summary` element and do not have a negative tabindex attribute.

Finally, it now checks for the presence of the [`inert` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert).

:::note  
While the [support for `inert`](https://caniuse.com/mdn-api_htmlelement_inert) is increasing, it’s not perfect. The focus trap will ignore inert elements and all elements inside them, **regardless** of the browser support for inert. If you want or need to rely on it, consider [using this polyfill](https://github.com/WICG/inert).  
:::
