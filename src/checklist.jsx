import React from 'react';
import { DD_CHECKLIST } from './checklist-data';
import { Icon, Ring } from './components';
import { saveChecklist, loadChecklist, getDB } from './storage';

export const ChecklistView = () => {
  const [checked, setChecked] = React.useState({});
  const [search, setSearch] = React.useState("");
  const [missingOnly, setMissingOnly] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        // Load manually checked items
        const c = await loadChecklist();

        // Load uploaded PDFs from IndexedDB
        const db = await getDB();
        const tx = db.transaction('pdfs', 'readonly');
        const store = tx.objectStore('pdfs');
        const keysReq = store.getAllKeys();

        keysReq.onsuccess = () => {
          const uploadedPdfs = keysReq.result;
          // Mark items with uploaded PDFs as checked
          const merged = { ...c };
          uploadedPdfs.forEach(id => {
            if (DD_CHECKLIST.some(item => item.id === id)) {
              merged[id] = true;
            }
          });
          setChecked(merged);
          setLoaded(true);
        };

        keysReq.onerror = () => {
          setChecked(c);
          setLoaded(true);
        };
      } catch (e) {
        console.error("Failed to load checklist", e);
        setLoaded(true);
      }
    })();
  }, []);

  const toggle = (id) => {
    const newVal = !checked[id];
    setChecked(s => ({ ...s, [id]: newVal }));
    saveChecklist(id, newVal).catch(e => console.error(e));
  };

  const filtered = React.useMemo(() => {
    let list = DD_CHECKLIST;
    if (missingOnly) list = list.filter(c => !checked[c.id]);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.series.toLowerCase().includes(q));
    }
    return list;
  }, [search, missingOnly, checked]);

  // Group by series
  const groups = React.useMemo(() => {
    const map = new Map();
    filtered.forEach(c => {
      if (!map.has(c.series)) map.set(c.series, []);
      map.get(c.series).push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const total = DD_CHECKLIST.length;
  const owned = Object.values(checked).filter(Boolean).length;
  const pct = total ? Math.round((owned / total) * 100) : 0;

  if (!loaded) return <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Loading checklist...</div>;

  return (
    <div className="wrap" style={{ padding: "40px 0 100px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 40 }}>
        <div>
          <h2 style={{ fontFamily: "var(--head)", fontSize: 32, fontWeight: 600, letterSpacing: "-.02em" }}>Master Checklist</h2>
          <p style={{ color: "var(--muted)", marginTop: 6, fontSize: 15 }}>Track every single Daredevil comic you've read or collected.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--ink-2)", padding: "16px 24px", borderRadius: 12, border: "1px solid var(--line-2)" }}>
          <Ring value={pct / 100} size={50} sw={4} color="var(--red)">
            <span style={{ fontFamily: "var(--head)", fontWeight: 700, fontSize: 13 }}>{pct}%</span>
          </Ring>
          <div>
            <div style={{ fontFamily: "var(--head)", fontSize: 13, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)" }}>Completion</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{owned} <span style={{ color: "var(--muted-2)", fontSize: 16, fontWeight: 400 }}>/ {total}</span></div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 30 }}>
        <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
          <Icon name="search" size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for a comic or volume..."
            style={{ width: "100%", padding: "14px 16px 14px 44px", background: "var(--ink-2)", border: "1px solid var(--line-2)", borderRadius: 8, color: "var(--paper)", outline: "none", fontSize: 15 }} />
        </div>
        <button onClick={() => setMissingOnly(!missingOnly)} style={{
          padding: "0 24px", display: "flex", alignItems: "center", gap: 10, borderRadius: 8,
          background: missingOnly ? "rgba(214,32,43,.14)" : "var(--ink-2)", color: missingOnly ? "var(--red)" : "var(--paper)",
          border: `1px solid ${missingOnly ? "var(--red)" : "var(--line-2)"}`, fontFamily: "var(--head)", fontWeight: 600, textTransform: "uppercase", fontSize: 13, transition: "all .2s"
        }}>
          <Icon name="filter" size={16} /> {missingOnly ? "Show All Comics" : "Missing Only"}
        </button>
      </div>

      {groups.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)", background: "var(--ink-2)", borderRadius: 12, border: "1px solid var(--line)" }}>
          <Icon name="search" size={32} style={{ opacity: 0.5, marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600 }}>No comics found</div>
          <div style={{ marginTop: 6 }}>Try adjusting your search or filters.</div>
        </div>
      )}

      {groups.map(([series, items]) => {
        const sOwned = items.filter(i => checked[i.id]).length;
        const sTotal = items.length;
        return (
          <div key={series} style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
              <h3 style={{ fontFamily: "var(--head)", fontSize: 20, fontWeight: 600 }}>{series}</h3>
              <span style={{ color: "var(--muted-2)", fontSize: 13 }}>{sOwned} / {sTotal} collected</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
              {items.map(item => {
                const isChecked = !!checked[item.id];
                return (
                  <button key={item.id} onClick={() => toggle(item.id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 8, textAlign: "left",
                    background: isChecked ? "rgba(62,166,106,.06)" : "var(--ink-2)", 
                    border: `1px solid ${isChecked ? "rgba(62,166,106,.3)" : "var(--line)"}`,
                    transition: "all .15s"
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, border: `2px solid ${isChecked ? "var(--green)" : "var(--line-2)"}`,
                      background: isChecked ? "var(--green)" : "transparent", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0
                    }}>
                      {isChecked && <Icon name="check" size={16} sw={3} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5, color: isChecked ? "var(--paper)" : "var(--muted)", textDecoration: isChecked ? "line-through" : "none" }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 3 }}>{item.year}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
