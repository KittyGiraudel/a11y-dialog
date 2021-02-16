import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const umd = { format: 'umd', name: 'A11yDialog', exports: 'default' }
const es = { format: 'es' }
const minify = {
  plugins: [terser()],
  banner: () => `/*! a11y-dialog ${pkg.version} — © Kitty Giraudel */`,
}

export default {
  input: 'a11y-dialog.js',
  output: [
    // Main files
    { file: 'dist/a11y-dialog.js', ...umd },
    { file: 'dist/a11y-dialog.esm.js', ...es },
    // Minified versions
    { file: 'dist/a11y-dialog.min.js', ...umd, ...minify },
    { file: 'dist/a11y-dialog.esm.min.js', ...es, ...minify },
    // Copy of the main file for example and tests
    { file: 'example/a11y-dialog.js', ...umd },
  ],
  plugins: [nodeResolve(), commonjs({ include: 'node_modules/**' })],
}
