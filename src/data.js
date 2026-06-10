/* Daredevil library seed data.
   Bibliographic facts (runs, creators, cover dates) are real; synopses are
   original short blurbs written for this prototype, not copied from anywhere.
   `pub` = publication order (by coverDate). `tl` = in-story timeline index
   (curated chronological reading order — deliberately different from print). */

export const DDR_SERIES = {
  mwf:   { name: "The Man Without Fear", vol: "1993 Mini",  short: "Man Without Fear", accent: "#C8202B" },
  yellow:{ name: "Daredevil: Yellow",     vol: "2001 Mini",  short: "Yellow",           accent: "#E0A52E" },
  v1:    { name: "Daredevil",             vol: "Vol. 1 · 1964", short: "Vol. 1",        accent: "#B81C26" },
  born:  { name: "Born Again",            vol: "Vol. 1 · 1986", short: "Born Again",    accent: "#9E1620" },
  v2:    { name: "Daredevil",             vol: "Vol. 2 · 1998", short: "Vol. 2",        accent: "#D11F2A" },
  v3:    { name: "Daredevil",             vol: "Vol. 3 · 2011", short: "Vol. 3",        accent: "#D6303A" },
  v5:    { name: "Daredevil",             vol: "Vol. 5 · 2015", short: "Vol. 5",        accent: "#C01F2A" },
  v6:    { name: "Daredevil",             vol: "Vol. 6 · 2019", short: "Vol. 6",        accent: "#A8141D" },
  v7:    { name: "Daredevil",             vol: "Vol. 7 · 2023", short: "Vol. 7",        accent: "#D9242E" },
  v8:    { name: "Daredevil",             vol: "2026",          short: "2026",          accent: "#E5121A" },
};

// arc groupings (story arcs within / across runs)
export const DDR_ARCS = {
  origin:    "Origin",
  guardian:  "Guardian Devil",
  miller:    "The Frank Miller Saga",
  bornagain: "Born Again",
  bendis:    "Out / Underboss",
  waid:      "Devil at Bay",
  knowfear:  "Know Fear",
  redfist:   "The Red Fist Saga",
  omen:      "Omen",
};

/* Each issue:
   id, s(series key), no(issue label), title, writer, penciller, cover(artist),
   date(ISO), pages, arc, synopsis, seed(art), tl(timeline index) */
