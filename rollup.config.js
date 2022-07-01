import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

const babelCfg = {
  babelHelpers: 'bundled',
  assumptions: {
    enumerableModuleMeta: true,
    mutableTemplateObject: true,
    noClassCalls: true,
    noDocumentAll: true,
  },
  presets: [['@babel/preset-env', { targets: 'ie 11' }]],
}

const esmPlugins = [nodeResolve(), commonjs({ include: 'node_modules/**' })]

const umdPlugins = [...esmPlugins, babel(babelCfg)]

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
    input: 'src/a11y-dialog.js',
    plugins: umdPlugins,
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
    input: 'src/a11y-dialog.js',
    plugins: esmPlugins,
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
