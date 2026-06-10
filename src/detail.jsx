import React from 'react';
import { DDR_SERIES, DDR_ARCS, DDR_ISSUES, DDR_byTL, DDR_ext } from './data';
import { Icon, Badge, fmtDate, fmtDateLong } from './components';
import { CoverImg } from './cards';
import { savePdf } from './storage';

const CreditRow = ({ k, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
    <span style={{ fontFamily: "var(--head)", fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted-2)" }}>{k}</span>
    <span style={{ fontSize: 14, color: "var(--paper)", textAlign: "right", fontWeight: 500 }}>{v}</span>
  </div>
);

export const IssueDetail = ({ iss, state, helpers }) => {
  const series = DDR_SERIES[iss.s];
  const st = helpers.getSt(iss);
  const ext = DDR_ext(iss);
  const pct = st.page > 0 ? Math.round((st.page || 0) / (iss.pages - 1) * 100) : 0;
  const inProgress = st.page > 0 && !st.read;
  const hasLocal = state.localFiles?.includes(iss.id);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await savePdf(iss.id, file);
      helpers.addLocalFile(iss.id);
    } catch(err) {
      console.error(err);
      alert("Failed to save PDF");
    }
  };

  // siblings in same series for the "More from this series" rail
  const siblings = DDR_ISSUES.filter((x) => x.s === iss.s && x.id !== iss.id).slice(0, 6);
  const tlAll = DDR_byTL(state.tlOrder);
  const tlIndex = tlAll.findIndex((x) => x.id === iss.id);
  const prevTL = tlAll[tlIndex - 1], nextTL = tlAll[tlIndex + 1];

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* hero band */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: .22 }}><CoverImg iss={iss} style={{ objectPosition: "center 22%", filter: "blur(6px) saturate(1.1)" }} /></div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, var(--ink), rgba(7,7,8,.65) 55%, rgba(7,7,8,.85))" }} />
        <div className="wrap" style={{ position: "relative", paddingTop: 34, paddingBottom: 40 }}>
          <button onClick={() => helpers.goLibrary()} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontFamily: "var(--head)", fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 26 }}>
            <Icon name="chevL" size={16} /> Back to collection
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 44, alignItems: "start" }} className="detail-grid">
            {/* cover */}
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "var(--shadow), 0 0 0 1px var(--line)", aspectRatio: "2/3" }}>
                <CoverImg iss={iss} />
              </div>
              {inProgress && (
                <div style={{ position: "absolute", left: -10, top: 18, background: "var(--red)", color: "#fff", padding: "6px 12px", borderRadius: 4, fontFamily: "var(--head)", fontWeight: 600, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", boxShadow: "var(--shadow-red)" }}>
                  {pct}% · pg {(st.page || 0) + 1}
                </div>
              )}
            </div>
            {/* meta */}
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <Badge tone="solid">{series.name}</Badge>
                <Badge>{series.vol}</Badge>
                {DDR_ARCS[iss.arc] && <Badge tone="red"><Icon name="layers" size={11} /> {DDR_ARCS[iss.arc]}</Badge>}
              </div>
              <h1 className="display" style={{ fontSize: "clamp(38px,5vw,62px)", marginBottom: 6 }}>{iss.title}</h1>
              <div style={{ fontFamily: "var(--head)", fontWeight: 500, fontSize: 19, color: "var(--muted)", marginBottom: 22 }}>
                {series.name} {iss.no} · {fmtDateLong(iss.date)}
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "#d9d6cf", maxWidth: 620, marginBottom: 26 }}>{iss.synopsis}</p>

              {/* quick credits */}
              <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginBottom: 28 }}>
                {[["Writer", iss.writer], ["Penciller", iss.penciller], ["Cover", iss.cover]].map(([k, v]) => (
                  <div key={k}>
                    <div className="eyebrow" style={{ marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 16 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* actions */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => helpers.onRead(iss)} style={{
                  display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 30px", background: "var(--red)", color: "#fff",
                  borderRadius: 6, fontFamily: "var(--head)", fontWeight: 600, fontSize: 16, letterSpacing: ".06em", textTransform: "uppercase",
                  boxShadow: "var(--shadow-red)",
                }}><Icon name="play" size={18} /> {inProgress ? "Resume reading" : "Read now"}</button>
                <ActionBtn active={st.fav} onClick={() => helpers.toggle(iss, "fav")} icon="star" label={st.fav ? "Favorited" : "Favorite"} tone="gold" />
                <ActionBtn active={st.read} onClick={() => helpers.toggle(iss, "read")} icon="check" label={st.read ? "Read" : "Mark read"} tone="green" />
                
                {/* Upload Button */}
                <label style={{
                  display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 20px", borderRadius: 6,
                  background: hasLocal ? "rgba(62,166,106,.16)" : "var(--ink-3)",
                  border: `1px solid ${hasLocal ? "var(--green)" : "var(--line)"}`, color: hasLocal ? "var(--green)" : "var(--paper)",
                  fontFamily: "var(--head)", fontWeight: 600, fontSize: 14, letterSpacing: ".05em", textTransform: "uppercase", transition: "all .18s",
                  cursor: "pointer"
                }}>
                  <input type="file" accept="application/pdf" style={{ display: "none" }} onChange={handleUpload} />
                  <Icon name={hasLocal ? "check" : "plus"} size={16} /> {hasLocal ? "PDF Saved" : "Upload PDF"}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* details + sidebar */}
      <div className="wrap" style={{ paddingTop: 40, display: "grid", gridTemplateColumns: "1fr 360px", gap: 50, alignItems: "start" }} >
        <div className="detail-main">
          {/* timeline placement */}
          <SectionTitle icon="timeline" title="Timeline placement" sub="Where this sits in your in-story reading order" />
          <div style={{ display: "flex", alignItems: "stretch", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <TLChip iss={prevTL} role="Before" helpers={helpers} />
            <div style={{ flex: "0 0 auto", minWidth: 150, padding: "16px 22px", background: "linear-gradient(135deg, var(--red-deep), var(--ink-3))", border: "1px solid var(--red-deep)", borderRadius: 8, textAlign: "center" }}>
              <div className="eyebrow" style={{ color: "#ffb3b8" }}>Timeline #{tlIndex + 1}</div>
              <div className="display" style={{ fontSize: 30, marginTop: 4 }}>This Issue</div>
            </div>
            <TLChip iss={nextTL} role="After" helpers={helpers} />
          </div>
          <button onClick={() => helpers.goTimeline()} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--red)", fontFamily: "var(--head)", fontWeight: 600, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 38 }}>
            <Icon name="drag" size={15} /> Rearrange timeline
          </button>

          {/* extended credits */}
          <SectionTitle icon="info" title="Extended credits & info" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 44px" }} className="credits-grid">
            <div>
              <CreditRow k="Writer" v={iss.writer} />
              <CreditRow k="Penciller" v={iss.penciller} />
              <CreditRow k="Inker" v={ext.inker} />
              <CreditRow k="Colorist" v={ext.colorist} />
              <CreditRow k="Letterer" v={ext.letterer} />
              <CreditRow k="Editor" v={ext.editor} />
            </div>
            <div>
              <CreditRow k="Cover Artist" v={iss.cover} />
              <CreditRow k="Rating" v={ext.rating} />
              <CreditRow k="Format" v="Comic" />
              <CreditRow k="Page Count" v={iss.pages} />
              <CreditRow k="Price" v={ext.price} />
              <CreditRow k="UPC" v={ext.upc} />
            </div>
          </div>
          <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(62,166,106,.08)", border: "1px solid rgba(62,166,106,.25)", borderRadius: 6, color: "#7fcb9e", fontSize: 12.5 }}>
            <Icon name="check" size={14} sw={2.4} /> Metadata auto-matched from online sources
          </div>
        </div>

        {/* sidebar: more from series */}
        <aside>
          <SectionTitle icon="layers" title={"More from " + series.short} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {siblings.length ? siblings.map((s) => (
              <button key={s.id} onClick={() => helpers.onOpen(s)} style={{ display: "flex", gap: 12, alignItems: "center", padding: 8, borderRadius: 6, textAlign: "left", background: "transparent", border: "1px solid transparent", transition: "background .16s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink-3)"; e.currentTarget.style.borderColor = "var(--line)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                <div style={{ width: 46, height: 66, borderRadius: 3, overflow: "hidden", flexShrink: 0, boxShadow: "0 4px 12px -4px #000" }}><CoverImg iss={s} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-2)" }}>{s.no} · {fmtDate(s.date)}</div>
                </div>
              </button>
            )) : <p style={{ color: "var(--muted-2)", fontSize: 14 }}>This is the only issue from this series in your library.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title, sub }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color: "var(--red)" }}><Icon name={icon} size={18} /></span>
      <h3 className="head" style={{ fontSize: 18, fontWeight: 600, letterSpacing: ".01em" }}>{title}</h3>
    </div>
    {sub && <p style={{ color: "var(--muted-2)", fontSize: 13, marginTop: 5, marginLeft: 28 }}>{sub}</p>}
  </div>
);

const TLChip = ({ iss, role, helpers }) => {
  if (!iss) return <div style={{ flex: 1, minWidth: 130, display: "grid", placeItems: "center", padding: 16, border: "1px dashed var(--line)", borderRadius: 8, color: "var(--muted-2)", fontSize: 13 }}>{role === "Before" ? "Start of timeline" : "End of timeline"}</div>;
  return (
    <button onClick={() => helpers.onOpen(iss)} style={{ flex: 1, minWidth: 150, display: "flex", gap: 11, alignItems: "center", padding: 12, background: "var(--ink-3)", border: "1px solid var(--line)", borderRadius: 8, textAlign: "left" }}>
      <div style={{ width: 38, height: 54, borderRadius: 3, overflow: "hidden", flexShrink: 0 }}><CoverImg iss={iss} /></div>
      <div style={{ minWidth: 0 }}>
        <div className="eyebrow" style={{ fontSize: 9.5 }}>{role}</div>
        <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>{iss.title}</div>
      </div>
    </button>
  );
};

const ActionBtn = ({ active, onClick, icon, label, tone }) => {
  const c = tone === "gold" ? "var(--gold)" : tone === "green" ? "var(--green)" : "var(--red)";
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 20px", borderRadius: 6,
      background: active ? (tone === "gold" ? "rgba(224,165,46,.16)" : "rgba(62,166,106,.16)") : "var(--ink-3)",
      border: `1px solid ${active ? c : "var(--line)"}`, color: active ? c : "var(--paper)",
      fontFamily: "var(--head)", fontWeight: 600, fontSize: 14, letterSpacing: ".05em", textTransform: "uppercase", transition: "all .18s",
    }}><Icon name={icon} size={16} fill={active && icon === "star" ? c : "none"} stroke={c} sw={2} /> {label}</button>
  );
};
