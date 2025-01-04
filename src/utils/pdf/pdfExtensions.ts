import { jsPDF } from "jspdf";
import { ExtendedJsPDF } from "@/types/pdf";

export function extendPdfDocument(baseDoc: jsPDF): ExtendedJsPDF {
  const doc = baseDoc as unknown as ExtendedJsPDF;
  
  doc.setGlobalAlpha = function(alpha: number) {
    // @ts-ignore - This is a valid internal method
    this.internal.write(alpha + " g");
  };

  doc.roundedRect = function(x: number, y: number, w: number, h: number, rx: number, ry: number, style: string) {
    const r = rx;
    const hp = this.internal.pageSize.getHeight();
    
    y = hp - y - h;
    
    this.setLineWidth(0.5);
    
    const c = 0.551915024494;
    
    this.lines(
      [
        [w - 2 * r, 0],
        [r * c, 0, r, 0, r, -r],
        [0, -(h - 2 * r)],
        [0, -r * c, -r, -r, -r, -r],
        [-(w - 2 * r), 0],
        [-r * c, 0, -r, 0, -r, r],
        [0, h - 2 * r],
        [0, r * c, r, r, r, r]
      ],
      x + r,
      y + h - r,
      [1, 1],
      style
    );
    
    return this;
  };

  doc.addSpace = function(currentY: number, space: number) {
    return currentY + space;
  };

  return doc;
}