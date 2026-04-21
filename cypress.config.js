import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:5000',
    experimentalRunAllSpecs: true,
  },
  env: {
    // Note that this will likely start to fail in a future version of Cypress.
    // cypress-fiddle relies on `Cypress.env()` to read that configuration:
    // https://github.com/cypress-io/cypress-fiddle/blob/f95f0a96b52e2047847a12f4a79c0d1e947a76d6/src/index.js#L20
    //
    // Cypress emits the following warning:
    //   Warning: The allowCypressEnv configuration option is enabled. This
    //   allows any browser code to read values from Cypress.env(). This is
    //   insecure and will be removed in a future major version.
    //   1. Replace Cypress.env() calls with cy.env() (for sensitive values) or
    //      Cypress.expose() (for public configuration)
    //   2. Set allowCypressEnv: false in your Cypress configuration to disable
    //      Cypress.env()
    'cypress-fiddle': {
      scripts: ['/shadow-dom-fixture.js'],
      stylesheets: ['/styles.css'],
      style: 'body { max-width: 600px; margin: 0 auto; }',
    },
  },
})
