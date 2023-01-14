---
title: Migrating to v8
slug: /migrating-to-v8
---

Version 8 should be backward compatible with version 7 for the most part so the required changes should be minor if anything.

## Internet Explorer support

If you need to support Internet Explorer, you will need to stick to version 7 as version 8 made the conscious decision to drop support to keep the library size small and efficient.

## Private properties

“Private” instance properties used to be prefixed with an underscore (e.g. `_id`). This is no longer the case in version 8, which leverages TypeScript access support (`private`). Additionally, the `_openers`, `_closers` and `_listeners` properties no longer exist.

If you were doing weird things with these private properties, you’ll have to adjust your code to take the renaming into consideration, and ideally no longer use them at all.

## DOM events

Events used to be handled with a tiny home made event system. Instead, they now go entirely through the DOM. They are internally bound to the dialog container with `addEventListener` and they are emitted via `CustomEvent` objects.

While the `on` and `off` methods remain, the callback signature has changed. First, it no longer receive the dialog element, and secondly the event itself is different than it used to be since it’s now a `CustomEvent`. This goes for all event types.

**Before (version 7):**

```js
// Version 7
dialog.on('show', function (element, event) {
  const opener = event.currentTarget
})
```

**After (version 8):**

```js
// Version 8
dialog.on('show', function (event) {
  const opener = event.detail.currentTarget
})
```

## No more `create` event

It used to be possible to listen to `create` events, although it was very awkward because that event would be fired in the constructor. This means it used to fire, but it was technically impossible to bind a listener before it does. This oddity has been addressed.

Again, because it was basically a glitch, it shouldn’t cause any issue.

## Shadow DOM

Shadow DOM should now be properly accounted for within the focus trap, so you should be able to remove any workaround you might have come up with.
