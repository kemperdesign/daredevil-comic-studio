import { DDR_ISSUES, DDR_UPCOMING, DDR_SERIES } from './data';
import { CoverCard } from './cards';

export const IndexView = ({ helpers }) => {
  // Combine issues and owned upcoming issues
  const allComics = [
    ...DDR_ISSUES,
    ...DDR_UPCOMING.filter((iss) => helpers.isOwned(iss)),
  ].sort((a, b) => {
    // Sort by publication date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Group by series for sections
  const grouped = {};
  allComics.forEach((iss) => {
    const series = DDR_SERIES[iss.s];
    if (!grouped[iss.s]) {
      grouped[iss.s] = { series, issues: [] };
    }
    grouped[iss.s].issues.push(iss);
  });

  const seriesOrder = ['mwf', 'yellow', 'v1', 'born', 'v2', 'v3', 'v5', 'v6', 'v7', 'v8'];
  const seriesList = seriesOrder
    .filter((k) => grouped[k])
    .map((k) => grouped[k]);

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
            A comprehensive collection spanning decades of Hell's Kitchen. From origin stories to modern sagas, every issue of the Man Without Fear.
          </p>
        </div>
      </section>

      {/* Grid sections by series */}
      {seriesList.map((group) => (
        <section key={group.series.short} style={{ marginBottom: 80 }}>
          <div className="wrap">
            <div style={{ marginBottom: 28 }}>
              <h2 className="display" style={{
                fontSize: 28,
                color: 'var(--paper)',
                marginBottom: 4,
              }}>
                {group.series.name}
              </h2>
              <div style={{ fontSize: 13, color: 'var(--muted-2)', fontFamily: 'var(--head)', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                {group.series.vol} · {group.issues.length} issue{group.issues.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 24,
              marginBottom: 12,
            }}>
              {group.issues.map((iss, idx) => (
                <CoverCard
                  key={iss.id}
                  iss={iss}
                  st={helpers.getSt(iss)}
                  onOpen={helpers.onOpen}
                  onRead={helpers.onRead}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
