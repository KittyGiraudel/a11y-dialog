import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

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
    input: 'src/a11y-dialog.ts',
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
    input: 'src/a11y-dialog.ts',
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
