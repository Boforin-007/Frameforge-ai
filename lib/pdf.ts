import { PDFDocument } from "pdf-lib";

/** Builds a multi-page PDF, one card image per page. */
export async function buildPdf(pngBuffers: Buffer[]) {
  const pdf = await PDFDocument.create();
  for (const buffer of pngBuffers) {
    const image = await pdf.embedPng(buffer);
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return Buffer.from(await pdf.save());
}