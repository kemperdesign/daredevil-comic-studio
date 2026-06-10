import React from 'react';
import { DDR_SERIES, DDR_ARCS, DDR_ISSUES, DDR_byPub, DDR_byTL } from './data';
import { Icon, DevilMark, Ring, Badge, fmtDate, fmtDateLong } from './components';
import { CoverImg, CoverCard, RowItem } from './cards';
import { getPdf } from './storage';

export const SORT = { PUB: "pub", TL: "tl" };

const SegToggle = ({ options, value, onChange, size = "md" }) => (
  <div style={{ display: "inline-flex", background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 6, padding: 3, gap: 2 }}>
    {options.map((o) => {
      const active = o.value === value;
      return (
        <button key={o.value} onClick={() => onChange(o.value)} title={o.title || o.label}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7, padding: size === "sm" ? "6px 10px" : "8px 14px",
            borderRadius: 4, fontFamily: "var(--head)", fontWeight: 600, fontSize: size === "sm" ? 12 : 13,
            letterSpacing: ".06em", textTransform: "uppercase",
            background: active ? "var(--red)" : "transparent",
            color: active ? "#fff" : "var(--muted)",
            boxShadow: active ? "0 6px 16px -8px var(--red-glow)" : "none", transition: "all .2s",
          }}>
          {o.icon && <Icon name={o.icon} size={15} />} {o.label}
        </button>
      );
    })}
  </div>
);

