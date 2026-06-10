import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export async function generatePdfThumbnail(fileBlob) {
  try {
    const arrayBuffer = await fileBlob.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 1 });
    const scale = 500 / viewport.height;
    const scaledViewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    
    const renderContext = {
      canvasContext: canvas.getContext('2d'),
      viewport: scaledViewport
    };
    await page.render(renderContext).promise;
    
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch(e) {
    console.error("Thumbnail generation failed", e);
    return null;
  }
}