export const DDR_ISSUES = [
  { id:"mwf1", s:"mwf", no:"#1", title:"The Man Without Fear", writer:"Frank Miller", penciller:"John Romita Jr.", cover:"John Romita Jr.",
    date:"1993-10-01", pages:24, arc:"origin", seed:7,
    synopsis:"A blind boy from Hell's Kitchen learns that fear is the only thing worth fighting. The accident that takes Matt Murdock's sight gives him everything else.", tl:1, pdfUrl: "/sample.pdf" },
  { id:"mwf2", s:"mwf", no:"#2", title:"Stick", writer:"Frank Miller", penciller:"John Romita Jr.", cover:"John Romita Jr.",
    date:"1993-11-01", pages:24, arc:"origin", seed:11,
    synopsis:"A ruthless old sensei drags a grieving orphan through pain toward control. The senses are sharpened; the boy is not yet a man.", tl:2 },
  { id:"yel1", s:"yellow", no:"#1", title:"Yellow, Part One", writer:"Jeph Loeb", penciller:"Tim Sale", cover:"Tim Sale",
    date:"2001-08-01", pages:22, arc:"origin", seed:21,
    synopsis:"A letter to a ghost. Matt remembers the woman he loved and the clumsy yellow costume he wore before he understood what the city would cost him.", tl:3 },
  { id:"yel2", s:"yellow", no:"#2", title:"Yellow, Part Two", writer:"Jeph Loeb", penciller:"Tim Sale", cover:"Tim Sale",
    date:"2001-09-01", pages:22, arc:"origin", seed:24,
    synopsis:"Karen Page walks into a two-man law office and out with a partner's heart. The Fixer's old crime resurfaces with the smell of the boxing gym.", tl:4 },
  { id:"v1_1", s:"v1", no:"#1", title:"The Origin of Daredevil", writer:"Stan Lee", penciller:"Bill Everett", cover:"Jack Kirby",
    date:"1964-04-01", pages:23, arc:"origin", seed:1,
    synopsis:"The first night out. A new hero in a devil's colors answers for his father in the only courtroom that ever mattered to him — the street.", tl:5 },
  { id:"v1_7", s:"v1", no:"#7", title:"In Mortal Combat with Sub-Mariner!", writer:"Stan Lee", penciller:"Wally Wood", cover:"Wally Wood",
    date:"1965-04-01", pages:22, arc:"origin", seed:3,
    synopsis:"The red suit debuts against an impossible opponent. A blind lawyer cannot win this fight, and refuses to stop swinging anyway.", tl:7 },
  { id:"v1_168", s:"v1", no:"#168", title:"Elektra", writer:"Frank Miller", penciller:"Frank Miller", cover:"Frank Miller",
    date:"1981-01-01", pages:22, arc:"miller", seed:31,
    synopsis:"A face from college returns wearing a killer's discipline. Love and assassination were always going to share the same rooftop.", tl:12 },
  { id:"v1_181", s:"v1", no:"#181", title:"Last Hand", writer:"Frank Miller", penciller:"Frank Miller", cover:"Frank Miller",
    date:"1982-04-01", pages:38, arc:"miller", seed:34,
    synopsis:"Bullseye keeps a promise nobody wanted kept. The cost of the war with the Kingpin comes due on a wire, in the dark.", tl:14 },
  { id:"born227", s:"born", no:"#227", title:"Apocalypse", writer:"Frank Miller", penciller:"David Mazzucchelli", cover:"David Mazzucchelli",
    date:"1986-02-01", pages:22, arc:"bornagain", seed:41,
    synopsis:"The Kingpin buys a secret and spends it to erase a man. No badge, no apartment, no name — just a devil and the ruins of a life.", tl:20 },
  { id:"born229", s:"born", no:"#229", title:"God and Country", writer:"Frank Miller", penciller:"David Mazzucchelli", cover:"David Mazzucchelli",
    date:"1986-04-01", pages:22, arc:"bornagain", seed:44,
    synopsis:"From the bottom there is only the climb. A half-mad confession in a church basement becomes the first brick of a resurrection.", tl:21 },
  { id:"v2_1", s:"v2", no:"#1", title:"Guardian Devil, Part One", writer:"Kevin Smith", penciller:"Joe Quesada", cover:"Joe Quesada",
    date:"1998-11-01", pages:30, arc:"guardian", seed:51,
    synopsis:"A frightened girl hands Matt a baby and a prophecy. Faith and madness blur until he can't tell which one is talking.", tl:30 },
  { id:"v2_16", s:"v2", no:"#16", title:"Wake Up, Part One", writer:"Brian Michael Bendis", penciller:"David Mack", cover:"David Mack",
    date:"2001-05-01", pages:22, arc:"bendis", seed:54,
    synopsis:"A reporter chases a silent, traumatized boy and finds Daredevil reflected in the cracks. The city tells its story in fragments.", tl:33 },
  { id:"v2_26", s:"v2", no:"#26", title:"Underboss, Part One", writer:"Brian Michael Bendis", penciller:"Alex Maleev", cover:"Alex Maleev",
    date:"2001-12-01", pages:22, arc:"bendis", seed:57,
    synopsis:"While the Kingpin bleeds, the wolves of the families circle the empty throne. Murdock's secret becomes the most valuable thing in New York.", tl:35 },
  { id:"v2_82", s:"v2", no:"#82", title:"The Widow, Part One", writer:"Ed Brubaker", penciller:"Michael Lark", cover:"Michael Lark",
    date:"2006-04-01", pages:22, arc:"bendis", seed:61,
    synopsis:"Out of one cage and into a colder war. An old flame brings a job that smells like a setup from the first handshake.", tl:42 },
  { id:"v3_1", s:"v3", no:"#1", title:"The Devil's Daredevil", writer:"Mark Waid", penciller:"Paolo Rivera", cover:"Paolo Rivera",
    date:"2011-09-01", pages:23, arc:"waid", seed:71,
    synopsis:"A lighter man swings into a brighter book and crashes a mob wedding. The world thinks it knows his secret — so he smiles and lies with his whole face.", tl:50 },
  { id:"v3_7", s:"v3", no:"#7", title:"The Whole Wide World", writer:"Mark Waid", penciller:"Paolo Rivera", cover:"Paolo Rivera",
    date:"2012-01-01", pages:23, arc:"waid", seed:74,
    synopsis:"A bus full of blind kids, a snowstorm, and no powers that help. The best Daredevil story of the year has no fight in it at all.", tl:52 },
  { id:"v5_1", s:"v5", no:"#1", title:"Chinatown, Part One", writer:"Charles Soule", penciller:"Ron Garney", cover:"Ron Garney", date:"2015-12-01",
    pages:22, arc:"waid", seed:81,
    synopsis:"Back in black, with the secret buried again and a new kid in red at his back. Matt prosecutes by day what he beats senseless by night.", tl:58 },
  { id:"v6_1", s:"v6", no:"#1", title:"Know Fear, Part One", writer:"Chip Zdarsky", penciller:"Marco Checchetto", cover:"Marco Checchetto",
    date:"2019-02-01", pages:30, arc:"knowfear", seed:91,
    synopsis:"A man who refuses to be stopped finally is — by his own hands. The line between justice and a body on the pavement was always one bad night thick.", tl:62 },
  { id:"v6_5", s:"v6", no:"#5", title:"Know Fear, Part Five", writer:"Chip Zdarsky", penciller:"Marco Checchetto", cover:"Marco Checchetto",
    date:"2019-04-01", pages:22, arc:"knowfear", seed:94,
    synopsis:"Confession is not the same as absolution. Matt asks a priest, a cop, and his own conscience the same impossible question.", tl:64 },
  { id:"v6_25", s:"v6", no:"#25", title:"Truth / Dare", writer:"Chip Zdarsky", penciller:"Marco Checchetto", cover:"Marco Checchetto",
    date:"2021-02-01", pages:30, arc:"knowfear", seed:97,
    synopsis:"Someone has to run Hell's Kitchen while the devil pays for his sins. The mantle finds new shoulders and they do not flinch.", tl:67 },
  { id:"v7_1", s:"v7", no:"#1", title:"The Red Fist Saga, Part One", writer:"Chip Zdarsky", penciller:"Marco Checchetto", cover:"Marco Checchetto",
    date:"2022-09-01", pages:30, arc:"redfist", seed:101,
    synopsis:"An army of fists with no fear and no faces. To beat the Hand, two devils build a church of their own and call it war.", tl:71 },
  { id:"v8_1", s:"v8", no:"#1", title:"Bury the Bodies", writer:"Stephanie Phillips", penciller:"Lee Garbett", cover:"Lee Garbett",
    date:"2026-04-01", pages:27, arc:"omen", seed:111,
    synopsis:"A new player named Omen circles Matt Murdock, and the secrets of Hell's Kitchen refuse to stay buried. An unprecedented era opens on a city full of ghosts.", tl:80,
    ext:{ inker:"Lee Garbett", colorist:"Frank Martin", letterer:"VC's Ariana Maher", editor:"Devin Lewis", rating:"Rated T+", price:"$5.99", upc:"75960621282800111" }, pdfUrl: "/sample.pdf" },
];

