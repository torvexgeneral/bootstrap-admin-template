# AsteroAdmin

A responsive open source admin dashboard and control panel built with Bootstrap 5 and Astro.

[![AsteroAdmin Dashboard](https://raw.githubusercontent.com/asterodigital/bootstrap-admin-template/main/.github/images/feature-image.png)](https://astero-admin.asterodigital.com/pages/dashboard)

## Overview

AsteroAdmin is a modern, responsive admin template designed to provide a solid foundation for your administrative interface needs. Built with the latest web technologies and best practices, it offers a clean, intuitive, and highly customizable user experience for building powerful dashboards, admin panels, and back-office applications.

## Key Features

- 🎨 **Modern UI Design** - Built with Bootstrap 5.3 for a clean, professional look
- 📱 **Fully Responsive** - Works perfectly on all devices and screen sizes
- 🌙 **Light/Dark Mode** - Switch between light and dark themes with one click
- 🚀 **Advanced Build System** - Optimized workflow with parallel processing
- 📦 **Modular Architecture** - Well-organized SCSS and JS components
- 🔧 **Highly Customizable** - Easy to adapt to your brand and requirements
- 📊 **Dashboard Components** - Charts, tables, forms, and more
- 🔍 **Performance Optimized** - Fast loading times and smooth interactions
- 🔄 **Live Reload** - Instant preview of changes during development
- 📚 **Comprehensive Documentation** - Detailed guides for all components
- 🔒 **5 Auth Design Systems** - Five ready-made login and signup page designs
- 🌐 **RTL Support** - Works perfectly for right-to-left languages
- 🖌️ **3000+ Icons** - Thousands of icons ready to use in your projects
- 📁 **Simple Folder Structure** - Logically arranged files for quick development
- 🧩 **Various Components** - Extensive collection of UI components
- 📱 **Offcanvas Navbar** - Modern navigation for mobile and desktop

## Demo

Check out the live demo: [AsteroAdmin Demo](https://astero-admin.asterodigital.com/pages/dashboard)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/asterodigital/bootstrap-admin-template.git
cd bootstrap-admin-template
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The development server will start at `http://localhost:1234`

## Build System

AsteroAdmin uses a custom-built, optimized build system that handles:

- SCSS compilation with source maps
- JavaScript bundling and minification
- Asset optimization
- Live reloading
- Production builds with optimizations

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build optimized files for production |
| `npm run css` | Compile SCSS to CSS with vendor prefixes |
| `npm run js` | Bundle and optimize JavaScript files |
| `npm run assets` | Process and optimize static assets |
| `npm run lint` | Run code quality checks |
| `npm run fixlint` | Automatically fix linting issues |
| `npm run format:html` | Format HTML files using Prettier |
| `npm run clean` | Remove build artifacts |
| `npm run watch` | Watch files for changes |
| `npm run serve` | Serve the built files locally |

## Project Structure

```
├── dist/               # Compiled files (generated)
├── src/                # Source files
│   ├── assets/         # Static assets (images, fonts, etc.)
│   ├── html/           # HTML templates and components
│   │   ├── components/ # Reusable UI components
│   │   ├── layouts/    # Page layouts
│   │   ├── pages/      # Astro page templates
│   │   └── utils/      # Utility functions
│   ├── js/             # JavaScript source files
│   │   ├── components/ # JS components
│   │   ├── plugins/    # Third-party plugins
│   │   └── main.js     # Main JavaScript entry point
│   └── scss/           # SCSS stylesheets
│       ├── base/       # Base styles
│       ├── components/ # Component styles
│       ├── core/       # Core styles
│       ├── extra-components/ # Additional components
│       ├── layout/     # Layout styles
│       ├── mixins/     # SCSS mixins
│       ├── pages/      # Page-specific styles
│       ├── variables/  # SCSS variables
│       └── style.scss  # Main SCSS entry point
├── tools/              # Build system scripts
│   ├── assets.mjs      # Asset processing
│   ├── astro.mjs       # Astro build configuration
│   ├── build.mjs       # Main build orchestration
│   ├── clean.mjs       # Cleanup utilities
│   ├── css.mjs         # CSS processing
│   ├── dev.mjs         # Development server
│   ├── fixlint.mjs     # Linting fixes
│   ├── format.mjs      # Code formatting
│   ├── js.mjs          # JavaScript processing
│   ├── lint.mjs        # Code quality checks
│   ├── prettier.mjs    # Prettier configuration
│   ├── serve.mjs       # Local server for testing
│   ├── utils.mjs       # Build utilities
│   └── watch.mjs       # File watching
└── package.json        # Project dependencies and scripts
```

## Customization

### Themes

AsteroAdmin comes with both light and dark themes. You can customize the themes by modifying the variables in `src/scss/variables/`. The dark mode provides a sleek, eye-friendly experience that:

- Is easier on the eyes
- Improves readability
- Minimizes distractions
- Enhances visual appeal

### Components

All UI components are modular and can be found in `src/scss/components/` and `src/scss/extra-components/`. You can easily modify or extend these components to match your requirements.

### Creating New Pages

To create a new page:

1. Create a new `.astro` file in the `src/html/pages/` directory
2. Use existing components and layouts
3. Run the development server to see your changes

## Dashboard Layouts

AsteroAdmin offers multiple dashboard layouts to suit different needs:

- **Analytics Dashboard** - For data visualization and metrics
- **Compact Sidebar** - Space-efficient navigation
- **Dark Mode** - Eye-friendly interface for low-light environments
- **Various Components** - Extensive UI element collection
- **Offcanvas Navbar** - Modern responsive navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Technologies Used

- **Bootstrap 5.3** - Front-end component library
- **Astro** - Static site generator
- **SASS** - CSS preprocessor
- **ESBuild** - JavaScript bundler
- **SimpleBar** - Custom scrollbar plugin
- **LightningCSS** - CSS optimization
- **PostCSS** - CSS transformation tool

## Performance Optimization

AsteroAdmin is optimized for performance:

- Minified CSS and JavaScript
- Optimized asset loading
- Efficient build process
- Code splitting where appropriate
- Vendor prefixing for cross-browser compatibility

## Frequently Asked Questions

**What is included in the theme?**  
The package includes a full set of templates, and documentation.

**Is the theme mobile-friendly?**  
Absolutely, the theme is designed to be responsive across devices.

**Can I customize the design?**  
Yes, the theme is fully customizable to match your branding needs.

**How do I install the theme?**  
Installation is simple and comes with detailed instructions in the docs.

## Change Log

**Version 1.0.0** - March 13, 2025

- Initial release

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please visit [https://asterodigital.com/bootstrap-admin-template](https://asterodigital.com/bootstrap-admin-template) or create an issue in the GitHub repository.

## Author

AsteroDigital - [https://asterodigital.com](https://asterodigital.com)

---

Made with ❤️ by AsteroDigital
