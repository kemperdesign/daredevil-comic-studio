import React from 'react';
import { DDR_ISSUES, DDR_UPCOMING, DDR_SERIES } from './data';
import { loadState, saveState, DevilMark, Icon, Badge } from './components';
import { Library } from './library';
import { TimelineArrange } from './timeline';
import { Releases, bucketOf } from './releases';
import { ScreenView } from './screen';
import { IssueDetail } from './detail';
import { Reader } from './reader';

// at startup, re-hydrate any owned upcoming issues into the library array
function hydrateOwned(state) {
  (state.owned || []).forEach((id) => {
    if (!DDR_ISSUES.find((x) => x.id === id)) {
      const up = DDR_UPCOMING.find((x) => x.id === id);
      if (up) DDR_ISSUES.push(up);
    }
  });
}

const NAV = [
  { key: "library", label: "Library", icon: "home" },
  { key: "timeline", label: "Timeline", icon: "timeline" },
  { key: "releases", label: "Releases", icon: "book" },
  { key: "screen", label: "On Screen", icon: "play" },
];

function App() {
  const [state, setState] = React.useState(() => {
    const s = loadState();
    const seeded = s.progress ? s : {
      // first-run demo so the experience is populated on open
      progress: {
        v6_1: { page: 8, ts: Date.now() - 6e5 },
        born227: { page: 4, ts: Date.now() - 36e5 },
        v3_1: { page: 22, read: true, ts: Date.now() - 9e7 },
        v1_1: { read: true, page: 22, fav: true, ts: Date.now() - 8e7 },
        mwf1: { fav: true, ts: Date.now() - 1e8 },
        yel1: { read: true, page: 21, ts: Date.now() - 7e7 },
      },
    };
    return {
      progress: seeded.progress || {},      // id -> {page, read, fav, ts}
      tlOrder: s.tlOrder || [],            // custom timeline order (ids)
      owned: s.owned || [],                // owned upcoming-issue ids (base set always owned)
      pull: s.pull || [],                  // pull-list ids
      following: s.following || ["v8"],    // followed series keys
      watch: s.watch || {},                // screen id -> url
      ui: s.ui || {},                      // sort/vmode/group/readMode/fit
    };
  });
  const [route, setRoute] = React.useState({ name: "library" });   // {name, iss}
  const [reader, setReader] = React.useState(null);                // issue being read
  const [importOpen, setImportOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  // hydrate owned-upcoming once
  React.useEffect(() => { hydrateOwned(state); /* eslint-disable-next-line */ }, []);
  // persist
  React.useEffect(() => { saveState(state); }, [state]);

  const flash = (msg) => { setToast(msg); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2400); };

  // ---- state helpers ----
  const getSt = (iss) => state.progress[iss.id] || {};
  const patchSt = (iss, patch) => setState((s) => ({ ...s, progress: { ...s.progress, [iss.id]: { ...(s.progress[iss.id] || {}), ...patch, ts: Date.now() } } }));

  const helpers = {
    getSt,
    onOpen: (iss) => { setRoute({ name: "detail", iss }); window.scrollTo(0, 0); },
    onOpenUpcoming: (iss) => { setRoute({ name: "detail", iss }); window.scrollTo(0, 0); },
    onRead: (iss) => setReader(iss),
    exitReader: () => setReader(null),
    goLibrary: () => { setRoute({ name: "library" }); window.scrollTo(0, 0); },
    goTimeline: () => { setRoute({ name: "timeline" }); window.scrollTo(0, 0); },
    goReleases: () => { setRoute({ name: "releases" }); window.scrollTo(0, 0); },
    toggle: (iss, key) => {
      const cur = getSt(iss);
      if (key === "read") patchSt(iss, { read: !cur.read, page: !cur.read ? iss.pages - 1 : cur.page });
      else patchSt(iss, { [key]: !cur[key] });
      flash(key === "fav" ? (cur.fav ? "Removed from favorites" : "Added to favorites") : (cur.read ? "Marked unread" : "Marked as read"));
    },
    setProgress: (iss, page) => { const cur = getSt(iss); patchSt(iss, { page, read: page >= iss.pages - 1 ? true : cur.read }); },
    setTlOrder: (order) => { setState((s) => ({ ...s, tlOrder: order })); flash("Timeline order saved"); },
    setUi: (patch) => setState((s) => ({ ...s, ui: { ...s.ui, ...patch } })),
    // releases / pull list
    isOwned: (iss) => !DDR_UPCOMING.includes(iss) || state.owned.includes(iss.id),
    isPulled: (iss) => state.pull.includes(iss.id),
    isFollowing: (k) => state.following.includes(k),
    addOwned: (iss) => {
      if (!DDR_ISSUES.find((x) => x.id === iss.id)) DDR_ISSUES.push(iss);
      setState((s) => ({ ...s, owned: [...new Set([...s.owned, iss.id])], pull: s.pull.filter((p) => p !== iss.id) }));
      flash(`${iss.title} added to library`);
    },
    togglePull: (iss) => {
      setState((s) => ({ ...s, pull: s.pull.includes(iss.id) ? s.pull.filter((p) => p !== iss.id) : [...s.pull, iss.id] }));
      flash(state.pull.includes(iss.id) ? "Removed from pull list" : "Added to pull list");
    },
    toggleFollow: (k) => setState((s) => ({ ...s, following: s.following.includes(k) ? s.following.filter((f) => f !== k) : [...s.following, k] })),
    setWatch: (id, url) => { setState((s) => { const w = { ...s.watch }; if (url) w[id] = url; else delete w[id]; return { ...s, watch: w }; }); flash(url ? "Watch link saved" : "Link removed"); },
    openImport: () => setImportOpen(true),
  };

  // releases "new" count for the nav badge
  const newCount = DDR_UPCOMING.filter((iss) => {
    if (helpers.isOwned(iss)) return false;
    return bucketOf(iss) === "onsale" || helpers.isPulled(iss);
  }).length;

  return (
    <div className="app-shell">
      <TopNav route={route} setRoute={setRoute} helpers={helpers} newCount={newCount} />
      <main style={{ flex: 1 }}>
        {route.name === "library" && <Library key="lib" state={state} helpers={helpers} />}
        {route.name === "timeline" && <TimelineArrange state={state} helpers={helpers} />}
        {route.name === "releases" && <Releases state={state} helpers={helpers} />}
        {route.name === "screen" && <ScreenView state={state} helpers={helpers} />}
        {route.name === "detail" && <IssueDetail iss={route.iss} state={state} helpers={helpers} />}
      </main>
      {reader && <Reader iss={reader} state={state} helpers={helpers} />}
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
      {toast && <Toast msg={toast} />}
      <Footer />
    </div>
  );
}

