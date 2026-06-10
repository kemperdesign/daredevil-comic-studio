import { DDR_ISSUES, DDR_UPCOMING, DDR_SERIES } from './data';
import { VolumeCard } from './cards';

export const IndexView = ({ helpers }) => {
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

  return (
    <div style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(214,32,43,.12) 0%, transparent 100%)',
        borderBottom: '1px solid var(--line)',
        padding: '60px 0 40px',
        marginBottom: 60,
      }}>
        <div className="wrap">
          <h1 className="display" style={{
            fontSize: 48,
            color: 'var(--paper)',
            marginBottom: 8,
          }}>
            Daredevil Comics
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--muted)',
            maxWidth: 600,
          }}>
            A comprehensive collection spanning decades of Hell's Kitchen. Choose a volume below to view its issues.
          </p>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
