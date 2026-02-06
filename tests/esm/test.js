import assert from 'node:assert'
import A11yDialog from 'a11y-dialog'

assert.ok(A11yDialog, 'a11y-dialog can be used via import')
assert.strictEqual(
  typeof A11yDialog,
  'function',
  'a11y-dialog default export is a constructor/function'
)
assert.strictEqual(
  typeof A11yDialog.prototype.show,
  'function',
  'a11y-dialog instances expose a show method'
)
