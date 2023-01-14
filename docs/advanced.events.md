---
title: Events
slug: /advanced/events
---

## Instance events

When shown, hidden and destroyed, the instance will emit certain events. It is possible to subscribe to these with the `on()` method which will receive the dialog container element and the [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) (if any).

The event object can be used to know which trigger (opener / closer) has been used in case of a `show` or `hide` event.

```js
dialog.on('show', function (element, event) {
  // Do something when dialog gets shown
  // Note: opener is `event.currentTarget`
})

dialog.on('hide', function (element, event) {
  // Do something when dialog gets hidden
  // Note: closer is `event.currentTarget`
})

dialog.on('destroy', function (element) {
  // Do something when dialog gets destroyed
})

dialog.on('create', function (element) {
  // Do something when dialog gets created
  // Note: because the initial `create()` call is made from the
  // constructor, it is not possible to react to this particular
  // one (as registering will be done after instantiation)
})
```

You can unregister these handlers with the `off()` method.

```js
dialog.on('show', doSomething)
// …
dialog.off('show', doSomething)
```

## DOM events

For [auto-instantiated dialogs](usage.instantiation.md) though, registering event listeners on the instance is not possible since there is no access to the dialog instance itself. To work around the problem while still relying on auto-instantiation, it is possible to listen for DOM events on the dialog container.

```js
dialog.addEventListener('show', function (event) {
  // Do something when dialog gets shown
  // Note: opener is `event.detail.currentTarget`
})

dialog.addEventListener('hide', function (event) {
  // Do something when dialog gets hidden
  // Note: closer is `event.detail.currentTarget`
})

dialog.addEventListener('destroy', function (event) {
  // Do something when dialog gets destroyed
})

dialog.addEventListener('create', function (event) {
  // Do something when dialog gets created
})
```

For events triggered from interacting with a UI element (such as opening or closing with a button), the original click event is passed in the `detail` key of the DOM event. For instance, to access the button that was interacted with to open the dialog, one can use `event.detail.currentTarget`.

Because these event listeners can be registered on the DOM element, before the dialog gets instantiated at all (or even before the script gets even loaded), it is possible to react to dialog _creation_ (with the `create` event), which is not possible otherwise.

You can unregister these event listeners with the `removeEventListener()` method, just like any other DOM event.

```js
dialog.addEventListener('show', doSomething)
// …
dialog.removeEventListener('show', doSomething)
```
