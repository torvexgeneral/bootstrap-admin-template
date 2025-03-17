import fs from 'fs-extra'
import path from 'path'
import { log } from '../tools/utils.mjs'

function syncAssets() {
  try {
    const srcDir = './src/assets'
    const distDir = './dist/assets'

    // Ensure dist directory exists
    fs.ensureDirSync(distDir)

    // Get list of files in both directories
    const srcFiles = getAllFiles(srcDir)
    const distFiles = getAllFiles(distDir)

    // Find files that exist in dist but not in src
    const obsoleteFiles = distFiles.filter(distFile => {
      const relativePath = path.relative(distDir, distFile)
      const srcPath = path.join(srcDir, relativePath)
      return !srcFiles.includes(srcPath)
    })

    // Remove obsolete files
    obsoleteFiles.forEach(file => {
      fs.removeSync(file)
      log(`Removed obsolete file: ${file}`)
    })

    // Copy current assets
    fs.copySync(srcDir, distDir)

    // Copy index.html to dist directory. Used for redirecting to dashboard
    if (fs.existsSync('./index.html')) {
      fs.copySync('./index.html', './dist/index.html')
      log('index.html copied to dist directory')
    } else {
      log('index.html not found in root directory', 'warning')
    }

    log('Assets synchronized successfully!')
  } catch (error) {
    log(`Asset sync error: ${error}`, 'error')
    throw error
  }
}

function getAllFiles(dir) {
  const files = []

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        traverse(fullPath)
      } else {
        files.push(fullPath)
      }
    }
  }

  traverse(dir)
  return files
}

syncAssets()
