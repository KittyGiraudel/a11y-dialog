import { createRequire } from 'node:module'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const plugins = [nodeResolve(), typescript({ tsconfig: './tsconfig.json' })]

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
    plugins: plugins,
    output: [
      {
        ...umdCfg,
        file: 'dist/a11y-dialog.js',
      },
      {
        ...umdCfg,
        file: 'dist/a11y-dialog.min.js',
        plugins: [minify],
      },
      {
        ...umdCfg,
        file: 'cypress/fixtures/a11y-dialog.js',
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: plugins,
    output: [
      {
        file: 'dist/a11y-dialog.esm.js',
        format: 'esm',
      },
      {
        file: 'dist/a11y-dialog.esm.min.js',
        format: 'esm',
        plugins: [minify],
      },
    ],
  },
]
