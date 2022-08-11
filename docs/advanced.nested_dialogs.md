---
title: Nested dialogs
slug: /advanced/nested-dialogs
---

Nesting dialogs is a [questionable design pattern](https://ux.stackexchange.com/questions/52042/is-it-acceptable-to-open-a-modal-popup-on-top-of-another-modal-popup) that is not referenced anywhere in the [HTML 5.2 Dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). Therefore it is actively discouraged in favour of clearer interface design. That being said, it is supported by the library.

There is an example in the [cypress/fixtures](https://github.com/KittyGiraudel/a11y-dialog/blob/main/cypress/fixtures/nested-dialogs.html) directory of the repository, as well as an associated test in [cypress/integration](https://github.com/KittyGiraudel/a11y-dialog/blob/main/cypress/integration/nestedDialogs.js). The original feature request by Renato de Leão remains in [issue #80](https://github.com/KittyGiraudel/a11y-dialog/issues/80#issuecomment-377691629).

As outlined in the fixture file, it is important that the nested dialogs are actually nested in the HTML as well, otherwise this won’t work with VoiceOver on Safari. That’s because anything outside of an `aria-modal="true"` container is considered “inert”, so nested dialogs need to live within one another like Russian dolls.

Pressing <kbd>ESC</kbd> or clicking the backdrop will only close the top-most dialog, while the other remain untouched. It essentially makes it possible to stack dialogs on top of each other, then closing them one at a time.
