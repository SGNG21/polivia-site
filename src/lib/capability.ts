/**
 * What this device should be asked to render.
 *
 *   'full'    — WebGL scene, plates, full curve resolution
 *   'reduced' — WebGL scene, fewer segments, no plates, capped dpr
 *   'poster'  — no WebGL at all; a static image stands in
 *
 * Decided once, synchronously, before the heavy chunk is requested — so a
 * modest phone never downloads three.js just to be told it cannot run it.
 */
export type Tier = 'full' | 'reduced' | 'poster';

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') ?? c.getContext('webgl');
    if (!gl) return false;
    // A software rasteriser will technically answer yes; it will also stutter.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? '');
      if (/swiftshader|basic render|software/i.test(r)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'poster';
  if (prefersReducedMotion()) return 'poster';
  if (!hasWebGL()) return 'poster';

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const narrow = window.matchMedia('(max-width: 760px)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  if (cores <= 2 || memory <= 2) return 'poster';

  // Phones get the poster, not a cut-down scene. On a narrow screen the
  // sculpture is a dimmed backdrop behind the headline, and spending ~260kB
  // of gzipped WebGL plus the GPU and battery for that — on exactly the
  // devices least able to afford it — is not a trade worth making. The still
  // frame is a render of the same scene, so nothing is lost but the motion.
  if (narrow) return 'poster';
  if (coarse || cores <= 4) return 'reduced';
  return 'full';
}