/* Default extended-credit synthesis for issues that don't carry explicit `ext`.
   Mirrors the field set on the Marvel issue page (inker/colorist/letterer/
   editor/rating/format/price/page count). Prototype values. */
export const DDR_COLORISTS = ["Matt Hollingsworth","Frank Martin","Marte Gracia","Sunny Gho","Java Tartaglia","Matthew Wilson","Lee Loughridge"];
export const DDR_LETTERERS = ["VC's Clayton Cowles","VC's Joe Caramagna","VC's Cory Petit","Comicraft","VC's Ariana Maher"];
export const DDR_EDITORS   = ["Devin Lewis","Tom Brevoort","Stephen Wacker","Ralph Macchio","Jennifer Grünwald"];
export const DDR_ext = (iss) => {
  if (iss.ext) return iss.ext;
  const y = +iss.date.slice(0,4);
  const price = y < 1975 ? "12¢" : y < 1990 ? "$1.25" : y < 2005 ? "$2.99" : y < 2018 ? "$3.99" : "$4.99";
  const pick = (arr) => arr[iss.seed % arr.length];
  return { inker:iss.penciller, colorist:pick(DDR_COLORISTS), letterer:pick(DDR_LETTERERS),
           editor:pick(DDR_EDITORS), rating:"Rated T", price, upc:"7596061" + (200000 + iss.seed*137).toString().slice(0,6) };
};

