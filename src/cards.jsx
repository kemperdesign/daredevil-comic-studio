import React from 'react';
import { DDR_SERIES } from './data';
import { DDR_ART } from './art';
import { Icon, Ring, Badge, fmtDate, fmtDateLong, lastName } from './components';
import { getCover } from './storage';

// Memoized cover-image (data-uri SVG from the art engine)
const coverCache = {};
export function coverFor(iss) {
  if (!coverCache[iss.id]) coverCache[iss.id] = DDR_ART.cover(iss, DDR_SERIES[iss.s]);
  return coverCache[iss.id];
}

export const CoverImg = ({ iss, style, className }) => {
  const [src, setSrc] = React.useState(coverCache[iss.id]);

  React.useEffect(() => {
    let mounted = true;
    if (iss.coverUrl) {
      coverCache[iss.id] = iss.coverUrl;
      setSrc(iss.coverUrl);
    } else if (!coverCache[iss.id]) {
      setSrc(coverFor(iss));
    }
    
    getCover(iss.id).then(custom => {
      if (!mounted) return;
      if (custom) {
        coverCache[iss.id] = custom;
        setSrc(custom);
      } else {
        const url = `/covers/${iss.id}.jpg`;
        fetch(url, {method: 'HEAD'}).then(res => {
          if (res.ok && mounted) {
            coverCache[iss.id] = url;
            setSrc(url);
          }
        }).catch(()=>{});
      }
    }).catch(()=>{});

    return () => { mounted = false; };
  }, [iss.id]);

  return (
    <img src={src || coverFor(iss)} alt={`${DDR_SERIES[iss.s].name} ${iss.no}`}
      loading="lazy" className={className}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />
  );
};

// status corner flags shown on a cover
const CoverFlags = ({ st }) => (
  <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 6, zIndex: 2 }}>
    {st.fav && <span style={flagStyle("var(--gold)")}><Icon name="star" size={13} fill="#1a1304" stroke="#1a1304" sw={0} /></span>}
    {st.read && <span style={flagStyle("var(--green)")}><Icon name="check" size={13} stroke="#06210f" sw={2.4} /></span>}
  </div>
);
const flagStyle = (bg) => ({
  width: 24, height: 24, borderRadius: 3, background: bg, display: "grid", placeItems: "center",
  boxShadow: "0 3px 10px rgba(0,0,0,.5)",
});

// ---- GRID CARD ----
export const CoverCard = ({ iss, st, onOpen, onRead, index = 0 }) => {
  const [hover, setHover] = React.useState(false);
  const series = DDR_SERIES[iss.s];
  const pct = st.pages ? Math.round((st.page || 0) / (iss.pages - 1) * 100) : 0;
  const inProgress = st.page > 0 && !st.read;
  return (
    <div className="fade-up" style={{ animationDelay: `${Math.min(index, 16) * 24}ms` }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button onClick={() => onOpen(iss)} style={{
        position: "relative", width: "100%", aspectRatio: "2 / 3", borderRadius: 6, overflow: "hidden",
        background: "var(--ink-3)", display: "block", textAlign: "left",
        border: `1px solid ${hover ? "var(--line-2)" : "var(--line)"}`,
        boxShadow: hover ? "var(--shadow), var(--shadow-red)" : "0 8px 24px -10px rgba(0,0,0,.7)",
        transform: hover ? "translateY(-5px)" : "none", transition: "all .28s cubic-bezier(.2,.7,.2,1)",
      }}>
        <CoverFlags st={st} />
        <CoverImg iss={iss} style={{ filter: hover ? "none" : "saturate(.92) brightness(.93)", transition: "filter .3s" }} />
        {/* hover scrim + read button */}
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          background: "radial-gradient(120% 90% at 50% 60%, rgba(7,7,8,.72), rgba(7,7,8,.2))",
          opacity: hover ? 1 : 0, transition: "opacity .28s",
        }}>
          <span onClick={(e) => { e.stopPropagation(); onRead(iss); }} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px",
            background: "var(--red)", color: "#fff", borderRadius: 4, fontFamily: "var(--head)",
            fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", fontSize: 13,
            boxShadow: "0 10px 30px -6px var(--red-glow)", transform: hover ? "scale(1)" : "scale(.9)",
            transition: "transform .28s",
          }}>
            <Icon name="play" size={15} /> {inProgress ? "Resume" : "Read"}
          </span>
        </div>
        {/* progress bar */}
        {inProgress && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: "rgba(0,0,0,.5)" }}>
            <div style={{ height: "100%", width: pct + "%", background: "var(--red)", boxShadow: "0 0 10px var(--red-glow)" }} />
          </div>
        )}
      </button>
      {/* caption */}
      <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 14, color: "var(--paper)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{iss.title}</div>
          <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {series.short} · {iss.no} · {fmtDate(iss.date)}
          </div>
        </div>
        {inProgress && <Ring value={pct / 100} size={26} sw={2.6}><span style={{ fontSize: 8, fontWeight: 700, color: "var(--red)" }}>{pct}</span></Ring>}
      </div>
    </div>
  );
};

