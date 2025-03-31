import { createRequire } from 'node:module'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const getPlugins = (outDir) => [
  nodeResolve(),
  typescript({ tsconfig: './tsconfig.json', compilerOptions: { outDir } })
]

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
    input: 'src/index.ts',
    plugins: getPlugins('dist'),
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
    input: 'src/index.ts',
    plugins: getPlugins('cypress/fixtures'),
    // Library output for the Cypress fixtures to import
    output: { file: 'cypress/fixtures/a11y-dialog.js', ...umdCfg },
  },
  {
    input: 'src/dom-utils.ts',
    plugins: getPlugins('cypress/fixtures'),
    // Library utilities for the Cypress tests to consume
    output: { file: 'cypress/fixtures/dom-utils.js' },
  },
]
