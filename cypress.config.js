import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:5000',
  },
  env: {
    'cypress-fiddle': {
      scripts: ['/shadow-dom-fixture.js'],
      stylesheets: ['/styles.css'],
      style: `body { max-width: 600px; margin: 0 auto; }`,
    },
  },
})
