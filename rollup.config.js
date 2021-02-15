import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default {
  input: 'a11y-dialog.js',
  output: [
    // Main file
    {
      file: 'dist/a11y-dialog.js',
      format: 'umd',
      name: 'A11yDialog',
      exports: 'default',
    },
    // Minified version
    {
      file: 'dist/a11y-dialog.min.js',
      format: 'umd',
      name: 'A11yDialog',
      exports: 'default',
      plugins: [terser()],
      banner: () => `/*! a11y-dialog ${pkg.version} — © Edenspiekermann */`,
    },
    // Copy of the main file for example and tests
    {
      file: 'example/a11y-dialog.js',
      format: 'umd',
      name: 'A11yDialog',
      exports: 'default',
    },
    // ESM version for <script type="module"> support
    {
      file: 'dist/a11y-dialog.esm.js',
      format: 'es',
    },
    // Minified ESM version
    {
      file: 'dist/a11y-dialog.esm.min.js',
      format: 'es',
      plugins: [terser()],
      banner: () => `/*! a11y-dialog ${pkg.version} — © Edenspiekermann */`,
    },
  ],
}
