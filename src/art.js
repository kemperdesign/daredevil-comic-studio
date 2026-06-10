/* Procedural art engine — original noir Hell's Kitchen artwork generated per
   issue from its `seed`. No copyrighted artwork is used or reproduced; every
   cover and page is drawn here from primitives (skylines, radar rings,
   halftone, rain, ink) so the prototype has believable visuals to read. */

const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const enc = (svg) => "data:image/svg+xml;utf8," + encodeURIComponent(svg);
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// --- shared scenery primitives -------------------------------------------
function skyline(rnd, w, baseY, color, density) {
  let d = `M0 ${baseY}`;
  let x = 0;
  while (x < w) {
    const bw = 14 + rnd() * 46 * (1 / density);
    const bh = 30 + rnd() * 230 * density;
    const y = baseY - bh;
    d += ` L${x.toFixed(1)} ${baseY} L${x.toFixed(1)} ${y.toFixed(1)} L${(x + bw).toFixed(1)} ${y.toFixed(1)}`;
    x += bw;
  }
  d += ` L${w} ${baseY} L${w} ${baseY + 400} L0 ${baseY + 400} Z`;
  // a few lit windows
  let wins = "";
  const rnd2 = rnd;
  for (let i = 0; i < 26 * density; i++) {
    const wx = rnd2() * w, wy = baseY - rnd2() * 180 - 8;
    if (rnd2() > 0.78) wins += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="2.4" height="3.4" fill="#E9C56B" opacity="${(0.3 + rnd2() * 0.5).toFixed(2)}"/>`;
  }
  return `<path d="${d}" fill="${color}"/>${wins}`;
}
function rings(cx, cy, accent, n, step, op) {
  let s = "";
  for (let i = 1; i <= n; i++)
    s += `<circle cx="${cx}" cy="${cy}" r="${i * step}" fill="none" stroke="${accent}" stroke-width="${(1.4 - i * 0.04).toFixed(2)}" opacity="${(op * (1 - i / (n + 3))).toFixed(3)}"/>`;
  return s;
}
function rain(rnd, w, h, op) {
  let s = "";
  for (let i = 0; i < 90; i++) {
    const x = rnd() * w, y = rnd() * h, len = 10 + rnd() * 26;
    s += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x - len * 0.28).toFixed(1)}" y2="${(y + len).toFixed(1)}" stroke="#cfd6e4" stroke-width="0.8" opacity="${(op * (0.2 + rnd() * 0.5)).toFixed(2)}"/>`;
  }
  return s;
}
function halftoneDef(id, color, size) {
  return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.22}" fill="${color}"/></pattern>`;
}

