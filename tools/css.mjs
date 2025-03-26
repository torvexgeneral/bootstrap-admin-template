/**
 * Handles CSS processing: SASS compilation, prefixing, RTL generation, and minification
 * @module css
 */

import { fileURLToPath } from 'url'
import { log } from './utils.mjs'
import { transform } from 'lightningcss'
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import * as sass from 'sass-embedded'
import { URL } from 'url'
import { readFileSync } from 'fs'

// Get the absolute path to the project root
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Read package.json from root directory
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

const year = new Date().getFullYear()
const banner = `/*!
 * Astero Admin v${pkg.version} (${pkg.homepage})
 * Copyright 2025-${year} ${pkg.author}
 * Licensed under MIT (https://github.com/asterodigital/bootstrap-admin-template/blob/master/LICENSE)
 */`

/**
 * Compiles SASS to CSS
 * @param {Object} [options] - Compilation options
 * @param {boolean} [options.verbose=false] - Whether to log verbose output
 * @param {string} [options.entryFile='src/scss/style.scss'] - Entry SASS file
 * @returns {Promise<void>}
 * @throws {Error} If compilation fails
 */
async function compileSass(options = {}) {
  // Ensure options object is properly initialized with defaults
  const opts = {
    verbose: false,
    entryFile: 'src/scss/style.scss',
    ...options
  }

  log('Compiling SASS...', 'info', 'CSS')

  try {
    // Ensure the entry file exists and is properly resolved
    if (!opts.entryFile) {
      throw new Error('Entry file path is undefined or empty')
    }

    const entryFilePath = path.resolve(projectRoot, opts.entryFile)

    try {
      await fs.access(entryFilePath)
    } catch {
      throw new Error(`SASS entry file not found: ${entryFilePath}`)
    }

    // Compile SASS
    const result = await sass.compileAsync(entryFilePath, {
      style: 'expanded',
      sourceMap: true,
      sourceMapIncludeSources: true,
      loadPaths: [path.join(projectRoot, 'src/scss')],
      // Use silent logger to suppress all warnings
      logger: sass.Logger.silent,
      // Additional options to suppress specific warnings
      quietDeps: true,
      warn: false
    })

    log('SASS compilation successful', 'success', 'CSS')

    // Ensure output directory exists
    const cssDir = path.join(projectRoot, 'dist/css')
    await fs.mkdir(cssDir, { recursive: true })

    // Ensure source map has correct source path
    if (result.sourceMap) {
      result.sourceMap.sources = result.sourceMap.sources.map((source) =>
        source.startsWith('/') ? source.substring(1) : source
      )
    }

    // Add sourcemap URL to CSS file
    const cssWithSourceMap = banner + '\n' + result.css + '\n/*# sourceMappingURL=style.css.map */'
    const cssOutputPath = path.join(cssDir, 'style.css')
    await fs.writeFile(cssOutputPath, cssWithSourceMap)

    if (result.sourceMap) {
      const mapOutputPath = path.join(cssDir, 'style.css.map')
      await fs.writeFile(mapOutputPath, JSON.stringify(result.sourceMap, null, 2))
    }

    if (opts.verbose) {
      log(`CSS written to ${path.relative(projectRoot, cssOutputPath)}`, 'info', 'CSS')
    }

    log('CSS files written to disk', 'success', 'CSS')
  } catch (error) {
    log(`SASS compilation error: ${error.message}`, 'error', 'CSS')
    throw error
  }
}

/**
 * Minifies a CSS file
 * @param {string} inputPath - Path to the CSS file to minify
 * @param {Object} [options] - Minification options
 * @param {boolean} [options.verbose=false] - Whether to log verbose output
 * @returns {Promise<void>}
 * @throws {Error} If minification fails
 */
async function minifyCSS(inputPath, options) {
  const fileName = path.basename(inputPath)
  log(`Minifying ${fileName}...`, 'info', 'CSS')

  try {
    // Check if input file exists
    try {
      await fs.access(inputPath)
    } catch {
      throw new Error(`CSS file not found: ${inputPath}`)
    }

    const code = await fs.readFile(inputPath, 'utf8')

    // Remove existing banner if present
    const codeWithoutBanner = code.replace(/\/\*![\s\S]*?\*\/\n?/, '')

    const { code: minified, map } = transform({
      filename: fileName,
      code: Buffer.from(codeWithoutBanner),
      minify: true,
      sourceMap: true
    })

    const outputPath = inputPath.replace('.css', '.min.css')
    await fs.writeFile(outputPath, banner + '\n' + minified)

    if (map) {
      await fs.writeFile(`${outputPath}.map`, map)
    }

    if (options && options.verbose) {
      log(`Minification details for ${fileName}: ${minified.length} bytes`, 'info', 'CSS')
    }

    log(`Minified ${fileName} -> ${path.basename(outputPath)}`, 'success', 'CSS')
  } catch (error) {
    log(`Minification error for ${inputPath}: ${error.message}`, 'error', 'CSS')
    throw error
  }
}

