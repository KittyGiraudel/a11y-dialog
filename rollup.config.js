import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

const babelCfg = {
  babelHelpers: 'bundled',
  assumptions: {
    enumerableModuleMeta: true,
    mutableTemplateObject: true,
    noClassCalls: true,
    noDocumentAll: true,
  },
  extensions: ['.ts'],
  include: ['src/**/*'],
  presets: [['@babel/preset-env', { targets: 'ie 11' }]],
}

const commonPlugins = [
  nodeResolve(),
  typescript({ tsconfig: './tsconfig.json' }),
]

const esmPlugins = commonPlugins

const umdPlugins = [...commonPlugins, babel(babelCfg)]

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
    plugins: umdPlugins,
    output: [
      {
        ...umdCfg,
        file: 'dist/a11y-dialog.js',
      },
      {
        ...umdCfg,
        file: 'cypress/fixtures/a11y-dialog.js',
      },
      {
        ...umdCfg,
        file: 'dist/a11y-dialog.min.js',
        plugins: [minify],
      },
    ],
  },
  {
    input: 'src/a11y-dialog.ts',
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
