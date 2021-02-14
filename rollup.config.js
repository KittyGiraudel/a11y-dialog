import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default {
  input: 'a11y-dialog.js',
  output: [
    {
      file: 'example/a11y-dialog.js',
      format: 'umd',
      name: 'A11yDialog',
      exports: 'default',
    },
    {
      file: 'a11y-dialog.min.js',
      format: 'umd',
      name: 'A11yDialog',
      exports: 'default',
      plugins: [terser()],
      banner: () => `/*! a11y-dialog ${pkg.version} — © Edenspiekermann */`,
    },
  ],
}
