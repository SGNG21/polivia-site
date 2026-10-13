const losses = [
  {
    head: 'Le client appelle le suivant',
    body: 'Vous êtes sur un chantier, en rendez-vous, les mains prises. L’appel sonne dans le vide — et le prospect redescend la page Google.',
  },
  {
    head: 'Personne ne vous trouve',
    body: 'Votre métier plus votre ville : c’est ce que tape votre client. Si vous n’êtes pas sur cette requête, vous n’existez pas pour lui.',
  },
  {
    head: 'Le site ne travaille pas',
    body: 'Une vitrine jolie mais muette. Pas de parcours vers le devis, pas d’appel en un geste, pas de référencement — donc pas de demandes.',
  },
];

export default function Constat() {
  return (
    <section className="world-ink band" aria-labelledby="constat-h">
      <div className="wrap constat">
        <div className="section-head" data-reveal>
          <h2 id="constat-h" className="t-h2">
            Vous ne perdez pas des clics. Vous perdez des clients.
          </h2>
          <p className="lede">
            Une demande qui n’arrive pas ne laisse aucune trace. C’est précisément ce qui la
            rend difficile à voir — et coûteuse.
          </p>
        </div>

        <ul className="constat-list">
          {losses.map((l, i) => (
            <li key={l.head} data-reveal data-reveal-delay={120 + i * 90}>
              <h3 className="t-h3">{l.head}</h3>
              <p className="body-muted">{l.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
