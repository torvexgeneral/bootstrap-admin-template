import { readFileSync } from 'fs'
import { URL } from 'url'

// Read package.json from root directory
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

const year = new Date().getFullYear()
const banner = `/*!
 * Astero Admin v${pkg.version} (${pkg.homepage})
 * Copyright 2025-${year} ${pkg.author}
 * Licensed under MIT (https://github.com/asterodigital/bootstrap-admin-template/blob/master/LICENSE)
 */`

export default {
  input: 'src/js/main.js',
  output: {
    file: 'dist/js/main.js',
    format: 'umd',
    name: 'AsteroTheme',
    banner,
    sourcemap: true,
    amd: {
      id: 'astero-theme'
    }
  }
}