/* ---- RELEASES FEED ----------------------------------------------------
   Reference "today" for the prototype. Upcoming/recent issues are matched
   from online sources (mocked). Each carries FOC + on-sale dates like the
   Marvel issue page. `s:"v8"` ties them to the current ongoing run. */
export const DDR_NOW = "2026-06-10";
export const DDR_UPCOMING = [
  { id:"v8_2", s:"v8", no:"#2", title:"Ghosts of the Kitchen", writer:"Stephanie Phillips", penciller:"Lee Garbett", cover:"Lee Garbett",
    date:"2026-05-06", onsale:"2026-05-06", foc:"2026-04-13", pages:23, arc:"omen", seed:113, tl:81,
    synopsis:"Omen knows a name Matt buried years ago. To keep it quiet he has to walk back into a room he swore he'd never enter again.", pdfUrl: "/sample.pdf" },
  { id:"v8_3", s:"v8", no:"#3", title:"The Long Fall", writer:"Stephanie Phillips", penciller:"Lee Garbett", cover:"Dike Ruan",
    date:"2026-06-03", onsale:"2026-06-03", foc:"2026-05-11", pages:23, arc:"omen", seed:115, tl:82,
    synopsis:"A rooftop chase ends the only way it can in Hell's Kitchen — badly, and in the rain. The devil counts the cost on the way down.", pdfUrl: "/sample.pdf" },
  { id:"v8_4", s:"v8", no:"#4", title:"Confession", writer:"Stephanie Phillips", penciller:"Lee Garbett", cover:"Lee Garbett",
    date:"2026-06-10", onsale:"2026-06-10", foc:"2026-05-18", pages:23, arc:"omen", seed:117, tl:83,
    synopsis:"Father Lantom hears the worst of it. Matt asks the one question the church can't answer and the street already has." },
  { id:"v8_5", s:"v8", no:"#5", title:"Omen, Unmasked", writer:"Stephanie Phillips", penciller:"Lee Garbett", cover:"Lee Garbett",
    date:"2026-07-01", onsale:"2026-07-01", foc:"2026-06-15", pages:23, arc:"omen", seed:119, tl:84,
    synopsis:"The face behind Omen is one Matt knows. The unprecedented era of Daredevil turns its first corner — and it's a dead end." },
  { id:"v8_6", s:"v8", no:"#6", title:"Bury Me Standing", writer:"Stephanie Phillips", penciller:"Cory Smith", cover:"Cory Smith",
    date:"2026-08-05", onsale:"2026-08-05", foc:"2026-07-13", pages:23, arc:"omen", seed:121, tl:85,
    synopsis:"First arc finale. Everything Omen dug up comes due in one night, and Hell's Kitchen decides whose side of the line it's on." },
];

/* ---- ON SCREEN — live-action adaptations ------------------------------
   The film + the series. Each item takes a user-supplied watch link
   (stored in state.watch[id]) plus an optional trailer link. Synopses are
   original short blurbs written for this prototype. */
