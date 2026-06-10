import React from 'react';
import { DDR_SCREEN } from './data';
import { DDR_ART } from './art';
import { Icon, Badge } from './components';

const stillCache = {};
export function stillFor(item) {
  if (!stillCache[item.id]) stillCache[item.id] = DDR_ART.still(item);
  return stillCache[item.id];
}

const LinkEditor = ({ value, onSave, accent }) => {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(value || "");
  React.useEffect(() => setVal(value || ""), [value]);

  if (!editing && value) {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <a href={value} target="_blank" rel="noopener" style={{
          flex: 1, display: "inline-flex", alignItems: "center", gap: 9, padding: "11px 16px", borderRadius: 6,
          background: accent, color: "#fff", fontFamily: "var(--head)", fontWeight: 600, fontSize: 14,
          letterSpacing: ".05em", textTransform: "uppercase", justifyContent: "center", boxShadow: "0 10px 26px -10px rgba(0,0,0,.7)",
        }}><Icon name="play" size={16} /> Watch now</a>
        <button onClick={() => setEditing(true)} title="Edit link" style={{ width: 42, height: 42, borderRadius: 6, background: "var(--ink-4)", border: "1px solid var(--line)", color: "var(--muted)", display: "grid", placeItems: "center" }}>
          <Icon name="info" size={16} />
        </button>
      </div>
    );
  }
  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} style={{
        width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "11px 16px",
        borderRadius: 6, background: "var(--ink-3)", border: "1px dashed var(--line-2)", color: "var(--muted)",
        fontFamily: "var(--head)", fontWeight: 600, fontSize: 13.5, letterSpacing: ".05em", textTransform: "uppercase",
      }}><Icon name="plus" size={16} /> Add watch link</button>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(val.trim()); setEditing(false); }} style={{ display: "flex", gap: 8 }}>
      <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder="Paste streaming URL…"
        style={{ flex: 1, padding: "11px 14px", background: "var(--ink-2)", border: "1px solid var(--line-2)", borderRadius: 6, color: "var(--paper)", fontSize: 14, outline: "none" }} />
      <button type="submit" style={{ padding: "0 16px", borderRadius: 6, background: accent, color: "#fff", fontFamily: "var(--head)", fontWeight: 600, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase" }}>Save</button>
      {value && <button type="button" onClick={() => { onSave(""); setEditing(false); }} title="Remove" style={{ width: 42, borderRadius: 6, background: "var(--ink-3)", border: "1px solid var(--line)", color: "var(--muted)", display: "grid", placeItems: "center" }}><Icon name="x" size={15} /></button>}
    </form>
  );
};

const ScreenCard = ({ item, watch, onSave, featured }) => {
  const link = watch[item.id];
  return (
    <div className="fade-up" style={{
      gridColumn: featured ? "1 / -1" : "auto", display: "flex", flexDirection: featured ? "row" : "column",
      background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden",
      boxShadow: "0 12px 36px -16px #000",
    }}>
      <div style={{ position: "relative", flex: featured ? "0 0 52%" : "none", aspectRatio: featured ? "auto" : "16/9", overflow: "hidden" }}>
        <img src={stillFor(item)} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(11,11,14,.9), transparent 60%)" }} />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 7 }}>
          <Badge tone={item.kind === "Film" ? "gold" : "red"}>{item.kind === "Film" ? "Film" : item.season}</Badge>
          {item.upcoming && <Badge tone="solid">Upcoming</Badge>}
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div className="display" style={{ fontSize: featured ? 40 : 26, lineHeight: .96 }}>{item.title}</div>
            <div style={{ fontFamily: "var(--head)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{item.year} · {item.platform} · {item.runtime}</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: featured ? "30px 30px" : "16px 18px 18px", display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
        {featured && <span className="eyebrow" style={{ color: "var(--red)" }}>Now in your watchlist focus</span>}
        <p style={{ fontSize: featured ? 16 : 13.5, lineHeight: 1.55, color: featured ? "#d9d6cf" : "var(--muted)", margin: 0 }}>{item.synopsis}</p>
        {featured && (
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", margin: "2px 0" }}>
            <div><div className="eyebrow" style={{ marginBottom: 3 }}>Showrunner / Director</div><div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 15 }}>{item.director}</div></div>
            <div style={{ minWidth: 0 }}><div className="eyebrow" style={{ marginBottom: 3 }}>Cast</div><div style={{ fontSize: 14, color: "var(--paper)" }}>{item.cast}</div></div>
          </div>
        )}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <LinkEditor value={link} onSave={(v) => onSave(item.id, v)} accent="var(--red)" />
          <a href={item.trailer} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 12.5, fontFamily: "var(--head)", letterSpacing: ".04em", textTransform: "uppercase", justifyContent: "center" }}>
            <Icon name="arrowR" size={14} /> Find trailer
          </a>
        </div>
      </div>
    </div>
  );
};

export const ScreenView = ({ state, helpers }) => {
  const watch = state.watch || {};
  const onSave = (id, url) => helpers.setWatch(id, url);
  const film = DDR_SCREEN.filter((s) => s.kind === "Film");
  const netflix = DDR_SCREEN.filter((s) => ["nf_s1", "nf_s2", "nf_s3", "defenders", "echo"].includes(s.id));
  const bornagain = DDR_SCREEN.filter((s) => s.id.startsWith("ba_"));
  const featured = DDR_SCREEN.find((s) => s.id === "ba_s1");
  const linkedCount = Object.values(watch).filter(Boolean).length;

  const Group = ({ title, sub, items }) => (
    <section style={{ marginBottom: 44 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 18px" }}>
        <span style={{ width: 4, height: 24, background: "var(--red)", borderRadius: 2 }} />
        <h2 className="head" style={{ fontSize: 22, fontWeight: 600 }}>{title}</h2>
        <span className="eyebrow">{sub}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
        {items.map((it) => <ScreenCard key={it.id} item={it} watch={watch} onSave={onSave} />)}
      </div>
    </section>
  );

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 90 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 26 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "var(--red)" }}><Icon name="play" size={24} /></span>
            <h1 className="display" style={{ fontSize: 38 }}>On Screen</h1>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 8, maxWidth: 560 }}>
            The film and the series in one place. Paste your own streaming links and they'll be saved here next to each title.
          </p>
        </div>
        <Badge tone={linkedCount ? "green" : "default"} style={{ fontSize: 11, padding: "6px 11px" }}>
          {linkedCount ? <><Icon name="check" size={12} sw={2.4} /> {linkedCount} link{linkedCount > 1 ? "s" : ""} saved</> : "No links yet"}
        </Badge>
      </div>

      {featured && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", marginBottom: 44 }}>
          <ScreenCard item={featured} watch={watch} onSave={onSave} featured />
        </div>
      )}
      <Group title="The Series" sub="Netflix / streaming run" items={netflix} />
      <Group title="Born Again" sub="The reborn era" items={bornagain} />
      <Group title="The Movie" sub="2003 theatrical" items={film} />
    </div>
  );
};
