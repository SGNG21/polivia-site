import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Normalise before the router ever reads the location. Static hosts disagree
// about trailing slashes, and `/contact/` would otherwise route to the 404
// page while the prerendered HTML said otherwise.
if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
  history.replaceState(history.state, '', location.pathname.slice(0, -1) + location.search + location.hash);
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
