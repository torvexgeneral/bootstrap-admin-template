export function getCSS(isDev: boolean): string {
  return isDev ? `/dist/css/style.css` : `/css/style.min.css`;
}

export function getJS(filename: string, isDev: boolean): string {
  return isDev ? `/dist/js/${filename}.js` : `/js/${filename}.min.js`;
}

export function generatePreviewId(): string {
  return `preview-${Math.random().toString(36).substr(2, 9)}`;
}

export interface IframeContentProps {
  component: string;
  cssCode?: string;
  jsCode?: string;
  isDev: boolean;
}

export function createIframeContent({ component, cssCode, jsCode, isDev }: IframeContentProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script>
    const theme = localStorage.getItem("theme");
    if (theme) {
      localStorage.setItem("iframe-theme", theme);
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  </script>

  <link href="${getCSS(isDev)}" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css" rel="stylesheet">

  <style id="component-style">
    body {
      padding: 1rem;
      margin: 0;
    }
    #component-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
    }
    #component-html {
      width: 100%;
      height: 100%;
    }
  </style>

  <style id="custom-css">
    ${cssCode || ''}
  </style>

  <script>
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'setTheme') {
        document.documentElement.setAttribute('data-bs-theme', event.data.theme);
        document.body.classList.remove('theme-update');
        void document.body.offsetWidth;
        document.body.classList.add('theme-update');
        window.parent.postMessage({ type: 'themeAcknowledged', theme: event.data.theme }, '*');
      } else if (event.data && event.data.type === 'updateContent') {
        if (event.data.html !== undefined) {
          document.getElementById('component-html').innerHTML = event.data.html;
        }

        if (event.data.css !== undefined) {
          const styleTag = document.getElementById('custom-css');
          if (styleTag) {
            styleTag.textContent = event.data.css;
          }
        }

        if (event.data.js !== undefined) {
          try {
            const oldScript = document.getElementById('custom-js');
            if (oldScript) {
              oldScript.remove();
            }
            const newScript = document.createElement('script');
            newScript.id = 'custom-js';
            newScript.textContent = event.data.js;
            document.body.appendChild(newScript);
            (new Function(event.data.js))();
          } catch (error) {
            console.error('Error executing JavaScript:', error);
          }
        }
        window.parent.postMessage({ type: 'contentAcknowledged' }, '*');
      }
    });

    window.parent.postMessage({
      type: 'iframeReady',
      theme: document.documentElement.getAttribute('data-bs-theme')
    }, '*');
  </script>
</head>
<body>
  <div id="component-wrapper">
    <div id="component-html">
      ${component}
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="${getJS("main", isDev)}"></script>

  <div id="custom-js">
    ${jsCode || ''}
  </div>
</body>
</html>
`;
}