// ---- top navigation ----
const TopNav = ({ route, setRoute, helpers, newCount }) => {
  const active = route.name === "detail" ? "library" : route.name;
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100, height: 64, display: "flex", alignItems: "center",
      background: "rgba(7,7,8,.86)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 28, width: "100%" }}>
        <button onClick={() => helpers.goLibrary()} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <DevilMark size={28} />
          <div style={{ textAlign: "left", lineHeight: 1 }}>
            <div className="display" style={{ fontSize: 19, letterSpacing: "0", whiteSpace: "nowrap" }}>Hell's Kitchen</div>
            <div style={{ fontFamily: "var(--head)", fontSize: 9.5, letterSpacing: ".26em", textTransform: "uppercase", color: "var(--red)", marginTop: 3 }}>Comic Studio</div>
          </div>
        </button>
        <nav style={{ display: "flex", gap: 4, marginLeft: 8 }} className="main-nav">
          {NAV.map((n) => {
            const on = active === n.key;
            return (
              <button key={n.key} onClick={() => { setRoute({ name: n.key }); window.scrollTo(0, 0); }} style={{
                position: "relative", display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 7,
                background: on ? "var(--ink-3)" : "transparent", color: on ? "var(--paper)" : "var(--muted)",
                fontFamily: "var(--head)", fontWeight: 600, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", transition: "all .18s",
              }}>
                <Icon name={n.icon} size={16} /> {n.label}
                {n.key === "releases" && newCount > 0 && (
                  <span style={{ position: "absolute", top: 3, right: 4, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: "var(--red)", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", boxShadow: "0 0 0 2px var(--ink)" }}>{newCount}</span>
                )}
                {on && <span style={{ position: "absolute", left: 14, right: 14, bottom: -1, height: 2, background: "var(--red)" }} />}
              </button>
            );
          })}
        </nav>
        <button onClick={helpers.openImport} style={{
          marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 7,
          background: "var(--red)", color: "#fff", fontFamily: "var(--head)", fontWeight: 600, fontSize: 13.5, letterSpacing: ".05em",
          textTransform: "uppercase", boxShadow: "0 8px 22px -10px var(--red-glow)",
        }}><Icon name="plus" size={16} /> Add comics</button>
      </div>
    </header>
  );
};

// ---- import modal (mocked file ingest) ----
const ImportModal = ({ onClose }) => {
  const [stage, setStage] = React.useState("drop"); // drop | scanning | done
  const [drag, setDrag] = React.useState(false);
  const startScan = () => {
    setStage("scanning");
    setTimeout(() => setStage("done"), 2200);
  };
  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} className="fade-up" style={{ width: "min(560px, 92vw)", background: "var(--ink-2)", border: "1px solid var(--line-2)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><DevilMark size={22} /><h3 className="head" style={{ fontSize: 19, fontWeight: 600 }}>Add comics to your library</h3></div>
          <button onClick={onClose} style={{ color: "var(--muted)" }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>
          {stage === "drop" && (
            <>
              <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); startScan(); }} onClick={startScan}
                style={{
                  border: `2px dashed ${drag ? "var(--red)" : "var(--line-2)"}`, borderRadius: 12, padding: "44px 24px", textAlign: "center",
                  background: drag ? "rgba(214,32,43,.06)" : "var(--ink)", cursor: "pointer", transition: "all .18s",
                }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, color: drag ? "var(--red)" : "var(--muted-2)" }}><Icon name="plus" size={40} sw={1.4} /></div>
                <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 18 }}>Drop CBR or PDF files here</div>
                <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 6 }}>or click to browse — we'll scan online to match covers, creators &amp; dates</div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
                {["CBR", "CBZ", "PDF"].map((f) => <Badge key={f}>{f}</Badge>)}
              </div>
            </>
          )}
          {stage === "scanning" && (
            <div style={{ textAlign: "center", padding: "32px 10px" }}>
              <div style={{ margin: "0 auto 20px", width: 54, height: 54, borderRadius: "50%", border: "3px solid var(--line)", borderTopColor: "var(--red)", animation: "spin 0.8s linear infinite" }} />
              <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 17 }}>Matching metadata online…</div>
              <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 6 }}>Reading covers, identifying issues, pulling creators and dates.</div>
            </div>
          )}
          {stage === "done" && (
            <div style={{ textAlign: "center", padding: "28px 10px" }}>
              <div style={{ margin: "0 auto 18px", width: 54, height: 54, borderRadius: "50%", background: "rgba(62,166,106,.16)", border: "1px solid var(--green)", display: "grid", placeItems: "center", color: "var(--green)" }}><Icon name="check" size={28} sw={2.4} /></div>
              <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 18 }}>Demo library is already loaded</div>
              <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 8, lineHeight: 1.55, maxWidth: 380, marginInline: "auto" }}>
                This is a design prototype — your real CBR/PDF files would import and auto-match here. The collection you see is sample data to show the experience.
              </p>
              <button onClick={onClose} style={{ marginTop: 20, padding: "11px 24px", borderRadius: 7, background: "var(--red)", color: "#fff", fontFamily: "var(--head)", fontWeight: 600, fontSize: 14, letterSpacing: ".05em", textTransform: "uppercase" }}>Browse the collection</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ msg }) => (
  <div className="fade-up" style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 300, padding: "12px 20px", background: "var(--ink-4)", border: "1px solid var(--line-2)", borderRadius: 8, boxShadow: "var(--shadow)", display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
    <span style={{ color: "var(--red)" }}><DevilMark size={16} /></span>{msg}
  </div>
);

const Footer = () => (
  <footer style={{ borderTop: "1px solid var(--line)", padding: "26px 0", marginTop: 10 }}>
    <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", color: "var(--muted-2)", fontSize: 12.5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><DevilMark size={18} color="var(--ink-4)" /> Hell's Kitchen Comic Studio · personal reader</div>
      <div>A design prototype · sample data · original artwork</div>
    </div>
  </footer>
);

const overlay = { position: "fixed", inset: 0, zIndex: 250, background: "rgba(4,4,5,.78)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 };

export default App;
