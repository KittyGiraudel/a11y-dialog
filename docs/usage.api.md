---
title: API
slug: /usage/api
---

This page gives a quick overview of the public JavaScript API. For a concrete example of how to wire it into a page, see the [Quick start](./usage.quick_start.md), and for event details see [Events](./advanced.events.md).

## `A11yDialog` class

### Constructor

```js
new A11yDialog(element)
```

- **`element`**: The dialog container element (`HTMLElement`).
  - It must either have a unique `id`, or a `data-a11y-dialog` attribute whose value is used as the dialog identifier.
  - That identifier is referenced from openers and closers via `data-a11y-dialog-show="<id>"` and `data-a11y-dialog-hide="<id>"`.

### Properties

- **`shown: boolean`**  
  Whether the dialog is currently shown. This is updated by `show()` and `hide()` and should be treated as read-only.

### Methods

#### `show(event?) => this`

Shows the dialog:

- removes `aria-hidden` from the dialog container,
- remembers the element that was focused before opening and moves focus into the dialog,
- starts trapping focus within the dialog,
- dispatches a cancelable `'show'` event from the dialog container.

#### `hide(event?) => this`

Hides the dialog:

- sets `aria-hidden="true"` on the dialog container,
- stops focus trapping and key listeners associated with this instance,
- restores focus to the element that was focused before `show()` (when possible),
- dispatches a cancelable `'hide'` event from the dialog container.

#### `destroy() => this`

Cleans up the instance:

- dispatches a cancelable `'destroy'` event from the dialog container,
- hides the dialog if it is still open,
- removes delegated click handlers used by openers and closers,
- replaces the dialog element with a clone to avoid leaking event listeners attached by user code.

#### `on(type, handler, options?) => this`

Registers a listener for one of the instance events:

- `type`: `'show' | 'hide' | 'destroy'`.
- `handler`: An `EventListener` that receives a `CustomEvent`.
- `options`: Optional `AddEventListenerOptions`. Under the hood this calls `element.addEventListener(type, handler, options)`.

#### `off(type, handler, options?) => this`

Unregisters a previously added listener; a thin wrapper around `element.removeEventListener(type, handler, options)`.

## Events

All three instance events (`show`, `hide`, `destroy`) are:

- dispatched as [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) instances from the dialog container,
- cancelable via `event.preventDefault()`,
- carry the original DOM event (such as a click or keydown) in `event.detail` when triggered by user interaction rather than a direct method call.

For concrete examples and patterns, see the [Events](./advanced.events.md) page.
