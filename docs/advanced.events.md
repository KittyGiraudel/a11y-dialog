---
id: advanced.events
title: Events
sidebar_label: Events
slug: /advanced/events
---

When shown, hidden and destroyed, the instance will emit certain events. It is possible to subscribe to these with the `on()` method which will receive the dialog container element and the [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) (if any).

The event object can be used to know which trigger (opener / closer) has been used in case of a `show` or `hide` event.

```javascript
dialog.on('show', function (dialogEl, event) {
  // Do something when dialog gets shown
  // Note: opener is `event.currentTarget`
})

dialog.on('hide', function (dialogEl, event) {
  // Do something when dialog gets hidden
  // Note: closer is `event.currentTarget`
})

dialog.on('destroy', function (dialogEl) {
  // Do something when dialog gets destroyed
})

dialog.on('create', function (dialogEl) {
  // Do something when dialog gets created
  // Note: because the initial `create()` call is made from the constructor, it
  // is not possible to react to this particular one (as registering will be
  // done after instantiation)
})
```

You can unregister these handlers with the `off()` method.

```javascript
dialog.on('show', doSomething)
// …
dialog.off('show', doSomething)
```
