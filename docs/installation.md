---
title: Installation
slug: /installation
---

## Using a bundler (recommended)

If you’re using a bundler (such as Webpack or Rollup), you can install `a11y-dialog` through npm or yarn like any other dependency:

```sh
npm install a11y-dialog
```

```sh
yarn add a11y-dialog
```

Then you can import the library in your JavaScript codebase to access the `A11yDialog` class and instantiate your dialogs as you intend to.

```js
import A11yDialog from 'a11y-dialog'

const container = document.querySelector('#my-dialog-container')
const dialog = new A11yDialog(container)
```

If you rely on the `data-a11y-dialog` attribute to automate the dialog [instantiation](usage.instantiation.md) in order not to write JavaScript at all, you could simplify the import as such:

```js
import 'a11y-dialog'
```

## Using a CDN

If you prefer loading `a11y-dialog` from a CDN such as jsdelivr or unpkg, you can do so by adding this script tag in your HTML. It will expose the `A11yDialog` global variable.

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/a11y-dialog@7/dist/a11y-dialog.min.js"
></script>
```

If you intend to use ES modules, you can use the ESM version of script (from v6.0.0 onwards only):

```html
<script type="module">
  import A11yDialog from 'https://cdn.jsdelivr.net/npm/a11y-dialog@7/dist/a11y-dialog.esm.min.js'

  const container = document.querySelector('#my-dialog-container')
  const dialog = new A11yDialog(container)
</script>
```
