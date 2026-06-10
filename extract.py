import fitz
import os

pdf_path = "C:/Users/Damia/OneDrive/Desktop/DD/All Daredevil Comics.pdf"
out_dir = "public/covers/raw"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
img_idx = 1
for i in range(len(doc)):
    for img in doc.get_page_images(i):
        xref = img[0]
        pix = fitz.Pixmap(doc, xref)
        if pix.n - pix.alpha < 4:
            pix.save(f"{out_dir}/{img_idx:03d}.jpg")
        else:
            pix1 = fitz.Pixmap(fitz.csRGB, pix)
            pix1.save(f"{out_dir}/{img_idx:03d}.jpg")
            pix1 = None
        pix = None
        img_idx += 1
print(f"Extracted {img_idx-1} images")
