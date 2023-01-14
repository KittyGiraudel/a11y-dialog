---
title: Events
slug: /advanced/events
---

## Instance events

When shown, hidden and destroyed, the instance will emit certain events. It is possible to subscribe to these with the `on()` method which will receive the [event object](https://developer.mozilla.org/en-US/docs/Web/API/Event) (if any).

For events triggered from interacting with a UI element (such as opening or closing with a button), the original click event is passed in the `detail` key of the DOM event. For instance, to access the button that was interacted with to open the dialog, one can use `event.detail.target`.

```js
dialog.on('show', function (event) {
  // Do something when dialog gets shown
  // Note: opener is `event.detail.target`
})

dialog.on('hide', function (event) {
  // Do something when dialog gets hidden
  // Note: closer is `event.detail.target`
})

dialog.on('destroy', function () {
  // Do something when dialog gets destroyed
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
container.addEventListener('show', function (event) {
  // Do something when dialog gets shown
  // Note: opener is `event.detail.target`
})

container.addEventListener('hide', function (event) {
  // Do something when dialog gets hidden
  // Note: closer is `event.detail.target`
})

container.addEventListener('destroy', function () {
  // Do something when dialog gets destroyed
})
```

You can unregister these event listeners with the `removeEventListener()` method, just like any other DOM event.

```js
container.addEventListener('show', doSomething)
// …
container.removeEventListener('show', doSomething)
```