// --- COVER ----------------------------------------------------------------
// returns a data-uri for an <img>. W×H ~ 2:3.
function cover(iss, series) {
  const W = 680, H = 1020;
  const rnd = mulberry32(iss.seed * 2654435761 >>> 0);
  const accent = series.accent;
  const dark = "#08080a";
  const cx = 150 + rnd() * 380, cy = 240 + rnd() * 300;
  const baseY = H - 150 - rnd() * 160;
  const dens = 0.7 + rnd() * 0.7;
  const noir = rnd() > 0.62; // some covers near-monochrome
  const glow = noir ? "#1a1d27" : accent;

  const title = (series.short.includes("Vol") || series.vol.includes("Mini"))
    ? "DAREDEVIL" : series.name.toUpperCase();
  const small = series.vol;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<radialGradient id="bg" cx="${(cx / W * 100).toFixed(0)}%" cy="${(cy / H * 100).toFixed(0)}%" r="85%">
  <stop offset="0%" stop-color="${shade(glow, noir ? 6 : -40)}"/>
  <stop offset="42%" stop-color="${shade(dark, 10)}"/>
  <stop offset="100%" stop-color="${dark}"/>
</radialGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="${dark}" stop-opacity="0"/>
  <stop offset="100%" stop-color="${dark}" stop-opacity="0.96"/>
</linearGradient>
${halftoneDef("ht" + iss.seed, accent, 9)}
<linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="${shade(accent, 40)}"/>
  <stop offset="100%" stop-color="${shade(accent, -70)}"/>
</linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#ht${iss.seed})" opacity="0.05"/>
${rings(cx, cy, accent, 11, 30, noir ? 0.16 : 0.4)}
${rain(rnd, W, H, noir ? 0.5 : 0.28)}
${skyline(rnd, W, baseY, "#050507", dens)}
<g opacity="0.85">${skyline(rnd, W, baseY + 38, "#0b0c10", dens * 1.3)}</g>
<rect width="${W}" height="${H}" fill="url(#fade)"/>
<!-- big slashing accent stroke -->
<path d="M${(-20).toFixed(0)} ${(H * 0.34).toFixed(0)} L${W + 20} ${(H * 0.2).toFixed(0)}" stroke="url(#rim)" stroke-width="${noir ? 5 : 10}" opacity="0.5"/>
<!-- title block -->
<text x="44" y="${H - 196}" font-family="Anton, Oswald, sans-serif" font-size="118" letter-spacing="-3" fill="#f6f4ef" style="font-weight:400">${title.length > 11 ? title.slice(0, 11) : title}</text>
${title.length > 11 ? `<text x="44" y="${H - 92}" font-family="Anton, Oswald, sans-serif" font-size="118" letter-spacing="-3" fill="#f6f4ef">${title.slice(11)}</text>` : ""}
<rect x="46" y="${H - 168}" width="150" height="6" fill="${accent}"/>
<text x="48" y="${H - 142}" font-family="Barlow, sans-serif" font-size="22" letter-spacing="4" fill="${shade(accent, 60)}" style="font-weight:600">${small.toUpperCase()}</text>
<!-- issue badge -->
<g transform="translate(${W - 132},44)">
<rect width="92" height="92" rx="6" fill="#0a0a0c" stroke="${accent}" stroke-width="2"/>
<text x="46" y="40" text-anchor="middle" font-family="Barlow,sans-serif" font-size="13" letter-spacing="2" fill="${shade(accent, 50)}" style="font-weight:700">MARVEL</text>
<text x="46" y="76" text-anchor="middle" font-family="Anton, Oswald, sans-serif" font-size="40" fill="#f6f4ef">${iss.no.replace("#", "")}</text>
</g>
<!-- creator credits -->
<text x="44" y="58" font-family="Barlow,sans-serif" font-size="20" letter-spacing="3" fill="#cfcdd4" style="font-weight:700">${iss.writer.split(" ").slice(-1)[0].toUpperCase()} · ${iss.penciller.split(" ").slice(-1)[0].toUpperCase()}</text>
</svg>`;
  return enc(svg);
}

// --- INTERIOR PAGE --------------------------------------------------------
const CAPS = [
  "Hell's Kitchen never really sleeps. It just closes its eyes.",
  "Forty-two heartbeats. Two of them lying.",
  "The rain tells me where everyone is standing.",
  "My father taught me to get up. He didn't say it would be easy.",
  "There are no good nights here. Only quieter ones.",
  "I can hear the lie before he finishes telling it.",
  "The city is a sentence I never finish reading.",
  "Fear is a language. I was raised bilingual.",
];
const BUBS = ["You picked the wrong block.", "Stay down.", "Not tonight.", "Who sent you?", "I'm not the one you should be afraid of.", "Last chance.", "I hear everything.", "Run."];

function panelArt(rnd, w, h, accent, kind) {
  const id = "p" + Math.floor(rnd() * 1e6);
  const baseY = h * (0.55 + rnd() * 0.3);
  const cx = w * (0.2 + rnd() * 0.6), cy = h * (0.25 + rnd() * 0.3);
  let inner = "";
  if (kind === 0) { // skyline establishing
    inner = `${rings(cx, cy, accent, 7, h * 0.05, 0.3)}${skyline(rnd, w, baseY, "#05060a", 0.9)}${rain(rnd, w, h, 0.4)}`;
  } else if (kind === 1) { // action / motion
    let sl = "";
    for (let i = 0; i < 9; i++) { const y = rnd() * h; sl += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${(y + (rnd() - 0.5) * 40).toFixed(1)}" stroke="${accent}" stroke-width="${(0.6 + rnd() * 2).toFixed(1)}" opacity="${(0.1 + rnd() * 0.25).toFixed(2)}"/>`; }
    inner = `${sl}${rings(cx, cy, "#f6f4ef", 5, h * 0.04, 0.12)}`;
  } else if (kind === 2) { // close / radar
    inner = `${rings(w / 2, h / 2, accent, 12, Math.max(w, h) * 0.04, 0.4)}`;
  } else { // ink / silhouette
    let blobs = "";
    for (let i = 0; i < 5; i++) { const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 60; blobs += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="#050507" opacity="${(0.3 + rnd() * 0.5).toFixed(2)}"/>`; }
    inner = `${skyline(rnd, w, baseY, "#070709", 1.4)}${blobs}${rain(rnd, w, h, 0.25)}`;
  }
  const g1 = shade(accent, kind === 2 ? -60 : -90), g2 = "#0a0a0d";
  return `<defs><radialGradient id="${id}" cx="${(cx / w * 100).toFixed(0)}%" cy="${(cy / h * 100).toFixed(0)}%" r="90%"><stop offset="0%" stop-color="${g1}"/><stop offset="100%" stop-color="${g2}"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>${inner}`;
}

// layouts: arrays of [x,y,w,h] in 0..1
const LAYOUTS = [
  [[0, 0, 1, 0.46], [0, 0.48, 0.48, 0.5], [0.5, 0.48, 0.5, 0.5]],
  [[0, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0, 0.5, 1, 0.48]],
  [[0, 0, 1, 0.62], [0, 0.64, 1, 0.34]],
  [[0, 0, 0.5, 0.33], [0.5, 0, 0.5, 0.33], [0, 0.34, 1, 0.3], [0, 0.66, 0.5, 0.32], [0.5, 0.66, 0.5, 0.32]],
  [[0, 0, 1, 1]],
  [[0, 0, 1, 0.32], [0, 0.34, 0.5, 0.32], [0.5, 0.34, 0.5, 0.32], [0, 0.68, 1, 0.3]],
];

function page(iss, series, pageIndex) {
  const W = 700, H = 1075, pad = 14, gut = 10;
  const rnd = mulberry32(((iss.seed + 1) * 99991 + pageIndex * 7919) >>> 0);
  const accent = series.accent;
  const isCoverPage = pageIndex === 0;
  if (isCoverPage) { // first "page" mirrors the cover
    return cover(iss, series);
  }
  const layout = LAYOUTS[Math.floor(rnd() * LAYOUTS.length)];
  let panels = "";
  layout.forEach((p, i) => {
    const x = pad + p[0] * (W - pad * 2) + (p[0] > 0 ? gut / 2 : 0);
    const y = pad + p[1] * (H - pad * 2) + (p[1] > 0 ? gut / 2 : 0);
    const w = p[2] * (W - pad * 2) - (p[2] < 1 ? gut / 2 : 0);
    const h = p[3] * (H - pad * 2) - (p[3] < 1 ? gut / 2 : 0);
    const kind = Math.floor(rnd() * 4);
    const art = panelArt(rnd, w, h, accent, kind);
    // captions & bubbles
    let overlay = "";
    if (rnd() > 0.45) {
      const cap = CAPS[Math.floor(rnd() * CAPS.length)];
      const cw = Math.min(w - 24, 200 + cap.length * 3.4);
      overlay += `<g transform="translate(12,12)"><rect width="${cw}" height="44" fill="#0c0c0e" stroke="${accent}" stroke-width="1.5" opacity="0.94"/><foreignObject x="9" y="6" width="${cw - 18}" height="34"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Barlow,sans-serif;font-size:11px;line-height:1.16;color:#e9e7e2;font-weight:600">${cap}</div></foreignObject></g>`;
    }
    if (kind !== 0 && rnd() > 0.5) {
      const b = BUBS[Math.floor(rnd() * BUBS.length)];
      const bw = 40 + b.length * 6.2, bx = w - bw - 16, by = h - 70;
      overlay += `<g transform="translate(${bx.toFixed(0)},${by.toFixed(0)})"><rect width="${bw}" height="40" rx="20" fill="#f4f2ec"/><path d="M22 38 L14 56 L36 39 Z" fill="#f4f2ec"/><foreignObject x="12" y="7" width="${bw - 24}" height="28"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Barlow,sans-serif;font-size:12px;font-weight:700;color:#111;text-align:center">${b}</div></foreignObject></g>`;
    }
    panels += `<svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}"><rect width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#000"/>${art}${overlay}<rect width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="#000" stroke-width="3"/></svg>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#000"/>${panels}<text x="${W - 18}" y="${H - 12}" text-anchor="end" font-family="Barlow,sans-serif" font-size="13" fill="#5a5a5e">${pageIndex + 1}</text></svg>`;
  return enc(svg);
}