// ---- Continue-reading shelf ----
const ContinueShelf = ({ items, getSt, onOpen, onRead }) => {
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 46 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <h2 className="display" style={{ fontSize: 26, color: "var(--paper)" }}>Continue Reading</h2>
        <span className="eyebrow" style={{ color: "var(--red)" }}>Pick up where you left off</span>
      </div>
      <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x proximity" }}>
        {items.map((iss) => {
          const st = getSt(iss);
          const pct = Math.round((st.page || 0) / (iss.pages - 1) * 100);
          return (
            <button key={iss.id} onClick={() => onRead(iss)} style={{
              position: "relative", flex: "0 0 auto", width: 300, height: 168, borderRadius: 8, overflow: "hidden",
              textAlign: "left", border: "1px solid var(--line)", scrollSnapAlign: "start",
              background: "var(--ink-3)", boxShadow: "var(--shadow)",
            }}>
              <div style={{ position: "absolute", inset: 0, opacity: .34 }}><CoverImg iss={iss} style={{ objectPosition: "center 28%" }} /></div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, var(--ink) 30%, transparent), linear-gradient(0deg, var(--ink), transparent 60%)" }} />
              <div style={{ position: "relative", height: "100%", padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Badge tone="red">{DDR_SERIES[iss.s].short} · {iss.no}</Badge>
                  <Ring value={pct / 100} size={40} sw={3.4}><span style={{ fontSize: 10, fontWeight: 700, color: "var(--red)" }}>{pct}%</span></Ring>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 19, lineHeight: 1.1 }}>{iss.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, color: "var(--paper)" }}>
                    <Icon name="play" size={13} /><span style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>Resume · pg {(st.page || 0) + 1}/{iss.pages}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export const Library = ({ state, helpers }) => {
  const { getSt, onOpen, onRead } = helpers;
  const [sort, setSort] = React.useState(state.ui.sort || SORT.PUB);
  const [vmode, setVmode] = React.useState(state.ui.vmode || "grid");
  const [group, setGroup] = React.useState(state.ui.group || "none");
  const [q, setQ] = React.useState("");
  const [filters, setFilters] = React.useState({ series: "all", decade: "all", fav: false, unread: false });
  const [showFilters, setShowFilters] = React.useState(false);

  // persist ui choices
  React.useEffect(() => { helpers.setUi({ sort, vmode, group }); }, [sort, vmode, group]);

  const tlOrder = state.tlOrder;
  // Filter to only uploaded issues, sorted by publication order
  let issues = DDR_byPub().filter((iss) => state.localFiles?.includes(iss.id));

  // filter
  const ql = q.trim().toLowerCase();
  issues = issues.filter((iss) => {
    const st = getSt(iss);
    if (filters.series !== "all" && iss.s !== filters.series) return false;
    if (filters.decade !== "all" && iss.date.slice(0, 3) + "0" !== filters.decade) return false;
    if (filters.fav && !st.fav) return false;
    if (filters.unread && st.read) return false;
    if (ql) {
      const hay = `${iss.title} ${iss.writer} ${iss.penciller} ${DDR_SERIES[iss.s].name} ${iss.no} ${DDR_ARCS[iss.arc] || ""}`.toLowerCase();
      if (!hay.includes(ql)) return false;
    }
    return true;
  });

  const continueItems = DDR_byPub().filter((iss) => { const st = getSt(iss); return state.localFiles?.includes(iss.id) && st.page > 0 && !st.read; })
    .sort((a, b) => (getSt(b).ts || 0) - (getSt(a).ts || 0)).slice(0, 6);

  const downloadPdf = async (iss) => {
    try {
      const pdfBlob = await getPdf(iss.id);
      if (!pdfBlob) return;
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${iss.title.replace(/[/\\?%*:|"<>]/g, '')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  // grouping
  let groups;
  if (group === "series") {
    const order = Object.keys(DDR_SERIES);
    const m = {};
    issues.forEach((iss) => { (m[iss.s] = m[iss.s] || []).push(iss); });
    groups = order.filter((k) => m[k]).map((k) => ({ key: k, label: DDR_SERIES[k].name + " · " + DDR_SERIES[k].vol.replace(/.*· /, ""), sub: DDR_SERIES[k].vol, items: m[k] }));
  } else if (group === "arc") {
    const m = {};
    issues.forEach((iss) => { (m[iss.arc] = m[iss.arc] || []).push(iss); });
    groups = Object.keys(DDR_ARCS).filter((k) => m[k]).map((k) => ({ key: k, label: DDR_ARCS[k], sub: "Story Arc", items: m[k] }));
  } else if (group === "decade") {
    const m = {};
    issues.forEach((iss) => { const dec = iss.date.slice(0, 3) + "0s"; (m[dec] = m[dec] || []).push(iss); });
    groups = Object.keys(m).sort().map((k) => ({ key: k, label: k, sub: "Era", items: m[k] }));
  } else {
    groups = [{ key: "all", label: null, items: issues }];
  }

  const seriesOpts = [{ v: "all", l: "All series" }, ...Object.keys(DDR_SERIES).map((k) => ({ v: k, l: DDR_SERIES[k].name + " (" + DDR_SERIES[k].vol.replace(/.*· /, "").replace(" Mini", "") + ")" }))];
  const decades = [...new Set(DDR_ISSUES.map((i) => i.date.slice(0, 3) + "0"))].sort();
  const activeFilterCount = (filters.series !== "all") + (filters.decade !== "all") + filters.fav + filters.unread;

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 80 }}>
      <ContinueShelf items={continueItems} getSt={getSt} onOpen={onOpen} onRead={onRead} />

      {/* toolbar */}
      <div style={{ position: "sticky", top: 64, zIndex: 30, background: "linear-gradient(var(--ink) 70%, transparent)", paddingBottom: 14, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 16 }}>
          <div>
            <h1 className="display" style={{ fontSize: 32 }}>My Library</h1>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Uploaded PDFs in publication order</p>
          </div>
          <span style={{ color: "var(--muted-2)", fontSize: 14, marginLeft: "auto" }}>{issues.length} issues</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {/* sort: the headline feature */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontFamily: "var(--head)", fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted-2)", paddingLeft: 2 }}>Order by</span>
            <SegToggle value={sort} onChange={setSort} options={[
              { value: SORT.PUB, label: "Publication", icon: "clock", title: "Sort by cover date" },
              { value: SORT.TL, label: "Timeline", icon: "timeline", title: "In-story chronological order" },
            ]} />
          </div>

          <div style={{ flex: 1, minWidth: 180, position: "relative", alignSelf: "flex-end" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }}><Icon name="search" size={17} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, creator, arc…"
              style={{
                width: "100%", padding: "10px 12px 10px 38px", background: "var(--ink-2)", border: "1px solid var(--line)",
                borderRadius: 6, color: "var(--paper)", fontSize: 14, outline: "none",
              }} />
          </div>

          <div style={{ alignSelf: "flex-end", display: "flex", gap: 10 }}>
            <button onClick={() => setShowFilters((v) => !v)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 6,
              background: showFilters || activeFilterCount ? "var(--ink-4)" : "var(--ink-2)", border: `1px solid ${activeFilterCount ? "var(--red-deep)" : "var(--line)"}`,
              color: "var(--paper)", fontFamily: "var(--head)", fontWeight: 600, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase",
            }}>
              <Icon name="filter" size={15} /> Filter {activeFilterCount > 0 && <span style={{ background: "var(--red)", color: "#fff", borderRadius: 10, fontSize: 11, padding: "1px 6px" }}>{activeFilterCount}</span>}
            </button>
            <SegToggle size="sm" value={vmode} onChange={setVmode} options={[
              { value: "grid", label: "", icon: "grid", title: "Grid" },
              { value: "list", label: "", icon: "rows", title: "List" },
            ]} />
          </div>
        </div>

        {/* filter drawer */}
        {showFilters && (
          <div className="fade-up" style={{ marginTop: 12, padding: 16, background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 8, display: "flex", gap: 22, flexWrap: "wrap", alignItems: "flex-end" }}>
            <FilterSelect label="Series" value={filters.series} onChange={(v) => setFilters((f) => ({ ...f, series: v }))} options={seriesOpts} />
            <FilterSelect label="Decade" value={filters.decade} onChange={(v) => setFilters((f) => ({ ...f, decade: v }))} options={[{ v: "all", l: "All decades" }, ...decades.map((d) => ({ v: d, l: d + "s" }))]} />
            <div>
              <span style={fLabel}>Group by</span>
              <SegToggle size="sm" value={group} onChange={setGroup} options={[
                { value: "none", label: "None" }, { value: "series", label: "Series" }, { value: "arc", label: "Arc" }, { value: "decade", label: "Era" },
              ]} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Toggle active={filters.fav} onClick={() => setFilters((f) => ({ ...f, fav: !f.fav }))} icon="star" label="Favorites" tone="gold" />
              <Toggle active={filters.unread} onClick={() => setFilters((f) => ({ ...f, unread: !f.unread }))} icon="book" label="Unread" tone="red" />
            </div>
            {activeFilterCount > 0 && <button onClick={() => setFilters({ series: "all", decade: "all", fav: false, unread: false })} style={{ color: "var(--muted)", fontSize: 13, textDecoration: "underline", alignSelf: "center" }}>Clear all</button>}
          </div>
        )}
      </div>

      {/* groups */}
      {groups.map((g) => (
        <section key={g.key} style={{ marginBottom: 40 }}>
          {g.label && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 0 20px" }}>
              <span style={{ width: 4, height: 26, background: g.key && DDR_SERIES[g.key] ? DDR_SERIES[g.key].accent : "var(--red)", borderRadius: 2 }} />
              <h2 className="head" style={{ fontSize: 22, fontWeight: 600 }}>{g.label}</h2>
              {g.sub && <span className="eyebrow">{g.sub}</span>}
              <span style={{ color: "var(--muted-2)", fontSize: 13, marginLeft: "auto" }}>{g.items.length}</span>
            </div>
          )}
          {vmode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "28px 22px" }}>
              {g.items.map((iss, i) => (
                <div key={iss.id} style={{ position: "relative" }}>
                  <CoverCard iss={iss} st={getSt(iss)} onOpen={onOpen} onRead={onRead} index={i} />
                  <button onClick={() => downloadPdf(iss)} title="Download PDF" style={{
                    position: "absolute", bottom: 8, left: 8, width: 32, height: 32, borderRadius: 6,
                    background: "rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.2)", color: "#fff",
                    display: "grid", placeItems: "center", cursor: "pointer", transition: "background .2s",
                    zIndex: 5,
                  }} onMouseEnter={(e) => e.target.style.background = "rgba(0,0,0,.8)"} onMouseLeave={(e) => e.target.style.background = "rgba(0,0,0,.6)"}>
                    <Icon name="arrowR" size={16} style={{ transform: "rotate(-90deg)" }} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {g.items.map((iss, i) => (
                <div key={iss.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <RowItem iss={iss} st={getSt(iss)} onOpen={onOpen} onRead={onRead} showTL={sort === SORT.TL} index={i} />
                  </div>
                  <button onClick={() => downloadPdf(iss)} title="Download PDF" style={{
                    width: 38, height: 38, borderRadius: 5, display: "grid", placeItems: "center",
                    background: "var(--ink-4)", color: "#fff", transition: "background .2s", cursor: "pointer",
                  }} onMouseEnter={(e) => e.target.style.background = "var(--red)"} onMouseLeave={(e) => e.target.style.background = "var(--ink-4)"}>
                    <Icon name="arrowR" size={16} style={{ transform: "rotate(-90deg)" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {issues.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--muted-2)" }}>
          <div style={{ opacity: .4, marginBottom: 12, display: "flex", justifyContent: "center" }}><DevilMark size={48} color="var(--ink-4)" /></div>
          <p>No issues match your filters.</p>
        </div>
      )}
    </div>
  );
};

const fLabel = { display: "block", fontFamily: "var(--head)", fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 6 };
const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <span style={fLabel}>{label}</span>
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        appearance: "none", padding: "9px 34px 9px 12px", background: "var(--ink-3)", border: "1px solid var(--line)",
        borderRadius: 6, color: "var(--paper)", fontSize: 13.5, outline: "none", cursor: "pointer", minWidth: 150,
      }}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}><Icon name="chevDown" size={15} /></span>
    </div>
  </div>
);
const Toggle = ({ active, onClick, icon, label, tone }) => {
  const c = tone === "gold" ? "var(--gold)" : "var(--red)";
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 13px", borderRadius: 6,
      background: active ? (tone === "gold" ? "rgba(224,165,46,.16)" : "rgba(214,32,43,.16)") : "var(--ink-3)",
      border: `1px solid ${active ? c : "var(--line)"}`, color: active ? c : "var(--muted)",
      fontFamily: "var(--head)", fontWeight: 600, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase", transition: "all .18s",
    }}><Icon name={icon} size={15} fill={active && icon === "star" ? c : "none"} stroke={c} /> {label}</button>
  );
};
