import React from 'react';
import { DDR_ISSUES, DDR_UPCOMING, DDR_SERIES } from './data';
import { CoverCard } from './cards';
import { Icon } from './components';

export const VolumeView = ({ seriesId, helpers }) => {
  const series = DDR_SERIES[seriesId];
  
  if (!series) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Volume not found.</div>;
  }

  // Combine issues
  const volumeIssues = [
    ...DDR_ISSUES.filter(iss => iss.s === seriesId),
    ...DDR_UPCOMING.filter(iss => iss.s === seriesId && helpers.isOwned(iss)),
  ].sort((a, b) => {
    // Sort by publication date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <section style={{
        background: `linear-gradient(135deg, ${series.accent || 'var(--red)'}22 0%, transparent 100%)`,
        borderBottom: '1px solid var(--line)',
        padding: '40px 0',
        marginBottom: 40,
      }}>
        <div className="wrap">
          <button onClick={() => { helpers.setRoute({ name: 'index' }); window.scrollTo(0, 0); }} style={{
            display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)",
            fontFamily: "var(--head)", fontWeight: 600, textTransform: "uppercase", fontSize: 12,
            marginBottom: 20, transition: "color .2s"
          }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--paper)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}>
            <Icon name="chevron-left" size={14} /> Back to All Comics
          </button>
          
          <h1 className="display" style={{
            fontSize: 40,
            color: 'var(--paper)',
            marginBottom: 8,
          }}>
            {series.name} {series.vol.split('·')[0].trim()}
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--muted)',
            fontFamily: 'var(--head)',
            textTransform: 'uppercase',
            letterSpacing: '.05em',
            fontWeight: 600
          }}>
            {series.vol.includes('·') ? series.vol.split('·')[1].trim() : series.vol} · {volumeIssues.length} issues
          </p>
        </div>
      </section>

      {/* Grid of Issues */}
      <section style={{ marginBottom: 80 }}>
        <div className="wrap">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 24,
            marginBottom: 12,
          }}>
            {volumeIssues.map((iss, idx) => (
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
    </div>
  );
};
