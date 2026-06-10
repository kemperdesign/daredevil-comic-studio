import React from 'react';
import { Icon } from './components';

export const LinksView = () => {
  const links = [
    { title: "Marvel Fandom Wiki", url: "https://marvel.fandom.com/wiki/Daredevil_Comic_Books" },
    { title: "Wikipedia: Marvel Comics Series", url: "https://en.wikipedia.org/wiki/Daredevil_(Marvel_Comics_series)" },
    { title: "Marvel Official Comic List", url: "https://www.marvel.com/comics/characters/1009262/daredevil" },
    { title: "Crushing Krisis: Collecting Guide", url: "https://crushingkrisis.com/crushing-comics-guide-collecting-marvel-comic-books/daredevil-reading-order-collecting-guide/" },
    { title: "Comic Book Reading Orders", url: "https://comicbookreadingorders.com/marvel/characters/daredevil-reading-order/" }
  ];

  return (
    <div className="wrap" style={{ padding: "40px 0" }}>
      <h2 style={{ fontFamily: "var(--head)", fontSize: 28, fontWeight: 600, marginBottom: 20 }}>Reference Links</h2>
      <p style={{ color: "var(--muted)", marginBottom: 30, fontSize: 15 }}>
        Sources used for compiling the master Daredevil reading order and checklist.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", background: "var(--ink-3)", border: "1px solid var(--line)", borderRadius: 8,
            color: "var(--paper)", textDecoration: "none", transition: "all .2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.background = "var(--ink-4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "var(--ink-3)"; }}>
            <div>
              <div style={{ fontFamily: "var(--head)", fontWeight: 600, fontSize: 16 }}>{l.title}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{l.url}</div>
            </div>
            <Icon name="link" size={18} color="var(--muted-2)" />
          </a>
        ))}
      </div>
    </div>
  );
};