/**
 * Minifies all CSS files in the dist/css directory
 * @param {Object} [options] - Minification options
 * @param {boolean} [options.verbose=false] - Whether to log verbose output
 * @returns {Promise<void>}
 */
async function minifyAllCSS(options = { verbose: false }) {
  log('Starting CSS minification...', 'info', 'CSS')

  try {
    const cssFiles = await glob('dist/css/*.css')
    const filesToMinify = cssFiles.filter((file) => !file.includes('.min.css'))

    if (filesToMinify.length === 0) {
      log('No CSS files found to minify', 'warning', 'CSS')
      return
    }

    log(`Found ${filesToMinify.length} CSS files to minify`, 'info', 'CSS')

    // Process files sequentially to avoid overwhelming the system
    for (const file of filesToMinify) {
      try {
        await minifyCSS(file, options)
      } catch (error) {
        // Log error but continue with other files
        log(`Error minifying ${file}: ${error.message}`, 'error', 'CSS')
      }
    }

    log('CSS minification completed', 'success', 'CSS')
  } catch (error) {
    log(`CSS minification error: ${error.message}`, 'error', 'CSS')
    // Don't throw as we want to continue with other steps
  }
}

/**
 * Processes CSS files with PostCSS (adds vendor prefixes)
 * @param {string[]} files - Array of CSS file paths to process
 * @param {Object} [options] - Processing options
 * @param {boolean} [options.verbose=false] - Whether to log verbose output
 * @returns {Promise<void>}
 */
async function processWithPostcss(files, options = { verbose: false }) {
  log('Processing CSS with PostCSS...', 'info', 'CSS')

  try {
    if (files.length === 0) {
      log('No CSS files to process with PostCSS', 'warning', 'CSS')
      return
    }

    const postcss = await import('postcss')
    const autoprefixer = await import('autoprefixer')

    // Get the configuration
    const configPath = path.join(projectRoot, 'config/postcss.config.mjs')
    try {
      await fs.access(configPath)
    } catch {
      throw new Error(`PostCSS config file not found: ${configPath}`)
    }

    // Convert to file URL for ESM import compatibility (especially on Windows)
    const configUrl = path.isAbsolute(configPath)
      ? new URL(
          `file://${configPath.replace(/\\/g, '/').replace(/^([a-zA-Z]):/, (_, drive) => `/${drive}:`)}`
        )
      : new URL(configPath, import.meta.url)

    const postcssConfig = await import(configUrl)
    const config = postcssConfig.default({ env: 'production' })

    // Create array of plugins from config
    const plugins = []
    if (config.plugins) {
      if (config.plugins.autoprefixer) {
        plugins.push(autoprefixer.default(config.plugins.autoprefixer))
      }
    }

    if (plugins.length === 0) {
      log('No PostCSS plugins configured, skipping', 'warning', 'CSS')
      return
    }

    const processor = postcss.default(plugins)

    for (const file of files) {
      const fileName = path.basename(file)
      log(`Adding vendor prefixes to ${fileName}...`, 'info', 'CSS')

      try {
        const css = await fs.readFile(file, 'utf8')
        const result = await processor.process(css, {
          from: file,
          to: file,
          map: config.map || { inline: false }
        })

        await fs.writeFile(file, result.css)
        if (result.map) {
          await fs.writeFile(`${file}.map`, result.map.toString())
        }

        if (options.verbose) {
          log(`Processed ${fileName} with PostCSS`, 'success', 'CSS')
        }
      } catch (error) {
        log(`Error processing ${fileName} with PostCSS: ${error.message}`, 'error', 'CSS')
        // Continue with other files
      }
    }

    log('PostCSS processing completed', 'success', 'CSS')
  } catch (error) {
    log(`PostCSS processing error: ${error.message}`, 'error', 'CSS')
    // Don't throw as we want to continue with other steps
  }
}

/**
 * Generates RTL (Right-to-Left) versions of CSS files
 * @param {Object} [options] - RTL generation options
 * @param {boolean} [options.verbose=false] - Whether to log verbose output
 * @returns {Promise<void>}
 * @throws {Error} If RTL generation fails
 */
