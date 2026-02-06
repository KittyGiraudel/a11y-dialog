const A11yDialog = require('a11y-dialog')
const assert = require('node:assert')

assert.ok(A11yDialog, 'a11y-dialog can be used via require')
assert.strictEqual(
  typeof A11yDialog,
  'function',
  'a11y-dialog CommonJS export is a constructor/function'
)
assert.strictEqual(
  typeof A11yDialog.prototype.show,
  'function',
  'a11y-dialog instances expose a show method'
)