// --- LANDSCAPE STILL (16:9) for screen / video section --------------------
function still(item) {
  const W = 1280, H = 720;
  const rnd = mulberry32((item.seed * 100003) >>> 0);
  const accent = item.accent || "#d6202b";
  const cx = 300 + rnd() * 680, cy = 150 + rnd() * 250;
  const baseY = H - 90 - rnd() * 120;
  const noir = (item.kind === "Film");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<radialGradient id="bg" cx="${(cx / W * 100).toFixed(0)}%" cy="${(cy / H * 100).toFixed(0)}%" r="80%">
  <stop offset="0%" stop-color="${shade(noir ? "#15161c" : accent, noir ? 8 : -50)}"/>
  <stop offset="46%" stop-color="#0b0b0e"/><stop offset="100%" stop-color="#060608"/>
</radialGradient>
${halftoneDef("hs" + item.seed, accent, 11)}
<linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="40%" stop-color="#060608" stop-opacity="0"/><stop offset="100%" stop-color="#060608" stop-opacity=".95"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#hs${item.seed})" opacity="0.05"/>
${rings(cx, cy, accent, 13, 44, noir ? 0.16 : 0.34)}
${rain(rnd, W, H, noir ? 0.5 : 0.3)}
${skyline(rnd, W, baseY, "#050507", 0.7)}
<g opacity="0.8">${skyline(rnd, W, baseY + 46, "#0a0b10", 1.1)}</g>
<rect width="${W}" height="${H}" fill="url(#vg)"/>
<path d="M-20 ${(H * 0.3).toFixed(0)} L${W + 20} ${(H * 0.18).toFixed(0)}" stroke="${accent}" stroke-width="6" opacity="0.4"/>
</svg>`;
  return enc(svg);
}

export const DDR_ART = { cover, page, still };
