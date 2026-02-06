---
title: Events
slug: /advanced/events
---

## Instance events

When shown, hidden and destroyed, the instance will emit certain events. It is possible to subscribe to these with the `.on(..)` method which will receive a cancelable [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

The three instance events are:

- `show`: Fired when the dialog is requested to open (via `show()` or an opener). Cancelable.
- `hide`: Fired when the dialog is requested to close (via `hide()` or a closer / <kbd>ESC</kbd>). Cancelable.
- `destroy`: Fired when the dialog instance is about to be destroyed. Cancelable.

For events triggered from interacting with a UI element (such as opening or closing with a button), the original click event is passed in the `detail` key of the DOM event.

Therefore:

- `event.target` is the **dialog container** since all events are dispatched from that element under the hood.
- `event.detail` contains the original click event (if triggered via a UI interaction).
- `event.detail.target` contains the element that was interacted with. **Beware:** This may be a descendant of the dialog opener/closer such as an icon!
- `event.detail.target.closest('[data-a11y-dialog-show]')` can be used to retrieve the actual opener.
- `event.detail.target.closest('[data-a11y-dialog-hide]')` can be used to retrieve the actual closer.

```js
// Do something when the dialog gets shown
dialog.on('show', function (event) {
  const container = event.target
  // And if the event is the result of a UI interaction (i.e. was not triggered
  // programmatically via `.show(..)`), the `detail` prop contains the original
  // event
  if (event.detail) {
    const target = event.detail.target
    const opener = target.closest('[data-a11y-dialog-show]')
  }
})

// Do something when the dialog gets hidden
dialog.on('hide', function (event) {
  const container = event.target
  // And if the event is the result of a UI interaction (i.e. was not triggered
  // programmatically via `.hide(..)`), the `detail` prop contains the original
  // event
  if (event.detail) {
    const target = event.detail.target
    const closer = target.closest('[data-a11y-dialog-hide]')
  }
})

// Do something when the dialog instance gets destroyed
dialog.on('destroy', function (event) {
  const container = event.target
})
```

You can unregister these handlers with the `off()` method.

```js
dialog.on('show', doSomething)
// …
dialog.off('show', doSomething)
```

## DOM events

For [auto-instantiated dialogs](usage.instantiation.md) though, registering event listeners on the instance is not possible since there is no access to the dialog instance itself. To work around the problem while still relying on auto-instantiation, it is possible to listen for DOM events on the dialog container. The API is exactly the same since the `.on(..)` and `.off(..)` methods are just aliases for `.addEventListener(..)` and `.removeEventListener(..)`.

```js
// Do something when the dialog gets shown
container.addEventListener('show', function (event) {
  const container = event.target
  const target = event.detail.target
  const opener = target.closest('[data-a11y-dialog-show]')
})

// Do something when the dialog gets hidden
container.addEventListener('hide', function (event) {
  const container = event.target
  const target = event.detail.target
  const closer = target.closest('[data-a11y-dialog-hide]')
})

// Do something when the dialog instance gets destroyed
container.addEventListener('destroy', function (event) {
  const container = event.target
})
```

You can unregister these event listeners with the `removeEventListener()` method, just like any other DOM event.

```js
container.addEventListener('show', doSomething)
// …
container.removeEventListener('show', doSomething)
```

## Canceling events

As of v8.1.0, all three events can be prevented to opt out from the default behavior. This can be particularly handy to prevent pressing <kbd>ESC</kbd> from closing the dialog when another widget is being interacted with (such as a dropdown or tooltip).

```js
dialog.on('hide', function (event) {
  // If the `hide` event was the result of pressing the ‘Escape’ key, and a
  // hypothetical dropdown menu contained within the dialog is open, prevent
  // the `hide` operation from completing.
  if (event.detail?.key === 'Escape' && isDropdownMenuOpen()) {
    event.preventDefault()
  }
})
```

The same can be done with DOM events as well:

```js
container.addEventListener('hide', function (event) {
  // If the `hide` event was the result of pressing the ‘Escape’ key, and a
  // hypothetical dropdown menu contained within the dialog is open, prevent
  // the `hide` operation from completing.
  if (event.detail?.key === 'Escape' && isDropdownMenuOpen()) {
    event.preventDefault()
  }
})
```
