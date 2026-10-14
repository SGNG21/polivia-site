/**
 * L'écran de l'ordinateur, dessiné sur un canvas puis utilisé comme texture
 * émissive.
 *
 * Pourquoi pas du vrai DOM en 3D (drei `Html transform`) : une couche DOM
 * flotte au-dessus du rendu et échappe au bloom comme à la profondeur de
 * champ. Elle aurait l'air collée sur la photo au lieu d'être dedans. Une
 * texture, elle, reçoit la lumière et le flou comme le reste de la scène.
 */
export const SCREEN_W = 1024;
export const SCREEN_H = 640;

const GOLD = '#e8be7e';
const IVORY = '#f6f2ea';

export function drawScreen(ctx: CanvasRenderingContext2D, t: number): void {
  const W = SCREEN_W;
  const H = SCREEN_H;

  // Fond : un dégradé chaud qui descend vers le noir, comme la maquette.
  const bg = ctx.createLinearGradient(0, 0, W * 0.3, H);
  bg.addColorStop(0, '#1d1710');
  bg.addColorStop(0.55, '#120f0b');
  bg.addColorStop(1, '#070605');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Halo doré qui respire, décalé vers le haut à droite.
  const glow = ctx.createRadialGradient(
    W * 0.72, H * 0.2, 0,
    W * 0.72, H * 0.2, W * 0.7,
  );
  const pulse = 0.16 + Math.sin(t * 0.6) * 0.04;
  glow.addColorStop(0, `rgba(232,190,126,${pulse})`);
  glow.addColorStop(1, 'rgba(232,190,126,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Barre de navigation du site présenté.
  ctx.fillStyle = GOLD;
  ctx.globalAlpha = 0.9;
  ctx.fillRect(64, 54, 92, 11);
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = IVORY;
  for (let i = 0; i < 4; i++) ctx.fillRect(W - 420 + i * 92, 57, 58, 7);
  ctx.globalAlpha = 1;

  // Titre éditorial : serif blanc puis italique or, comme l'identité POLIVIA.
  ctx.fillStyle = IVORY;
  ctx.font = '600 76px Fraunces, Georgia, serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('L’artisanat,', 64, H - 232);
  ctx.fillStyle = GOLD;
  ctx.font = 'italic 600 76px Fraunces, Georgia, serif';
  ctx.fillText('sans compromis.', 64, H - 146);

  // Bouton d'appel à l'action, avec son dégradé.
  const btn = ctx.createLinearGradient(64, H - 108, 64, H - 52);
  btn.addColorStop(0, '#f6dda8');
  btn.addColorStop(1, '#d9ad68');
  ctx.fillStyle = btn;
  roundRect(ctx, 64, H - 108, 268, 56, 28);
  ctx.fill();
  ctx.fillStyle = '#17120a';
  ctx.font = '700 23px "Hanken Grotesk", system-ui, sans-serif';
  ctx.fillText('Demander un devis', 96, H - 70);

  // Un curseur de saisie qui clignote dans le champ de recherche du site.
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  roundRect(ctx, W - 360, H - 112, 296, 60, 30);
  ctx.stroke();
  ctx.globalAlpha = Math.sin(t * 3.2) > 0 ? 0.85 : 0.2;
  ctx.fillStyle = GOLD;
  ctx.fillRect(W - 330, H - 96, 2, 28);
  ctx.globalAlpha = 1;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
