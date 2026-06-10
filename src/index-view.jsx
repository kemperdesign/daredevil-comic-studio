import { DDR_ISSUES, DDR_UPCOMING, DDR_SERIES, DDR_byPub } from './data';
import { VolumeCard } from './cards';
import { Icon } from './components';

export const IndexView = ({ helpers, state }) => {
  // Combine issues
  const allComics = [
    ...DDR_ISSUES,
    ...DDR_UPCOMING.filter((iss) => helpers.isOwned(iss)),
  ];

  // Group by series
  const grouped = {};
  allComics.forEach((iss) => {
    const series = DDR_SERIES[iss.s];
    if (!grouped[iss.s]) {
      grouped[iss.s] = { series, issues: [] };
    }
    grouped[iss.s].issues.push(iss);
  });

  const seriesOrder = ['v1', 'v2', 'v3', 'v5', 'v6', 'v7', 'v8', 'mwf', 'yellow', 'born'];
  const seriesList = seriesOrder
    .filter((k) => grouped[k])
    .map((k) => ({ key: k, ...grouped[k] }));

  // Find last read issue
  const pubAll = DDR_byPub();
  const lastRead = pubAll
    .filter((iss) => {
      const st = helpers.getSt(iss);
      return st.page > 0 && !st.read;
    })
    .sort((a, b) => (helpers.getSt(b).ts || 0) - (helpers.getSt(a).ts || 0))[0];

  return (
    <div style={{ flex: 1 }}>
      {/* Hero + Continue Reading */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(214,32,43,.12) 0%, transparent 100%)',
        borderBottom: '1px solid var(--line)',
        padding: '60px 0 40px',
        marginBottom: 60,
      }}>
        <div className="wrap">
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
            {/* Left: Hero content */}
            <div style={{ flex: 1 }}>
              <h1 className="display" style={{
                fontSize: 48,
                color: 'var(--paper)',
                marginBottom: 8,
              }}>
                <svg width="100%" height="auto" viewBox="0 0 800 120" preserveAspectRatio="xMinYMid meet" style={{ maxWidth: "700px", display: "block" }}>
                  <text x="10" y="90" fontSize="90" fontWeight="900" fontFamily="Arial, sans-serif" fill="#d41a2a" fontStyle="italic" letterSpacing="-2">DAREDEVIL</text>
                  <text x="30" y="115" fontSize="32" fontWeight="600" fontFamily="Arial, sans-serif" fill="var(--paper)" letterSpacing="3">COMICS</text>
                </svg>
              </h1>
              <p style={{
                fontSize: 16,
                color: 'var(--muted)',
                maxWidth: 600,
              }}>
                A comprehensive collection spanning decades of Hell's Kitchen. Choose a volume below to view its issues.
              </p>
            </div>

            {/* Right: Continue Reading */}
            {lastRead && (
              <div style={{
                display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
                padding: "20px 24px", background: "linear-gradient(135deg, rgba(214,32,43,.08) 0%, rgba(214,32,43,.02) 100%)",
                border: "1px solid rgba(214,32,43,.2)", borderRadius: 12, width: 280,
              }}>
                <div style={{ width: 80, height: 120, borderRadius: 6, overflow: "hidden", flexShrink: 0, boxShadow: "var(--shadow)" }}>
                  <img src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 450'><rect fill='%23222' width='300' height='450'/></svg>`} alt="" style={{ width: "100%", height: "100%" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--head)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>Continue Reading</div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, lineHeight: 1.2 }}>{lastRead.title}</h3>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
                    {DDR_SERIES[lastRead.s].name} {lastRead.no}
                  </p>
                  <button onClick={() => helpers.onRead(lastRead)} style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
                    background: "var(--red)", color: "#fff", borderRadius: 4, fontFamily: "var(--head)",
                    fontWeight: 600, fontSize: 10, letterSpacing: ".05em", textTransform: "uppercase",
                    boxShadow: "0 6px 16px -6px var(--red-glow)", transition: "all .2s",
                  }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                    <Icon name="play" size={12} /> Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid of Volumes */}
      <section style={{ marginBottom: 80 }}>
        <div className="wrap">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 32,
          }}>
            {seriesList.map((group, idx) => {
              const coverIssue = group.issues.find(iss => iss.no === '#1') || group.issues[0];
              return (
              <VolumeCard
                key={group.key}
                series={group.series}
                coverIssue={coverIssue}
                count={group.issues.length}
                onClick={() => {
                  helpers.setRoute({ name: 'volume', seriesId: group.key });
                  window.scrollTo(0, 0);
                }}
                index={idx}
              />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
