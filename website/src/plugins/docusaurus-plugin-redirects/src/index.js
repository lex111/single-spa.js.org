const path = require('path');
const fs = require('fs');

const DEFAULT_OPTIONS = {
  excludedPaths: [],
};

module.exports = function(context, opts) {
  const options = { ...DEFAULT_OPTIONS, ...opts };

  return {
    name: 'docusaurus-plugin-redirects',

    async postBuild({ siteConfig = {}, routesPaths = [], outDir }) {
      routesPaths.map(routesPath => {
        if (!path.isAbsolute(routesPath)) {
          return;
        }

        if (options.excludedPaths.includes(routesPath)) {
          return;
        }

        const newLink = siteConfig.url.concat(routesPath).replace(/\/$/, '');
        const fileName = path.basename(routesPath);
        const filePath = path.dirname(routesPath);
        const htmlContent = `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=${newLink}">
    <link rel="canonical" href="${newLink}">
    <title>Redirecting to ${newLink}</title>
  </head>
  <body>
    If you are not redirected automatically, follow this <a href="${newLink}">link</a>.
  </body>
</html>
        `;

        const oldPagePath = path.join(
          outDir.concat(filePath),
          `${fileName}.html`,
        );
        fs.writeFile(oldPagePath, htmlContent, err => {
          if (err) {
            throw new Error(`File creating error: ${err}`);
          }
        });
      });
    },
  };
};
