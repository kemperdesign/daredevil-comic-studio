import React from 'react';
import { DDR_ISSUES, DDR_SERIES, DDR_ARCS, DDR_byTL, DDR_byPub } from './data';
import { Icon, Badge, fmtDate } from './components';
import { CoverImg } from './cards';

export const TimelineArrange = ({ state, helpers }) => {
  const [order, setOrder] = React.useState(() => DDR_byTL(state.tlOrder).map((i) => i.id));
  const [dragId, setDragId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const [dirty, setDirty] = React.useState(false);

  const byId = React.useMemo(() => Object.fromEntries(DDR_ISSUES.map((i) => [i.id, i])), []);

  const move = (from, to) => {
    setOrder((o) => {
      const n = [...o];
      const [m] = n.splice(from, 1);
      n.splice(to, 0, m);
      return n;
    });
    setDirty(true);
  };

  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    const from = order.indexOf(dragId), to = order.indexOf(targetId);
    move(from, to);
    setDragId(null); setOverId(null);
  };

  const save = () => { helpers.setTlOrder(order); setDirty(false); };
  const reset = () => { setOrder([...DDR_ISSUES].sort((a, b) => a.tl - b.tl).map((i) => i.id)); setDirty(true); };
  const bump = (idx, dir) => { const to = idx + dir; if (to < 0 || to >= order.length) return; move(idx, to); };

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 90 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 8 }}>
        <div>
          <button onClick={() => helpers.goLibrary()} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontFamily: "var(--head)", fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>
            <Icon name="chevL" size={16} /> Back to collection
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "var(--red)" }}><Icon name="timeline" size={26} /></span>
            <h1 className="display" style={{ fontSize: 38 }}>Arrange Timeline</h1>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 8, maxWidth: 560 }}>
            Drag issues into the order they happen <em>in-story</em> — independent of when they were printed. This is the order used when you sort your library by <strong style={{ color: "var(--paper)" }}>Timeline</strong>.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={reset} style={{ padding: "11px 16px", borderRadius: 6, background: "var(--ink-3)", border: "1px solid var(--line)", color: "var(--muted)", fontFamily: "var(--head)", fontWeight: 600, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase" }}>Reset to suggested</button>
          <button onClick={save} disabled={!dirty} style={{
            padding: "11px 22px", borderRadius: 6, background: dirty ? "var(--red)" : "var(--ink-3)", border: `1px solid ${dirty ? "var(--red)" : "var(--line)"}`,
            color: dirty ? "#fff" : "var(--muted-2)", fontFamily: "var(--head)", fontWeight: 600, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase",
            boxShadow: dirty ? "var(--shadow-red)" : "none", cursor: dirty ? "pointer" : "default", transition: "all .2s",
          }}>{dirty ? "Save order" : "Saved"}</button>
        </div>
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 18, alignItems: "center", margin: "22px 0 16px", flexWrap: "wrap", color: "var(--muted-2)", fontSize: 12.5 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Icon name="drag" size={15} /> Drag the handle to reorder</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--red)" }} /> Position = in-story order</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><Icon name="clock" size={14} /> Small date = original print date</span>
      </div>

      {/* list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {order.map((id, idx) => {
          const iss = byId[id];
          const series = DDR_SERIES[iss.s];
          const isDrag = dragId === id, isOver = overId === id;
          return (
            <div key={id}
              draggable
              onDragStart={() => setDragId(id)}
              onDragEnd={() => { setDragId(null); setOverId(null); }}
              onDragOver={(e) => { e.preventDefault(); if (overId !== id) setOverId(id); }}
              onDrop={() => onDrop(id)}
              style={{
                display: "grid", gridTemplateColumns: "54px 30px 50px 1fr auto", gap: 16, alignItems: "center",
                padding: "10px 14px", borderRadius: 8, background: isDrag ? "var(--ink-4)" : "var(--ink-2)",
                border: `1px solid ${isOver ? "var(--red)" : isDrag ? "var(--line-2)" : "var(--line)"}`,
                boxShadow: isOver ? "0 0 0 2px var(--red-glow)" : "none",
                opacity: isDrag ? .5 : 1, transition: "border-color .15s, box-shadow .15s, opacity .15s", cursor: "grab",
              }}>
              {/* position number */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--muted-2)", cursor: "grab" }}><Icon name="drag" size={18} /></span>
                <span className="display" style={{ fontSize: 24, color: "var(--red)", minWidth: 28 }}>{String(idx + 1).padStart(2, "0")}</span>
              </div>
              {/* nudge */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => bump(idx, -1)} disabled={idx === 0} style={nudgeBtn(idx === 0)}><Icon name="chevL" size={13} style={{ transform: "rotate(90deg)" }} /></button>
                <button onClick={() => bump(idx, 1)} disabled={idx === order.length - 1} style={nudgeBtn(idx === order.length - 1)}><Icon name="chevR" size={13} style={{ transform: "rotate(90deg)" }} /></button>
              </div>
              {/* cover */}
              <div style={{ width: 50, height: 72, borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 12px -4px #000" }}><CoverImg iss={iss} /></div>
              {/* meta */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{iss.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", gap: 10, flexWrap: "wrap", marginTop: 3 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: series.accent }} />{series.name} {iss.no}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--muted-2)" }}><Icon name="clock" size={12} /> {fmtDate(iss.date)}</span>
                  {DDR_ARCS[iss.arc] && <span style={{ color: "var(--muted-2)" }}>{DDR_ARCS[iss.arc]}</span>}
                </div>
              </div>
              {/* original-order delta */}
              <div style={{ textAlign: "right" }}>
                <DeltaTag iss={iss} idx={idx} order={order} byId={byId} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// shows whether an issue's print-date rank differs from its timeline slot
const DeltaTag = ({ iss, idx, order, byId }) => {
  const pubRank = DDR_byPub().filter((x) => order.includes(x.id)).findIndex((x) => x.id === iss.id);
  const delta = pubRank - idx;
  if (delta === 0) return <span style={{ fontSize: 11.5, color: "var(--muted-2)" }}>in print order</span>;
  const up = delta > 0;
  return (
    <Badge tone={up ? "red" : "gold"} style={{ fontSize: 10 }}>
      {up ? "↑" : "↓"} {Math.abs(delta)} vs print
    </Badge>
  );
};

const nudgeBtn = (disabled) => ({
  width: 24, height: 18, borderRadius: 3, display: "grid", placeItems: "center",
  background: "var(--ink-4)", color: disabled ? "var(--ink-4)" : "var(--muted)", opacity: disabled ? .4 : 1,
});
