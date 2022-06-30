import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

const umd = {
  format: 'es',
  name: 'A11yDialog',
  exports: 'default',
  plugins: [
    getBabelOutputPlugin({
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
            modules: ['umd'],
            targets: 'ie 11',
            exclude: ['proposal-dynamic-import', 'transform-modules-commonjs'],
          },
        ],
      ],
    }),
  ],
}
const es = { format: 'es' }
const minify = (plugins = []) => ({
  plugins: [
    ...plugins,
    terser({
      format: {
        preamble: `/*! a11y-dialog ${pkg.version} — © Kitty Giraudel */`,
      },
    }),
  ],
})

export default {
  input: 'src/a11y-dialog.js',
  output: [
    // Main files
    {
      file: 'dist/a11y-dialog.js',
      ...umd,
    },
    { file: 'dist/a11y-dialog.esm.js', ...es },
    // Minified versions
    { file: 'dist/a11y-dialog.min.js', ...umd, ...minify(umd.plugins) },
    { file: 'dist/a11y-dialog.esm.min.js', ...es, ...minify() },
    // Test version
    { file: 'cypress/fixtures/a11y-dialog.js', ...umd },
  ],
  plugins: [nodeResolve(), commonjs({ include: 'node_modules/**' })],
}