async function generateRtl(options = { verbose: false }) {
  log('Generating RTL CSS...', 'info', 'CSS')

  try {
    // Import rtlcss
    const rtlcss = (await import('rtlcss')).default

    // Find all CSS files that don't already have .rtl or .min in their names
    const cssFiles = await glob('dist/css/*.css')
    const filesToProcess = cssFiles.filter(
      (file) => !file.includes('.rtl.css') && !file.includes('.min.css')
    )

    if (filesToProcess.length === 0) {
      log('No CSS files found for RTL conversion', 'warning', 'CSS')
      return
    }

    log(`Found ${filesToProcess.length} CSS files for RTL conversion`, 'info', 'CSS')

    // Process each file
    for (const file of filesToProcess) {
      const fileName = path.basename(file)
      const rtlFileName = fileName.replace('.css', '.rtl.css')
      const rtlOutputPath = path.join(path.dirname(file), rtlFileName)

      log(`Converting ${fileName} to RTL...`, 'info', 'CSS')

      try {
        // Read the CSS file
        const css = await fs.readFile(file, 'utf8')

        // Convert to RTL
        const rtlCss = rtlcss.process(css)

        // Write the RTL CSS file with banner
        await fs.writeFile(rtlOutputPath, banner + '\n' + rtlCss)

        if (options.verbose) {
          log(`RTL conversion details for ${fileName}: ${rtlCss.length} bytes`, 'info', 'CSS')
        }

        log(`Generated RTL CSS: ${rtlFileName}`, 'success', 'CSS')
      } catch (error) {
        log(`RTL conversion error for ${fileName}: ${error.message}`, 'error', 'CSS')
        // Continue with other files
      }
    }

    log('RTL CSS generation completed', 'success', 'CSS')
  } catch (error) {
    log(`RTL CSS generation error: ${error.message}`, 'error', 'CSS')
    // Don't throw as we want to continue with other steps
  }
}

/**
 * Main CSS build function
 * @param {Object} [options] - Build options
 * @param {boolean} [options.isDev=false] - Whether to build for development
 * @param {boolean} [options.skipMinification=false] - Whether to skip minification
 * @param {boolean} [options.skipPrefixing=false] - Whether to skip vendor prefixing
 * @param {boolean} [options.skipRtl=false] - Whether to skip RTL generation
 * @param {boolean} [options.verbose=false] - Whether to log verbose output
 * @returns {Promise<void>}
 * @throws {Error} If build fails
 */
export async function buildCss(options = {}) {
  // Ensure options object is properly initialized with defaults
  const opts = {
    isDev: false,
    skipMinification: false,
    skipPrefixing: false,
    skipRtl: false,
    verbose: false,
    ...options
  }

  try {
    log(`Starting CSS ${opts.isDev ? 'development' : 'production'} build...`, 'info', 'CSS')

    // Always compile SASS
    await compileSass({ verbose: opts.verbose })

    // Generate RTL if not skipped (do this in both dev and production)
    if (!opts.skipRtl) {
      await generateRtl({ verbose: opts.verbose })
    } else if (opts.verbose) {
      log('Skipping RTL generation', 'info', 'CSS')
    }

    // Skip optimization steps in dev mode
    if (!opts.isDev) {
      // Add vendor prefixes if not skipped
      if (!opts.skipPrefixing) {
        log('Adding vendor prefixes...', 'info', 'CSS')
        const cssFiles = await glob('dist/css/*.css')
        const filesToProcess = cssFiles.filter(
          (file) => !file.includes('.rtl.css') && !file.includes('.min.css')
        )
        await processWithPostcss(filesToProcess, { verbose: opts.verbose })
      } else if (opts.verbose) {
        log('Skipping vendor prefixing', 'info', 'CSS')
      }

      // Minify CSS if not skipped
      if (!opts.skipMinification) {
        log('Minifying CSS...', 'info', 'CSS')
        await minifyAllCSS({ verbose: opts.verbose })
      } else if (opts.verbose) {
        log('Skipping CSS minification', 'info', 'CSS')
      }
    }

    log(`CSS ${opts.isDev ? 'development' : 'production'} build completed`, 'success', 'CSS')
  } catch (error) {
    log(`CSS build error: ${error.message}`, 'error', 'CSS')
    if (error.stack && opts.verbose) {
      log(`Stack trace: ${error.stack}`, 'error', 'CSS')
    }
    throw error
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isDev = process.argv.includes('--dev')
  const skipMinification = process.argv.includes('--skip-minification')
  const skipPrefixing = process.argv.includes('--skip-prefixing')
  const skipRtl = process.argv.includes('--skip-rtl') && !process.argv.includes('--skip-rtl=false')
  const verbose = process.argv.includes('--verbose')

  buildCss({
    isDev,
    skipMinification,
    skipPrefixing,
    skipRtl,
    verbose
  }).catch((error) => {
    log(`Fatal CSS build error: ${error.message}`, 'error', 'CSS')
    process.exit(1)
  })
}
