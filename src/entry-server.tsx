import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { Router } from 'wouter';
import App from './App';

/**
 * Renders one route to static HTML for the build-time prerender pass.
 *
 * A whole document is rendered, not a fragment, because React only hoists
 * <title>/<meta>/<link> into <head> when it owns the document. Moving those
 * tags afterwards by hand breaks hydration: React looks for them where it
 * rendered them and finds the markup rearranged.
 */
export async function render(path: string): Promise<{ head: string; body: string }> {
  const [pathname = '/', search = ''] = path.split('?');
  const { prelude } = await prerenderToNodeStream(
    <html lang="fr">
      <head />
      <body>
        <div id="root">
          <StrictMode>
            <Router ssrPath={pathname} ssrSearch={search}>
              <App />
            </Router>
          </StrictMode>
        </div>
      </body>
    </html>,
  );

  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk as Uint8Array));
  const html = Buffer.concat(chunks).toString('utf8');

  return { head: slice(html, 'head'), body: slice(html, 'body') };
}

/** Inner HTML of a top-level tag in React's own output. */
function slice(html: string, tag: 'head' | 'body'): string {
  const open = html.indexOf(`<${tag}>`);
  const close = html.indexOf(`</${tag}>`);
  if (open === -1 || close === -1) return '';
  return html.slice(open + tag.length + 2, close);
}

export { routes } from './App';
/* Re-exported so the prerender step can write llms.txt and the sitemap from
   the same content the pages render, instead of a hand-kept copy. */
export { brand, offers, audit, maintenance, projects } from './content/site';
export { STAGES } from './content/system';
