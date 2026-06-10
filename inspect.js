import fs from 'fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = 'C:/Users/Damia/OneDrive/Desktop/DD/All Daredevil Comics.pdf';

async function run() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  console.log('Pages:', doc.numPages);
  
  const page1 = await doc.getPage(1);
  const textContent = await page1.getTextContent();
  console.log('Page 1 Text:', textContent.items.map(i => i.str).join(' ').substring(0, 200));
  
  const opList = await page1.getOperatorList();
  let imageCount = 0;
  for (let i = 0; i < opList.fnArray.length; i++) {
    if (opList.fnArray[i] === pdfjs.OPS.paintImageXObject) {
      imageCount++;
    }
  }
  console.log('Page 1 Images:', imageCount);
}

run().catch(console.error);
