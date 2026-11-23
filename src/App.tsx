import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { notice } from './content/site';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Terrain from './pages/Terrain';
import AuditIa from './pages/AuditIa';
import Realisations from './pages/Realisations';
import About from './pages/About';
import { MentionsLegales, Confidentialite } from './pages/Legal';
import NotFound from './pages/NotFound';
import Sent from './pages/Sent';


/**
 * Restores the top of the page between routes, and honours a #hash coming
 * from another page — a plain anchor cannot scroll to a target that the
 * router has not mounted yet.
 */
function useRouteScroll() {
  const [path] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [path]);
}

export default function App() {
  const [path] = useLocation();
  useRouteScroll();

  // The field landing page is intentionally chrome-free: one offer, one
  // action, nowhere to wander off to.
  if (path === '/terrain') return <Terrain />;

  return (
    <>
      <a className="skip" href="#main">
        Aller au contenu
      </a>
      <div className="notice">
        <span className="signal" aria-hidden="true" />
        <span>{notice.text}</span>
        <a href={notice.href}>
          {notice.linkLabel} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <Nav />
      <main id="main">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/demande-envoyee" component={Sent} />
          <Route path="/audit-ia" component={AuditIa} />
          <Route path="/realisations" component={Realisations} />
          <Route path="/a-propos" component={About} />
          <Route path="/mentions-legales" component={MentionsLegales} />
          <Route path="/confidentialite" component={Confidentialite} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

export const routes = ['/', '/contact', '/demande-envoyee', '/terrain', '/audit-ia', '/realisations', '/a-propos', '/mentions-legales', '/confidentialite'];
