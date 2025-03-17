/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  semi: true,
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: "none",
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ],
  // Files to ignore
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    '.cache/**',
    '.astro/**',
    'src/scss/**',
    '**/*.scss',
    // Skip all JavaScript files
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.mjs',
    '**/*.cjs',
    // Skip everything outside src/html
    'src/assets/**',
    'src/config/**',
    'src/js/**',
    'src/plugins/**',
    'config/**',
    'tools/**',
    'public/**',
    '.github/**'
  ]
}
