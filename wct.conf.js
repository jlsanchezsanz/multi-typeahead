module.exports = {
  verbose: true,
  simpleOutput: true,
  plugins: {
    local: {
      browsers: ['chrome', 'firefox', 'safari']
    },
    istanbul: {
      dir: './coverage',
      reporters: ['text-summary', 'lcov'],
      include: [
        '**/*.js'
      ],
      exclude: [
        '/!(multi-typeahead)/**/*.js'
      ],
      thresholds: {
        global: {
          statements: 80
        }
      }
    }
  }
}