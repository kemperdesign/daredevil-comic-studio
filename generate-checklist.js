import fs from 'fs';

const checklist = [];
let idCounter = 1;

function addIssue(series, no, title, year) {
  checklist.push({
    id: `chk_${idCounter++}`,
    series,
    no,
    title: title || `${series} #${no}`,
    year
  });
}

// Generate Main Volumes
for (let i = 1; i <= 380; i++) addIssue("Daredevil Vol. 1", i, null, i < 100 ? "1960s" : i < 200 ? "1970s" : i < 300 ? "1980s" : "1990s");
for (let i = 1; i <= 119; i++) addIssue("Daredevil Vol. 2", i, null, "1998-2011");
for (let i = 1; i <= 36; i++) addIssue("Daredevil Vol. 3", i, null, "2011-2014");
for (let i = 1; i <= 18; i++) addIssue("Daredevil Vol. 4", i, null, "2014-2015");
for (let i = 1; i <= 28; i++) addIssue("Daredevil Vol. 5", i, null, "2015-2018");
for (let i = 1; i <= 36; i++) addIssue("Daredevil Vol. 6", i, null, "2019-2021");
for (let i = 1; i <= 14; i++) addIssue("Daredevil Vol. 7", i, null, "2022-2023");
for (let i = 1; i <= 15; i++) addIssue("Daredevil Vol. 8", i, null, "2023-Present");

// Append scraped list, ignoring ones that are clearly just "Daredevil Vol. X #Y"
const scrapedRaw = JSON.parse(fs.readFileSync('raw_list.json', 'utf8'));

for (let raw of scrapedRaw) {
  let skip = false;
  // If it's a standard volume, we already generated it
  if (raw.match(/^Daredevil Vol\. \d+ #\d+$/i)) skip = true;
  if (raw.match(/^Daredevil #\d+$/i)) skip = true;
  
  if (!skip) {
    addIssue("Other Appearances", "", raw, "Various");
  }
}

const jsContent = `export const DD_CHECKLIST = ${JSON.stringify(checklist, null, 2)};\n`;
fs.writeFileSync('src/checklist-data.js', jsContent);
console.log(`Generated src/checklist-data.js with ${checklist.length} issues`);
