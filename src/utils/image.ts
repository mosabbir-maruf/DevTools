import { ExportFormat } from '../types';

export async function downloadImage(
  dataUrl: string,
  filename: string
): Promise<void> {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate a PDF whose page is sized exactly to the screenshot dimensions.
 * The image fills the whole page — no margins, no scaling.
 * Portrait or landscape is chosen automatically based on aspect ratio.
 */
export async function downloadAsPdf(
  dataUrl: string,
  filename: string,
  widthPx: number,
  heightPx: number
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  // jsPDF works in mm internally. Convert px → mm at 96 dpi.
  const PX_PER_MM = 96 / 25.4; // ≈ 3.7795
  const wMm = widthPx  / PX_PER_MM;
  const hMm = heightPx / PX_PER_MM;

  const orientation = widthPx >= heightPx ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [wMm, hMm],
    compress: true,
  });

  // Strip the data-URL prefix to get the raw base64 payload
  const base64 = dataUrl.split(',')[1];
  pdf.addImage(base64, 'PNG', 0, 0, wMm, hMm, undefined, 'FAST');
  pdf.save(filename);
}

export function generateFilename(format: ExportFormat): string {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `DevTools-${timestamp}.${format}`;
}