// ---- LIST ROW ----
export const RowItem = ({ iss, st, onOpen, onRead, showTL, index = 0 }) => {
  const [hover, setHover] = React.useState(false);
  const series = DDR_SERIES[iss.s];
  const pct = st.page > 0 ? Math.round((st.page || 0) / (iss.pages - 1) * 100) : 0;
  const inProgress = st.page > 0 && !st.read;
  return (
    <div className="fade-up" style={{ animationDelay: `${Math.min(index, 20) * 18}ms` }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(iss)}
      style={{
        display: "grid", gridTemplateColumns: "44px 56px 1fr auto", gap: 16, alignItems: "center",
        padding: "10px 16px", borderRadius: 6, cursor: "pointer",
        background: hover ? "var(--ink-3)" : "transparent",
        border: `1px solid ${hover ? "var(--line)" : "transparent"}`, transition: "background .18s",
      }}>
      <div style={{ fontFamily: "var(--display)", fontSize: 22, color: hover ? "var(--red)" : "var(--muted-2)", textAlign: "center", transition: "color .2s" }}>
        {showTL ? (iss._tlPos != null ? String(iss._tlPos).padStart(2, "0") : "—") : fmtDate(iss.date).split(" ")[1].slice(2)}
      </div>
      <div style={{ position: "relative", width: 56, height: 80, borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 14px -4px #000", flexShrink: 0 }}>
        <CoverImg iss={iss} />
        {st.read && <div style={{ position: "absolute", inset: 0, background: "rgba(62,166,106,.16)" }} />}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{iss.title}</span>
          {st.fav && <Icon name="star" size={13} fill="var(--gold)" stroke="var(--gold)" sw={0} />}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={{ color: "var(--muted)" }}>{series.name} {series.vol.includes("Vol") ? "" : ""}{iss.no}</span>
          <span style={{ color: "var(--muted-2)" }}>{lastName(iss.writer)} · {lastName(iss.penciller)}</span>
          <span style={{ color: "var(--muted-2)" }}>{fmtDateLong(iss.date)}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {inProgress && <Badge tone="red">{pct}%</Badge>}
        {st.read && <Badge tone="green"><Icon name="check" size={11} sw={2.6} /> Read</Badge>}
        <button onClick={(e) => { e.stopPropagation(); onRead(iss); }} title="Read"
          style={{
            width: 38, height: 38, borderRadius: 5, display: "grid", placeItems: "center",
            background: hover ? "var(--red)" : "var(--ink-4)", color: "#fff",
            transition: "background .2s", boxShadow: hover ? "0 6px 18px -6px var(--red-glow)" : "none",
          }}><Icon name="play" size={15} /></button>
      </div>
    </div>
  );
};
