import { jsPDF } from "jspdf";
import { ExtendedJsPDF } from "@/types/pdf";

export function extendPdfDocument(baseDoc: jsPDF): ExtendedJsPDF {
  const doc = baseDoc as ExtendedJsPDF;
  
  doc.setGlobalAlpha = function(alpha: number): ExtendedJsPDF {
    // @ts-ignore - This is a valid internal method
    this.internal.write(alpha + " g");
    return this;
  };

  doc.roundedRect = function(x: number, y: number, w: number, h: number, rx: number, ry: number, style: string): ExtendedJsPDF {
    const hp = this.internal.pageSize.getHeight();
    y = hp - y - h;
    
    this.setLineWidth(0.5);
    
    const c = 0.551915024494;
    
    this.lines(
      [
        [w - 2 * rx, 0],
        [rx * c, 0, rx, 0, rx, -ry],
        [0, -(h - 2 * ry)],
        [0, -ry * c, -rx, -ry, -rx, -ry],
        [-(w - 2 * rx), 0],
        [-rx * c, 0, -rx, 0, -rx, ry],
        [0, h - 2 * ry],
        [0, ry * c, rx, ry, rx, ry]
      ],
      x + rx,
      y + h - ry,
      [1, 1],
      style
    );
    
    return this;
  };

  doc.addSpace = function(space: number): number {
    const currentY = this.internal.getCurrentPageInfo().pageNumber === 1 
      ? this.internal.getCurrentPageInfo().pageNumber * space
      : this.internal.getCurrentPageInfo().pageNumber * space + 10;
    return currentY;
  };

  return doc;
}