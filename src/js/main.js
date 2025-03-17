// Import initialization functions for core UI components
import { darkMode } from "./layout/dark-mode.js"
import { initSidebar } from "./layout/sidebar-handler.js"
import { initSidebarMini } from "./layout/sidebar-mini-handler.js"
import { initNavigation } from "./layout/nav-handler.js"
import { initPasswordWrapper } from "./components/password.js"

// Create the theme module
const AsteroTheme = (function () {
  let initialized = false

  function initializeAll() {
    if (initialized) {
      return
    }

    try {
      darkMode()
      initSidebar()
      initSidebarMini()
      initNavigation()
      initPasswordWrapper()
      initialized = true
    } catch (error) {
      console.error("Error during initialization:", error)
    }
  }

  // Public API
  return {
    init: initializeAll,
    isInitialized: () => initialized
  }
})()

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", AsteroTheme.init)
  } else {
    AsteroTheme.init()
  }
}

export default AsteroTheme
