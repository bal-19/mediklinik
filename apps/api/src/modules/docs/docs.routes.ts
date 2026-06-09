import type { ApiRouter } from '../shared/api-router';
import { createOpenApiDocument } from './openapi';

export function registerDocsRoutes(router: ApiRouter) {
  router.get(
    '/openapi.json',
    () => Response.json(createOpenApiDocument(router.listRoutes())),
    {
      summary: 'OpenAPI JSON',
      description: 'Machine-readable OpenAPI document untuk tooling dan SDK generation.',
      tags: ['Docs'],
      auth: 'public',
    },
  );

  router.get('/docs', () => renderScalarPage(), {
    summary: 'Scalar API Docs',
    description: 'Dokumentasi interaktif API MediKlinik menggunakan Scalar.',
    tags: ['Docs'],
    auth: 'public',
  });
}

function renderScalarPage() {
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MediKlinik API Docs</title>
    <style>
      body { margin: 0; background: #0f172a; }
    </style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/openapi.json"
      data-configuration='{
        "theme": "purple",
        "layout": "modern",
        "hideDownloadButton": false,
        "showSidebar": true,
        "searchHotKey": "k",
        "defaultHttpClient": {
          "targetKey": "js",
          "clientKey": "fetch"
        }
      }'></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
}
