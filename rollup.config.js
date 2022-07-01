import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

const babelCfg = {
  assumptions: {
    enumerableModuleMeta: true,
    mutableTemplateObject: true,
    noClassCalls: true,
    noDocumentAll: true,
  },
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'ie 11',
      },
    ],
  ],
}

const umdCfg = {
  format: 'umd',
  name: 'A11yDialog',
  exports: 'default',
}

const commonPlugins = [
  nodeResolve(),
  commonjs({ include: 'node_modules/**' }),
  babel(babelCfg),
]

const minify = terser({
  format: {
    preamble: `/*! a11y-dialog ${pkg.version} — © Kitty Giraudel */`,
  },
})

export default [
  {
    input: 'src/a11y-dialog.js',
    output: [
      {
        file: 'dist/a11y-dialog.js',
        ...umdCfg,
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: 'src/a11y-dialog.js',
    output: [
      {
        file: 'dist/a11y-dialog.min.js',
        ...umdCfg,
      },
    ],
    plugins: [...commonPlugins, minify],
  },
  {
    input: 'src/a11y-dialog.js',
    output: [
      {
        file: 'dist/a11y-dialog.esm.js',
        format: 'esm',
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: 'src/a11y-dialog.js',
    output: [
      {
        file: 'dist/a11y-dialog.esm.min.js',
        format: 'esm',
      },
    ],
    plugins: [...commonPlugins, minify],
  },
  {
    input: 'src/a11y-dialog.js',
    output: [
      {
        file: 'cypress/fixtures/a11y-dialog.js',
        ...umdCfg,
      },
    ],
    plugins: commonPlugins,
  },
]
