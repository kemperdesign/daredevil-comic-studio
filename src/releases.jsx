import React from 'react';
import { DDR_NOW, DDR_SERIES, DDR_UPCOMING } from './data';
import { Icon, Badge, fmtDate, fmtDateLong } from './components';
import { CoverImg } from './cards';

const DAY = 86400000;
export const daysFromNow = (iso) => Math.round((new Date(iso) - new Date(DDR_NOW)) / DAY);
export const relDate = (iso) => {
  const d = daysFromNow(iso);
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  if (d < 0) return `${-d} days ago`;
  if (d < 7) return `In ${d} days`;
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
// bucket an upcoming issue
export function bucketOf(iss) {
  if (daysFromNow(iss.onsale) <= 0) return "onsale";
  if (daysFromNow(iss.foc) > 0) return "foc";
  return "soon";
}

// status pill for an upcoming issue card
const ReleaseStatus = ({ iss }) => {
  const b = bucketOf(iss);
  if (b === "onsale") return <Badge tone="green"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5cc585" }} /> On sale {relDate(iss.onsale)}</Badge>;
  if (b === "foc") {
    const d = daysFromNow(iss.foc);
    return <Badge tone={d <= 10 ? "red" : "gold"}>{d <= 10 ? "FOC closing " : "FOC "}{relDate(iss.foc)}</Badge>;
  }
  return <Badge tone="default">On sale {relDate(iss.onsale)}</Badge>;
};

const ReleaseCard = ({ iss, helpers, state }) => {
  const owned = helpers.isOwned(iss);
  const pulled = helpers.isPulled(iss);
  const series = DDR_SERIES[iss.s];
  const [hover, setHover] = React.useState(false);
  return (
    <div className="fade-up" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", gap: 16, padding: 14, background: "var(--ink-2)", border: `1px solid ${hover ? "var(--line-2)" : "var(--line)"}`, borderRadius: 10, transition: "border-color .18s" }}>
      <button onClick={() => helpers.onOpenUpcoming(iss)} style={{ width: 92, height: 138, borderRadius: 5, overflow: "hidden", flexShrink: 0, boxShadow: "0 8px 22px -8px #000", position: "relative" }}>
        <CoverImg iss={iss} />
        {owned && <div style={{ position: "absolute", inset: 0, background: "rgba(62,166,106,.2)", display: "grid", placeItems: "center" }}><span style={{ background: "var(--green)", color: "#06210f", borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center" }}><Icon name="check" size={17} sw={2.6} /></span></div>}
      </button>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 17 }}>{iss.title}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{series.name} {iss.no} · {series.vol.replace(/.*· /, "")}</div>
          </div>
          <ReleaseStatus iss={iss} />
        </div>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--muted)", margin: "8px 0 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{iss.synopsis}</p>
        <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 11.5, color: "var(--muted-2)" }}>
          <span><Icon name="clock" size={12} style={{ verticalAlign: -2 }} /> On sale {fmtDateLong(iss.onsale)}</span>
          <span>FOC {fmtDate(iss.foc)}</span>
        </div>
        {/* actions */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 12 }}>
          {owned ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 6, background: "rgba(62,166,106,.14)", border: "1px solid rgba(62,166,106,.4)", color: "#5cc585", fontFamily: "var(--head)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".04em", textTransform: "uppercase" }}>
              <Icon name="check" size={14} sw={2.4} /> In library
            </span>
          ) : (
            <button onClick={() => helpers.addOwned(iss)} style={miniBtn(true)}><Icon name="plus" size={14} /> Add to library</button>
          )}
          {!owned && (
            <button onClick={() => helpers.togglePull(iss)} style={miniBtn(false, pulled)}>
              <Icon name={pulled ? "check" : "book"} size={14} /> {pulled ? "On pull list" : "Pull list"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
const miniBtn = (primary, active) => ({
  display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 6,
  background: primary ? "var(--red)" : active ? "rgba(214,32,43,.14)" : "var(--ink-3)",
  border: `1px solid ${primary ? "var(--red)" : active ? "var(--red-deep)" : "var(--line)"}`,
  color: primary ? "#fff" : active ? "#ff6068" : "var(--paper)",
  fontFamily: "var(--head)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".04em", textTransform: "uppercase",
  boxShadow: primary ? "0 8px 20px -8px var(--red-glow)" : "none",
});

// ---- "New for you" shelf (rendered on the library home) ----
export const NewForYou = ({ state, helpers }) => {
  const items = DDR_UPCOMING.filter((iss) => {
    if (helpers.isOwned(iss)) return false;
    const following = helpers.isFollowing(iss.s);
    const recent = daysFromNow(iss.onsale) <= 14; // dropped within ~2 weeks
    return following || recent;
  }).sort((a, b) => new Date(b.onsale) - new Date(a.onsale)).slice(0, 5);
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 46 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <h2 className="display" style={{ fontSize: 26 }}>New For You</h2>
        <span className="eyebrow" style={{ color: "var(--red)" }}>Fresh issues from series you follow</span>
        <button onClick={() => helpers.goReleases()} style={{ marginLeft: "auto", color: "var(--red)", fontFamily: "var(--head)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".06em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5 }}>All releases <Icon name="arrowR" size={14} /></button>
      </div>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
        {items.map((iss) => {
          const series = DDR_SERIES[iss.s];
          return (
            <div key={iss.id} style={{ flex: "0 0 auto", width: 210, background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => helpers.onOpenUpcoming(iss)} style={{ position: "relative", display: "block", width: "100%", aspectRatio: "2/3" }}>
                <CoverImg iss={iss} />
                <div style={{ position: "absolute", top: 8, left: 8 }}><Badge tone="solid" style={{ fontSize: 9.5 }}>New</Badge></div>
              </button>
              <div style={{ padding: 12 }}>
                <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{iss.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-2)", margin: "2px 0 10px" }}>{series.short} {iss.no} · {relDate(iss.onsale)}</div>
                <button onClick={() => helpers.addOwned(iss)} style={{ ...miniBtn(true), width: "100%", justifyContent: "center", padding: "8px 10px", fontSize: 12 }}><Icon name="plus" size={13} /> Add</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const Releases = ({ state, helpers }) => {
  const ups = DDR_UPCOMING;
  const onsale = ups.filter((i) => bucketOf(i) === "onsale" && !helpers.isOwned(i)).sort((a, b) => new Date(b.onsale) - new Date(a.onsale));
  const soon = ups.filter((i) => bucketOf(i) === "soon").sort((a, b) => new Date(a.onsale) - new Date(b.onsale));
  const foc = ups.filter((i) => bucketOf(i) === "foc").sort((a, b) => new Date(a.foc) - new Date(b.foc));
  const pull = ups.filter((i) => helpers.isPulled(i) && !helpers.isOwned(i));

  // followable series (those with an ongoing/recent presence)
  const followSeries = ["v8", "v7", "v6"].map((k) => ({ k, ...DDR_SERIES[k] }));

  const Col = ({ icon, title, sub, tone, items, empty }) => (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ color: tone }}><Icon name={icon} size={19} /></span>
        <h2 className="head" style={{ fontSize: 21, fontWeight: 600 }}>{title}</h2>
        <span className="eyebrow">{sub}</span>
        <span style={{ marginLeft: "auto", color: "var(--muted-2)", fontSize: 13 }}>{items.length}</span>
      </div>
      {items.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
          {items.map((iss) => <ReleaseCard key={iss.id} iss={iss} helpers={helpers} state={state} />)}
        </div>
      ) : <p style={{ color: "var(--muted-2)", fontSize: 14, padding: "4px 2px" }}>{empty}</p>}
    </section>
  );

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 90 }}>
      <div style={{ marginBottom: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "var(--red)" }}><Icon name="book" size={24} /></span>
          <h1 className="display" style={{ fontSize: 38 }}>Releases</h1>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 8, maxWidth: 600 }}>
          New and upcoming Daredevil, matched from online listings. Reserve issues to your pull list before <strong style={{ color: "var(--paper)" }}>Final Order Cutoff</strong>, then add them to your library when you have the file.
        </p>
      </div>

      {/* follow bar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", padding: 14, background: "var(--ink-2)", border: "1px solid var(--line)", borderRadius: 10, marginBottom: 34 }}>
        <span className="eyebrow" style={{ marginRight: 4 }}>Following</span>
        {followSeries.map((s) => {
          const on = helpers.isFollowing(s.k);
          return (
            <button key={s.k} onClick={() => helpers.toggleFollow(s.k)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 20,
              background: on ? "rgba(214,32,43,.16)" : "var(--ink-3)", border: `1px solid ${on ? "var(--red)" : "var(--line)"}`,
              color: on ? "#ff6068" : "var(--muted)", fontFamily: "var(--head)", fontWeight: 600, fontSize: 13, letterSpacing: ".03em",
            }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.accent }} />
              {s.name} {s.vol.replace(/.*· /, "")} {on && <Icon name="check" size={13} sw={2.4} />}
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted-2)" }}>Followed series surface new issues here and on your home screen.</span>
      </div>

      {pull.length > 0 && <Col icon="book" title="Your Pull List" sub="Reserved" tone="var(--gold)" items={pull} empty="" />}
      <Col icon="play" title="On Sale Now" sub="Available" tone="var(--green)" items={onsale} empty="You're all caught up — nothing new on sale." />
      <Col icon="clock" title="FOC Closing Soon" sub="Reserve before cutoff" tone="var(--red)" items={foc} empty="No order deadlines coming up." />
      <Col icon="arrowR" title="Coming Soon" sub="Solicited" tone="var(--muted)" items={soon} empty="No future issues solicited yet." />
    </div>
  );
};
