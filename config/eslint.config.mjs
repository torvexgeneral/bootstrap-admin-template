// Import and re-export the configuration from config/eslint.config.mjs
import js from '@eslint/js'

export default [
  {
    ignores: [
      '**/node_modules/',
      '.astro/**/*',
      '.cache/**/*',
      '.git/',
      'dist/**/*',        // ignore all contents in dist directory
      '!dist/**/*/',      // unignore subdirectories for traversal
      'docs/**/*',
      'docs_html/**/*',
      '**/*.min.js',
      '**/plugins/**/*',
      '.temp/**/*',
      '**/env.d.ts'
    ]
  },

  // Base JS config
  js.configs.recommended,

  // Browser environment and globals
  {
    languageOptions: {
      // Add browser globals to fix the 'no-undef' errors for document, window, etc.
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        bootstrap: 'readonly',
        DataTable: 'readonly',
        monaco: 'readonly',
        confirm: 'readonly',
        alert: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        performance: 'readonly',
        self: 'readonly',
        define: 'readonly'
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2],
      'object-curly-spacing': ['error', 'always'],
      'no-console': 'off',
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'no-redeclare': 'warn',
      'no-useless-escape': 'warn',
      'no-empty': 'warn'
    }
  },

  // Config specific overrides
  {
    files: ['./config/**'],
    rules: {
      'no-console': 'off'
    }
  }
]
