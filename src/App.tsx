import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Nav, { Dock } from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Terrain from './pages/Terrain';
import Stub from './pages/Stub';
import NotFound from './pages/NotFound';

/** Pages still to be written, but routed so no advertised link 404s. */
const stubs = [
  {
    path: '/site-essentiel',
    title: 'Site Essentiel',
    description: 'Le site professionnel dès 1 490 € : jusqu’à 5 pages sur-mesure, référencement local, mobile d’abord.',
    lede: 'Le site qui vous sort du bricolage, dès 1 490 €.',
  },
  {
    path: '/site-sur-mesure',
    title: 'Site sur mesure',
    description: 'Conception complète sans gabarit, dès 2 200 €. Pour les entreprises dont le site est le premier commercial.',
    lede: 'Conception complète, sans gabarit, dès 2 200 €.',
  },
  {
    path: '/abonnement',
    title: 'Abonnement site',
    description: 'Votre site pour 390 € puis 69 €/mois, hébergement et maintenance inclus, engagement 12 mois.',
    lede: '390 € puis 69 €/mois, tout compris.',
  },
  {
    path: '/audit-ia',
    title: 'Audit IA Express',
    description: 'Un audit à 390 € : où partent vos demandes, ce que captent vos concurrents, quelles tâches automatiser. Plan chiffré à la clé.',
    lede: 'Le diagnostic à 390 € qui ouvre les projets.',
  },
  {
    path: '/realisations',
    title: 'Réalisations',
    description: 'Les sites livrés par POLIVIA pour des entreprises de l’Yonne et de la Côte d’Azur.',
    lede: 'Les entreprises qui nous ont fait confiance.',
  },
  {
    path: '/a-propos',
    title: 'À propos',
    description: 'POLIVIA, agence web et IA fondée par Geoffrey Nozza, entre l’Yonne et la Côte d’Azur.',
    lede: 'Une agence, un interlocuteur, deux territoires.',
  },
  {
    path: '/mentions-legales',
    title: 'Mentions légales',
    description: 'Mentions légales de POLIVIA.',
    lede: 'Informations légales.',
  },
  {
    path: '/confidentialite',
    title: 'Confidentialité',
    description: 'Comment POLIVIA traite vos données personnelles.',
    lede: 'Ce que nous faisons de vos données.',
  },
] as const;

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
      <Nav />
      <main id="main">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          {stubs.map((s) => (
            <Route key={s.path} path={s.path}>
              <Stub {...s} />
            </Route>
          ))}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Dock />
    </>
  );
}

export const routes = ['/', '/contact', '/terrain', ...stubs.map((s) => s.path)];
