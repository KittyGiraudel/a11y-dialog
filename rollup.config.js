// TypeScript 7 has no compiler API, so `@rollup/plugin-typescript` cannot load.
// `tsc` emits JS + .d.ts into `out/`; Rollup bundles that JS and copies the
// declarations next to the published and Cypress outputs.
import { cpSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const BUILD_DIR = 'out'

const copyDts = dest => ({
  name: 'copy-dts',
  writeBundle() {
    for (const file of ['a11y-dialog.d.ts', 'dom-utils.d.ts', 'index.d.ts']) {
      cpSync(join(BUILD_DIR, file), join(dest, file))
    }
  },
})

const minify = terser({
  format: {
    preamble: `/*! a11y-dialog ${pkg.version} — © Kitty Giraudel */`,
  },
})

const umdCfg = {
  format: 'umd',
  name: 'A11yDialog',
  exports: 'default',
}

export default [
  {
    input: `${BUILD_DIR}/index.js`,
    plugins: [nodeResolve(), copyDts('dist')],
    output: [
      // UMD
      { file: 'dist/a11y-dialog.js', ...umdCfg },
      { file: 'dist/a11y-dialog.min.js', ...umdCfg, plugins: [minify] },
      // ESM
      { file: 'dist/a11y-dialog.esm.js', format: 'esm' },
      { file: 'dist/a11y-dialog.esm.min.js', format: 'esm', plugins: [minify] },
      // CJS
      { file: 'dist/a11y-dialog.cjs', format: 'cjs' },
    ],
  },
  {
    input: `${BUILD_DIR}/index.js`,
    plugins: [nodeResolve(), copyDts('cypress/fixtures')],
    // Library output for the Cypress fixtures to import
    output: { file: 'cypress/fixtures/a11y-dialog.js', ...umdCfg },
  },
  {
    input: `${BUILD_DIR}/dom-utils.js`,
    plugins: [nodeResolve()],
    // Library utilities for the Cypress tests to consume
    output: { file: 'cypress/fixtures/dom-utils.js' },
  },
]
