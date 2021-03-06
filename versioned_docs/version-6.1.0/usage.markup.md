---
title: Markup
slug: /usage/markup
---

Here is the basic markup, which can be enhanced. Pay extra attention to the comments.

```html
<!-- 1. The main content container -->
<div id="main"></div>
<!-- 2. The dialog container -->
<div id="your-dialog-id" aria-hidden="true">
  <!-- 3. The dialog overlay -->
  <div data-a11y-dialog-hide></div>
  <!-- 4. The actual dialog -->
  <div role="dialog" aria-labelledby="your-dialog-title-id">
    <!-- 5. The inner document -->
    <div role="document">
      <!-- 6. The close button -->
      <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
        &times;
      </button>
      <!-- 7. The dialog title -->
      <h1 id="your-dialog-title-id">Your dialog title</h1>
      <!-- 8. Dialog content -->
    </div>
  </div>
</div>
```

1. The main container is where your site/app content lives.

   - It can have a different id than `main`, however you will have to pass it as a second argument to the A11yDialog instance. See [instantiation instructions](usage.instantiation.md) further down.

2. The dialog container.

   - It is not the actual dialog window, just the container with which the script interacts.
   - It can have a different id than `your-dialog-id`, but it needs an `id` anyway.
   - It might need a class for you to be able to style it.
   - It should have an initial `aria-hidden="true"` to avoid a “flash of unhidden dialog” on page load.
   - It can have the `data-a11y-dialog` attribute (with the “targets” as value, see [Instantiation](usage.instantiation.md)) to automatically instantiate the dialog without JavaScript.

3. The dialog overlay.

   - It doesn’t have to have the `data-a11y-dialog-hide` attribute, however this is recommended. It hides the dialog when clicking outside of it.
   - It should not have the `data-a11y-dialog-hide` if the dialog is an [alert dialog](advanced.alert_dialog.md).

4. The actual dialog.

   - It may have the `alertdialog` role to make it an [alert dialog](advanced.alert_dialog.md).
   - It is recommend to have the `aria-labelledby` attribute matching the `id` of the dialog title (which can itself be hidden if desired).
   - It can be a `<dialog>` element, but [it is not recommended](advanced.dialog_element.md).

5. The inner document.

   - It doesn’t have to exist but improves support in NVDA.
   - It doesn’t have to exist when using `<dialog>` because is implied.

6. The dialog close button.

   - It does have to have the `type="button"` attribute.
   - It does have to have the `data-a11y-dialog-hide` attribute.
   - It does have to have an `aria-label` attribute (or otherwise accessible name) if you use an icon as content.

7. The dialog title.

   - It should have a different content than “Dialog Title”.
   - It can have a different id than `your-dialog-title-id`.

8. The dialog content.

   - This is where your dialog content lives.
