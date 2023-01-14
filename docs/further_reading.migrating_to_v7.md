---
title: Migrating to v7
slug: /migrating-to-v7
---

Versions 6 and 7 represent a significant gap in the way a11y-dialog should be use. Mainly, the [expected HTML](./usage.markup.md) is quite different (for the better), which also has an impact of the styles. The JavaScript API remains untouched.

Summary:

- No more support for the `<dialog>` HTML element
- No more usage of the `open` HTML attribute
- Different expected markup
- More flexible position in the DOM

## No more `<dialog>`

The support for the native `<dialog>` HTML element has been discontinued. The rational behind this choice is explained more in detail in the page [about the `<dialog>` element](./further_reading.dialog_element.md).

Before migrating to v7, it is recommended you update your usage to no longer use the `<dialog>` element as this will make the actual migration easier. To do so, replace any usage of the `<dialog>` element with a `<div role="dialog">`.

```diff
- <dialog>
+ <div role="dialog">
```

The styles will also need to be updated, as you will no longer benefit from the native display handling from the `<dialog>` element. Refer to the [styling section](./usage.styling.md) and the [demo](https://codesandbox.io/s/a11y-dialog-v7-pnwqu) for a set of styles to get you started.

### No more `open` attribute

Because the support for the `<dialog>` element is being discontinued, the `open` HTML attribute is no longer applied to the dialog. It is also not read to initialize the dialog in the right state, so **it is no longer possible to start with a dialog open by default** (which was a bad practice anyway).

## New markup

The main difference between v6 and v7 is that a lot of the logic moved onto the container instead of the dialog itself.

- The `aria-labelledby` attribute move from the former dialog element (or its `<div>` equivalent) to the container.
- If wanting an [alert dialog](./advanced.alert_dialog.md), the `role="alertdialog"` attribute should be applied to the container.
- The backdrop no longers needs the `tabindex="-1"` attribute.
- The dialog element itself no longer exists. Its inner `<div>` with the `role="document"` are the new dialog. This is what should be styled as such.

```diff
<div
  id="your-dialog-id"
  aria-hidden="true"
+ aria-labelledby="your-dialog-title-id"
  >
  <div
    data-a11y-dialog-hide
-   tabindex="-1"
  ></div>
- <div role="dialog" aria-labelledby="your-dialog-title-id">
    <div role="document">
      <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
        &times;
      </button>
      <h1 id="your-dialog-title-id">Your dialog title</h1>
      <!-- Your content here -->
    </div>
- </div>
</div>
```

If you are not using JavaScript to instantiate your dialog and are relying on the `data-a11y-dialog` attribute for [automatic instantiation on script load](./usage.instantiation.md), its value is now the unique name for the dialog, just like an `id`.

```diff
<div
- id="your-dialog-id"
- data-a11y-dialog="#root"
+ data-a11y-dialog="your-dialog-id"
  aria-hidden="true"
  >
```

## Dialog position

Up to version 6, the dialog container needed to be somewhat close to the root of the document, fully separated from the main content container, so these two can have their `aria-hidden` attribute toggled on and off as the dialog is being interacted with. This is no longer the case in v7, as the `aria-modal="true"` on the dialog attribute replaces the use of `aria-hidden="true"` on the main content container.

In turns, this means the dialog container can be rendered pretty much anywhere provided it never lives within an element with the `aria-hidden="true"` attribute. It can be deeply nested within the DOM (although not recommended as it could increase risks of something going wrong), and things would work all the same.
