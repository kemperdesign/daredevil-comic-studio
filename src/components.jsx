import React from 'react';

// ---------- persistence ----------
export const STORE_KEY = "ddr_state_v1";
export function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch (e) { return {}; }
}
export function saveState(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
}

// ---------- icons (stroke, 24x24) ----------
export const Icon = ({ name, size = 20, fill = "none", stroke = "currentColor", sw = 1.7, style }) => {
  const P = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    rows: <><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    timeline: <><path d="M5 3v18" /><circle cx="5" cy="7" r="2" fill="currentColor" stroke="none" /><circle cx="5" cy="17" r="2" fill="currentColor" stroke="none" /><path d="M9 7h11M9 17h7" /></>,
    star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L4.5 9.7l5.9-.9z" />,
    check: <path d="M4 12.5l5 5 11-11" />,
    chevL: <path d="M15 5l-7 7 7 7" />,
    chevR: <path d="M9 5l7 7-7 7" />,
    chevDown: <path d="M5 9l7 7 7-7" />,
    x: <path d="M6 6l12 12M18 6L6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 5.5V20" /></>,
    play: <path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none" />,
    layers: <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></>,
    filter: <path d="M3 5h18l-7 8v6l-4 2v-8z" />,
    page1: <rect x="6" y="3" width="12" height="18" rx="1" />,
    page2: <><rect x="3" y="4" width="8" height="16" rx="1" /><rect x="13" y="4" width="8" height="16" rx="1" /></>,
    scroll: <><rect x="6" y="2" width="12" height="7" rx="1" /><rect x="6" y="11" width="12" height="7" rx="1" /><path d="M9 21h6" /></>,
    zoomIn: <><circle cx="11" cy="11" r="7" /><path d="M11 8v6M8 11h6M20 20l-3.2-3.2" /></>,
    zoomOut: <><circle cx="11" cy="11" r="7" /><path d="M8 11h6M20 20l-3.2-3.2" /></>,
    fit: <path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    sort: <path d="M7 4v16M7 20l-3-3M7 4l3 3M17 20V4M17 4l3 3M17 20l-3-3" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    drag: <><circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none" /><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none" /></>,
    mask: <path d="M12 3c5 0 8 2.5 8 7 0 4-3 8-8 11-5-3-8-7-8-11 0-4.5 3-7 8-7z M9 10c0 1 .8 2 1.6 2.4M15 10c0 1-.8 2-1.6 2.4" />,
    home: <path d="M4 11l8-7 8 7M6 10v9h12v-9" />,
    arrowR: <path d="M5 12h14M13 6l6 6-6 6" />,
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {P}
    </svg>
  );
};

// ---------- devil-horns mask glyph (brand mark) ----------
export const DevilMark = ({ size = 26, color = "var(--red)" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: "block" }}>
    <path d="M6 4c2.4 1.2 4 3.4 4.6 6C12 9 14 8.4 16 8.4s4 .6 5.4 1.6C22 7.4 23.6 5.2 26 4c.6 4-.4 7-2.2 9.4 1.2 1.6 2 3.6 2 5.8 0 5-3.8 8.8-9.8 11.8C10 28 6.2 24.2 6.2 19.2c0-2.2.8-4.2 2-5.8C6.4 11 5.4 8 6 4z" fill={color} />
    <path d="M11.4 16.2c1-.9 2.4-1.4 4.6-1.4s3.6.5 4.6 1.4c-.7 1.5-2.4 2.6-4.6 2.6s-3.9-1.1-4.6-2.6z" fill="#070708" />
  </svg>
);

// ---------- progress ring ----------
export const Ring = ({ value = 0, size = 34, sw = 3, color = "var(--red)", track = "rgba(255,255,255,.14)", children }) => {
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .5s cubic-bezier(.2,.7,.2,1)" }} />
      </svg>
      {children && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{children}</div>}
    </div>
  );
};

// ---------- small badge ----------
export const Badge = ({ children, tone = "default", style }) => {
  const tones = {
    default: { bg: "rgba(255,255,255,.06)", fg: "var(--muted)", bd: "var(--line)" },
    red: { bg: "rgba(214,32,43,.16)", fg: "#ff6068", bd: "rgba(214,32,43,.4)" },
    gold: { bg: "rgba(224,165,46,.14)", fg: "var(--gold)", bd: "rgba(224,165,46,.4)" },
    green: { bg: "rgba(62,166,106,.14)", fg: "#5cc585", bd: "rgba(62,166,106,.4)" },
    solid: { bg: "var(--red)", fg: "#fff", bd: "var(--red)" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--head)",
      fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 3, background: tones.bg, color: tones.fg,
      border: `1px solid ${tones.bd}`, lineHeight: 1, whiteSpace: "nowrap", ...style,
    }}>{children}</span>
  );
};

// ---------- helpers ----------
export const fmtDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};
export const fmtDateLong = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
};
export const lastName = (n) => n.split(" ").slice(-1)[0];
export const issueYear = (iss) => iss.date.slice(0, 4);
