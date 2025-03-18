/**
 * Handles JavaScript bundling, optimization and minification
 * @module js
 */

import { fileURLToPath } from "url"
import { runCommand, log } from "./utils.mjs"
import esbuild from "esbuild"
import fs from "fs/promises"
import path from "path"

// Get the absolute path to the project root
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Builds JavaScript files
 * @param {Object} [options] - Build options
 * @param {boolean} [options.isDev=false] - Whether to build for development
 * @param {boolean} [options.skipMinification=false] - Whether to skip minification
 * @param {boolean} [options.verbose=false] - Whether to log verbose output
 * @returns {Promise<void>}
 * @throws {Error} If build fails
 */
export async function buildJs(options = {}) {
  // Ensure options object is properly initialized with defaults
  const opts = {
    isDev: false,
    skipMinification: false,
    verbose: false,
    ...options
  }

  try {
    log("JS build process started...", "info", "JS")

    // Ensure the config file exists
    const configPath = path.join(projectRoot, 'config/rollup.config.mjs')
    try {
      await fs.access(configPath)
    } catch {
      throw new Error(`Rollup config file not found: ${configPath}`)
    }

    // Bundle with Rollup
    log("Bundling JavaScript with Rollup...", "info", "JS")
    await runCommand("rollup", ["--config", configPath, "--sourcemap"])
    log("JavaScript bundling completed", "success", "JS")

    // Skip minification in dev mode or if explicitly skipped
    if (!opts.isDev && !opts.skipMinification) {
      log("Minifying JavaScript...", "info", "JS")

      // Ensure the output directory exists
      const distJsDir = path.join(projectRoot, 'dist/js')
      await fs.mkdir(distJsDir, { recursive: true })

      // Check if the main.js file exists
      const mainJsPath = path.join(distJsDir, 'main.js')
      try {
        await fs.access(mainJsPath)
      } catch {
        throw new Error(`Main JS file not found: ${mainJsPath}`)
      }

      // Minify with esbuild
      await esbuild.build({
        entryPoints: [mainJsPath],
        outfile: path.join(distJsDir, 'main.min.js'),
        sourcemap: true,
        target: ["es2015"],
        format: 'esm',
        minify: true,
        logLevel: opts.verbose ? "info" : "error"
      })

      log("JavaScript minification completed", "success", "JS")
    } else if (opts.verbose) {
      log("Skipping JavaScript minification", "info", "JS")
    }

    log(`JS ${opts.isDev ? 'development' : 'production'} build completed`, "success", "JS")
  } catch (error) {
    log(`JavaScript build error: ${error.message}`, "error", "JS")
    if (error.stack && opts.verbose) {
      log(`Stack trace: ${error.stack}`, "error", "JS")
    }
    throw error
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isDev = process.argv.includes('--dev')
  const skipMinification = process.argv.includes('--skip-minification')
  const verbose = process.argv.includes('--verbose')

  buildJs({
    isDev,
    skipMinification,
    verbose
  }).catch((error) => {
    log(`Fatal JavaScript build error: ${error.message}`, "error", "JS")
    process.exit(1)
  })
}
