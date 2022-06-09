const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:5000',
    excludeSpecPattern: ['**/utils.js'],
  },
})
