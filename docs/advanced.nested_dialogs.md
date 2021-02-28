---
id: advanced.nested_dialogs
title: Nested dialogs
sidebar_label: Nested dialogs
slug: /advanced/nested-dialogs
---

Nesting dialogs is a [questionable design pattern](https://ux.stackexchange.com/questions/52042/is-it-acceptable-to-open-a-modal-popup-on-top-of-another-modal-popup) that is not referenced anywhere in the [HTML 5.2 Dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). Therefore it is actively discouraged in favour of clearer interface design.

That being said, it is supported by the library, under the following conditions:

- Dialogs should live next to each other in the DOM.
- The `targets` argument of the constructor or value of the `data-a11y-dialog` attribute of every dialog should _not_ include the other dialogs, only the main content container. For instance:

```html
<div id="main">
  <!-- The main content container -->
</div>
<div id="dialog-1" data-a11y-dialog="#main">
  <!-- Dialog 1 content + a button to open dialog 2 -->
</div>
<div id="dialog-2" data-a11y-dialog="#main">
  <!-- Dialog 2 content + a button to open dialog 3 -->
</div>
<div id="dialog-3" data-a11y-dialog="#main">
  <!-- Dialog 3 content -->
</div>
```

Pressing <kbd>ESC</kbd> or clicking the backdrop will only close the top-most dialog, while the other remain untouched. It essentially makes it possible to stack dialogs on top of each other, then closing them one at a time.

There is an example in the [example/tests](https://github.com/HugoGiraudel/a11y-dialog/blob/main/fixture/nested-dialogs.html) directory of the repository, as well as an associated test in [cypress/integration](https://github.com/HugoGiraudel/a11y-dialog/blob/main/cypress/integration/nestedDialogs.html). The original feature request by Renato de Leão remains in [issue #80](https://github.com/HugoGiraudel/a11y-dialog/issues/80#issuecomment-377691629).
