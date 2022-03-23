---
title: Instantiation
slug: /usage/instantiation
---

By default, any dialog container having the `data-a11y-dialog` attribute (with 1’s, not L’s) will be automatically instantiated. This is so that there is no need for any JavaScript (besides loading the script). The value of the attribute, if given, should be a selector, serving the same purpose as the 2nd attribute of the `A11yDialog` constructor (see below).

```html
<!-- The content of the `data-a11y-dialog` attribute should be
     the selector containing the main website’s or app’s code.
     See HTML boilerplate” for more information. -->
<div
  class="dialog-container"
  id="your-dialog-id"
  aria-hidden="true"
  data-a11y-dialog="#root"
>
  …
</div>
```

If automatic loading is not an option because the expected dialog markup is not present in the DOM on script execution (or the dialog instance is needed to do more complicated things), it can be instantiated through JavaScript.

```js
// Get the dialog container HTML element (with the accessor method you want)
const el = document.getElementById('your-dialog-id')

// Instantiate a new A11yDialog module
const dialog = new A11yDialog(el)
```

As recommended in the [markup usage section](usage.markup.md) of this documentation, the dialog element is supposed to be on the same level as your content container(s). Therefore, the script will toggle the `aria-hidden` attribute of the siblings of the dialog element as a default. You can change this behaviour by passing a `NodeList`, an `Element` or a selector as second argument to the `A11yDialog` constructor:

```js
const container = document.querySelector('#root')
const dialog = new A11yDialog(el, container)
```
