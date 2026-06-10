import React from 'react';
import { DDR_SERIES } from './data';
import { DDR_ART } from './art';
import { Icon, Ring } from './components';
import { getPdf } from './storage';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const pageCache = {};
export function pageFor(iss, i) {
  const key = iss.id + ":" + i;
  if (!pageCache[key]) pageCache[key] = DDR_ART.page(iss, DDR_SERIES[iss.s], i);
  return pageCache[key];
}

export const Reader = ({ iss, state, helpers }) => {
  const total = iss.pages;
  const st = helpers.getSt(iss);
  const [page, setPage] = React.useState(Math.min(st.page || 0, total - 1));
  const [mode, setMode] = React.useState(state.ui.readMode || "spread"); // single | spread | scroll
  const [fit, setFit] = React.useState(state.ui.fit || "height");        // height | width
  const [zoom, setZoom] = React.useState(1);
  const [chrome, setChrome] = React.useState(true);
  const scrollRef = React.useRef(null);
  const idleTimer = React.useRef(null);
  
  const hasLocal = state.localFiles?.includes(iss.id);
  const [pdfFile, setPdfFile] = React.useState(null);
  const [pdfPages, setPdfPages] = React.useState(iss.pages);

  React.useEffect(() => {
    if (hasLocal) {
      getPdf(iss.id).then((blob) => setPdfFile(blob)).catch(console.error);
    } else {
      const url = `/comics/${iss.id}.pdf`;
      fetch(url, { method: 'HEAD' }).then(res => {
        if (res.ok) setPdfFile(url);
      }).catch(() => {});
    }
  }, [hasLocal, iss.id]);

  const activeTotal = pdfFile ? pdfPages : total;

  // persist mode/fit
  React.useEffect(() => { helpers.setUi({ readMode: mode, fit }); }, [mode, fit]);

  // save progress (debounced via rAF-ish)
  React.useEffect(() => {
    helpers.setProgress(iss, page);
  }, [page]);

  // spread step is 2 (after the cover, pages pair up)
  const step = mode === "spread" ? 2 : 1;
  const clamp = (p) => Math.max(0, Math.min(activeTotal - 1, p));
  const go = (dir) => setPage((p) => clamp(p + dir * step));

  // keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); if (mode !== "scroll") go(1); }
      else if (e.key === "ArrowLeft") { if (mode !== "scroll") go(-1); }
      else if (e.key === "Escape") helpers.exitReader();
      else if (e.key === "f") setChrome((c) => !c);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(2.4, z + .15));
      else if (e.key === "-") setZoom((z) => Math.max(.5, z - .15));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, step]);

  // scroll mode: track which page is in view
  const onScroll = () => {
    if (mode !== "scroll" || !scrollRef.current) return;
    const el = scrollRef.current;
    const kids = el.querySelectorAll("[data-pg]");
    const mid = el.scrollTop + el.clientHeight / 2;
    let cur = 0;
    kids.forEach((k) => { if (k.offsetTop <= mid) cur = +k.dataset.pg; });
    if (cur !== page) setPage(cur);
  };

  // auto-hide chrome on idle (when reading)
  const wake = () => {
    setChrome(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setChrome(false), 3200);
  };
  React.useEffect(() => { wake(); return () => clearTimeout(idleTimer.current); }, []);

  const pct = Math.round(page / (activeTotal - 1) * 100);

  // pages currently shown
  let shown;
  if (mode === "single") shown = [page];
  else if (mode === "spread") shown = page === 0 ? [0] : (page % 2 === 1 ? [page, page + 1] : [page - 1, page]).filter((i) => i < activeTotal);
  else shown = null;

  const fitStyle = fit === "height"
    ? { height: `calc((100vh - 132px) * ${zoom})`, width: "auto" }
    : { width: `calc(min(94vw, 760px) * ${zoom})`, height: "auto" };

  return (
    <div onMouseMove={wake} style={{ position: "fixed", inset: 0, background: "#040405", zIndex: 200, display: "flex", flexDirection: "column" }}>
      {/* top bar */}
      <header style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 16, background: "linear-gradient(180deg, rgba(4,4,5,.95), transparent)",
        transform: chrome ? "none" : "translateY(-100%)", transition: "transform .3s", pointerEvents: chrome ? "auto" : "none",
      }}>
        <button onClick={() => helpers.exitReader()} style={readerBtn}>
          <Icon name="chevL" size={17} /> <span style={{ fontFamily: "var(--head)", fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase" }}>Library</span>
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{iss.title}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{DDR_SERIES[iss.s].name} {iss.no}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          {/* mode */}
          <div style={{ display: "flex", background: "rgba(255,255,255,.06)", borderRadius: 6, padding: 3, gap: 2 }}>
            {[["single", "page1", "Single"], ["spread", "page2", "Spread"], ["scroll", "scroll", "Scroll"]].map(([m, ic, t]) => (
              <button key={m} onClick={() => setMode(m)} title={t} style={{
                width: 38, height: 34, borderRadius: 4, display: "grid", placeItems: "center",
                background: mode === m ? "var(--red)" : "transparent", color: mode === m ? "#fff" : "var(--muted)", transition: "all .18s",
              }}><Icon name={ic} size={17} /></button>
            ))}
          </div>
          {/* fit + zoom (not in scroll) */}
          {mode !== "scroll" && (
            <div style={{ display: "flex", background: "rgba(255,255,255,.06)", borderRadius: 6, padding: 3, gap: 2 }}>
              <button onClick={() => setZoom((z) => Math.max(.5, z - .15))} style={zoomBtn} title="Zoom out"><Icon name="zoomOut" size={16} /></button>
              <button onClick={() => { setFit((f) => f === "height" ? "width" : "height"); setZoom(1); }} style={{ ...zoomBtn, width: "auto", padding: "0 10px", fontFamily: "var(--head)", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }} title="Toggle fit">{fit === "height" ? "Fit H" : "Fit W"}</button>
              <button onClick={() => setZoom((z) => Math.min(2.4, z + .15))} style={zoomBtn} title="Zoom in"><Icon name="zoomIn" size={16} /></button>
            </div>
          )}
          <button onClick={() => setChrome(false)} style={readerBtn} title="Hide controls (press F)"><Icon name="fit" size={17} /></button>
        </div>
      </header>

      {/* page stage */}
      {mode === "scroll" ? (
        <div ref={scrollRef} onScroll={onScroll} style={{ position: "absolute", inset: 0, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "80px 0 90px" }}>
          {pdfFile ? (
            <Document file={pdfFile} onLoadSuccess={({ numPages }) => setPdfPages(numPages)}>
              {Array.from({ length: pdfPages }).map((_, i) => (
                <div key={i} data-pg={i} style={{ boxShadow: "0 16px 50px -16px #000", border: "1px solid #15151a", marginBottom: 14, display: "flex", justifyContent: "center" }}>
                  <Page pageNumber={i + 1} width={window.innerWidth * 0.94} renderTextLayer={false} renderAnnotationLayer={false} />
                </div>
              ))}
            </Document>
          ) : (
            Array.from({ length: total }).map((_, i) => (
              <img key={i} data-pg={i} src={pageFor(iss, i)} alt={"Page " + (i + 1)} loading="lazy"
                style={{ width: "min(94vw, 720px)", height: "auto", borderRadius: 3, boxShadow: "0 16px 50px -16px #000", border: "1px solid #15151a" }} />
            ))
          )}
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", overflow: "auto", padding: "70px 0" }}>
          {pdfFile ? (
            <Document file={pdfFile} onLoadSuccess={({ numPages }) => setPdfPages(numPages)}>
              <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center" }}>
                {shown.map((i) => (
                  <div key={i} style={{ boxShadow: "0 24px 70px -20px #000", border: "1px solid #15151a" }}>
                    <Page pageNumber={i + 1} height={fit === "height" ? (window.innerHeight - 132) * zoom : null} width={fit === "width" ? Math.min(window.innerWidth * 0.94, 760) * zoom : null} renderTextLayer={false} renderAnnotationLayer={false} />
                  </div>
                ))}
              </div>
            </Document>
          ) : (
            <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center" }}>
              {shown.map((i) => (
                <img key={i} src={pageFor(iss, i)} alt={"Page " + (i + 1)}
                  style={{ ...fitStyle, borderRadius: 3, boxShadow: "0 24px 70px -20px #000", border: "1px solid #15151a", maxWidth: "none" }} />
              ))}
            </div>
          )}
          {/* click zones */}
          {page > 0 && <button onClick={() => go(-1)} aria-label="Previous" style={{ ...navZone, left: 0 }} className="nav-zone">
            <span style={navArrow}><Icon name="chevL" size={26} /></span>
          </button>}
          {page < activeTotal - 1 && <button onClick={() => go(1)} aria-label="Next" style={{ ...navZone, right: 0, justifyContent: "flex-end" }} className="nav-zone">
            <span style={navArrow}><Icon name="chevR" size={26} /></span>
          </button>}
        </div>
      )}

      {/* bottom progress bar */}
      <footer style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "18px 24px 20px",
        background: "linear-gradient(0deg, rgba(4,4,5,.96), transparent)",
        transform: chrome ? "none" : "translateY(100%)", transition: "transform .3s", pointerEvents: chrome ? "auto" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 900, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--head)", fontSize: 13, color: "var(--muted)", minWidth: 70 }}>{page + 1} / {activeTotal}</span>
          <div style={{ flex: 1, position: "relative", height: 30, display: "flex", alignItems: "center" }}>
            {/* page ticks / scrubber */}
            <input type="range" min={0} max={activeTotal - 1} value={page} onChange={(e) => { const v = +e.target.value; if (mode === "scroll") { const el = scrollRef.current.querySelector(`[data-pg="${v}"]`); el && scrollRef.current.scrollTo({ top: el.offsetTop - 76 }); } setPage(v); }}
              style={{ width: "100%", accentColor: "var(--red)", cursor: "pointer" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 96, justifyContent: "flex-end" }}>
            <Ring value={pct / 100} size={30} sw={3}><span style={{ fontSize: 9, fontWeight: 700, color: "var(--red)" }}>{pct}</span></Ring>
            <span style={{ fontSize: 11.5, color: "var(--muted-2)" }}>{pct === 100 ? "Done" : "Read"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const readerBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 6, background: "rgba(255,255,255,.06)", color: "var(--paper)" };
const zoomBtn = { width: 34, height: 34, borderRadius: 4, display: "grid", placeItems: "center", color: "var(--paper)" };
const navZone = { position: "absolute", top: 0, bottom: 0, width: "32%", display: "flex", alignItems: "center", padding: "0 22px", background: "transparent", border: "none" };
const navArrow = { width: 52, height: 52, borderRadius: "50%", background: "rgba(20,20,24,.7)", backdropFilter: "blur(6px)", border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "#fff", opacity: 0, transition: "opacity .2s" };
