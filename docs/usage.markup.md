---
title: Markup
slug: /usage/markup
---

Here is the basic markup, which can be enhanced. Pay extra attention to the comments.

```html
<!-- 1. The dialog container -->
<div
  id="your-dialog-id"
  aria-labelledby="your-dialog-title-id"
  aria-hidden="true"
>
  <!-- 2. The dialog overlay -->
  <div data-a11y-dialog-hide></div>
  <!-- 3. The actual dialog -->
  <div role="document">
    <!-- 4. The close button -->
    <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
      &times;
    </button>
    <!-- 5. The dialog title -->
    <h1 id="your-dialog-title-id">Your dialog title</h1>
    <!-- 6. Dialog content -->
  </div>
</div>
```

1. The dialog container.

   - It is not the actual dialog window, just the container with which the script interacts.
   - It must have a unique name as `data-a11y-dialog` for [automatic instantion through HTML](usage.instantiation.md), or as `id` for JavaScript instantiation.
   - It might need a class for you to be able to style it.
   - It should have an initial `aria-hidden="true"` attribute to avoid a “flash of unhidden dialog” on page load.
   - It may have the `alertdialog` role to make it behave like an [alert dialog](advanced.alert_dialog.md).
   - It doesn’t have to have the `aria-labelledby` attribute however this is recommended. It should match the `id` of the dialog title (which can be still hidden if desired so).

2. The dialog overlay.

   - It doesn’t have to have the `data-a11y-dialog-hide` attribute, however this is recommended. It hides the dialog when clicking outside of it.
   - It should not have the `data-a11y-dialog-hide` attribute if the dialog is an [alert dialog](advanced.alert_dialog.md).

3. The actual dialog.

   - It should be styled as a dialog (fixed on top of the page).
   - It should have the `role="document"` attribute to improve support in NVDA.
   - The script does not interact with it whatsoever.

4. The dialog close button.

   - It does have to have the `type="button"` attribute.
   - It does have to have the `data-a11y-dialog-hide` attribute.
   - It does have to have an `aria-label` attribute (or otherwise accessible name) if you use an icon as content.

5. The dialog title.

   - It should have a different content than “Dialog Title”.
   - It can have a different id than `your-dialog-title-id`.

6. The dialog content.

   - This is where your dialog content lives.