export const DDR_SCREEN = [
  { id:"film2003", kind:"Film", title:"Daredevil", year:"2003", platform:"Theatrical", runtime:"103 min",
    accent:"#b8323a", seed:201, director:"Mark Steven Johnson", cast:"Ben Affleck · Jennifer Garner · Colin Farrell · Michael Clarke Duncan",
    trailer:"https://www.youtube.com/results?search_query=daredevil+2003+trailer",
    synopsis:"The first time Hell's Kitchen's devil hit the big screen. A blind lawyer by day, vigilante by night, hunting the Kingpin through a rain-slick city." },
  { id:"nf_s1", kind:"Series", season:"Season 1", title:"Daredevil", year:"2015", platform:"Streaming", runtime:"13 episodes",
    accent:"#a8141d", seed:203, director:"Drew Goddard (showrunner)", cast:"Charlie Cox · Vincent D'Onofrio · Deborah Ann Woll · Elden Henson",
    trailer:"https://www.youtube.com/results?search_query=daredevil+netflix+season+1+trailer",
    synopsis:"The definitive live-action Murdock. A grounded, brutal origin as a masked man in black takes on Wilson Fisk for the soul of the neighborhood." },
  { id:"nf_s2", kind:"Series", season:"Season 2", title:"Daredevil", year:"2016", platform:"Streaming", runtime:"13 episodes",
    accent:"#c01f2a", seed:205, director:"Doug Petrie & Marco Ramirez", cast:"Charlie Cox · Jon Bernthal · Élodie Yung · Vincent D'Onofrio",
    trailer:"https://www.youtube.com/results?search_query=daredevil+netflix+season+2+trailer",
    synopsis:"The Punisher puts the city on trial and Elektra pulls Matt back toward the Hand. Two philosophies of justice collide on the rooftops." },
  { id:"defenders", kind:"Series", season:"Crossover", title:"The Defenders", year:"2017", platform:"Streaming", runtime:"8 episodes",
    accent:"#7a2a8c", seed:207, director:"Douglas Petrie & Marco Ramirez", cast:"Charlie Cox · Krysten Ritter · Mike Colter · Finn Jones",
    trailer:"https://www.youtube.com/results?search_query=the+defenders+trailer",
    synopsis:"Four street-level heroes are forced together against the Hand. Daredevil drags his secret identity into a war he didn't choose." },
  { id:"nf_s3", kind:"Series", season:"Season 3", title:"Daredevil", year:"2018", platform:"Streaming", runtime:"13 episodes",
    accent:"#8c1119", seed:209, director:"Erik Oleson (showrunner)", cast:"Charlie Cox · Vincent D'Onofrio · Wilson Bethel · Deborah Ann Woll",
    trailer:"https://www.youtube.com/results?search_query=daredevil+netflix+season+3+trailer",
    synopsis:"A broken man claws back from the rubble while Fisk engineers a fake Daredevil. The closest the screen has come to 'Born Again.'" },
  { id:"echo", kind:"Series", season:"Spin-off", title:"Echo", year:"2024", platform:"Streaming", runtime:"5 episodes",
    accent:"#c98a2e", seed:211, director:"Sydney Freeland", cast:"Alaqua Cox · Vincent D'Onofrio · Charlie Cox",
    trailer:"https://www.youtube.com/results?search_query=echo+marvel+trailer",
    synopsis:"Maya Lopez returns home to escape Fisk's shadow — with the devil of Hell's Kitchen making a brief, bloody return appearance." },
  { id:"ba_s1", kind:"Series", season:"Season 1", title:"Daredevil: Born Again", year:"2025", platform:"Streaming", runtime:"9 episodes",
    accent:"#d6202b", seed:213, director:"Dario Scardapane (showrunner)", cast:"Charlie Cox · Vincent D'Onofrio · Margarita Levieva",
    trailer:"https://www.youtube.com/results?search_query=daredevil+born+again+trailer",
    synopsis:"Matt Murdock and Wilson Fisk both try to go straight — a lawyer and a mayor — until the masks come back on. The devil is reborn." },
  { id:"ba_s2", kind:"Series", season:"Season 2", title:"Daredevil: Born Again", year:"2026", platform:"Streaming", runtime:"Upcoming", upcoming:true,
    accent:"#e5121a", seed:215, director:"Dario Scardapane (showrunner)", cast:"Charlie Cox · Vincent D'Onofrio · Jon Bernthal",
    trailer:"https://www.youtube.com/results?search_query=daredevil+born+again+season+2",
    synopsis:"The fight for Hell's Kitchen escalates as the Punisher re-enters the picture. The next chapter of the reborn devil's war on Fisk's city." },
];

// helper: issues sorted by a key
export const DDR_byPub = () => [...DDR_ISSUES].sort((a,b)=> a.date < b.date ? -1 : 1);
export const DDR_byTL  = (order) => {
  if (order && order.length) {
    const idx = {}; order.forEach((id,i)=> idx[id]=i);
    return [...DDR_ISSUES].sort((a,b)=> (idx[a.id]??a.tl) - (idx[b.id]??b.tl));
  }
  return [...DDR_ISSUES].sort((a,b)=> a.tl - b.tl);
};
