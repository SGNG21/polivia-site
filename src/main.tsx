import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Normalise before the router ever reads the location. Static hosts disagree
// about trailing slashes and `.html` suffixes: `/contact/` or `/contact.html`
// would otherwise route to the 404 page and hydrate a noindex 404 over the
// prerendered contact page.
const clean = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/(.)\/$/, '$1');
if (clean !== location.pathname) {
  history.replaceState(history.state, '', clean + location.search + location.hash);
}

const root = document.getElementById('root')!;

// The prerender pass leaves real markup behind; hydrate it when present so
// the first paint is never thrown away and re-rendered.
if (root.hasChildNodes()) {
  hydrateRoot(
    root,
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
