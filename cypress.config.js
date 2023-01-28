import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:5000',
  },
  env: {
    'cypress-fiddle': {
      style: `
        *:not(pre *) { font-family: sans-serif; }
        body { max-width: 600px; margin: 1em auto; }
        h1 { font-size: 150% }
      `,
    },
  },
})
