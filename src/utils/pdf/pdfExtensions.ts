import { jsPDF } from "jspdf";
import { ExtendedJsPDF } from "@/types/pdf";

export function extendPdfDocument(doc: jsPDF): ExtendedJsPDF {
  const extendedDoc = doc as ExtendedJsPDF;

  // Add setGlobalAlpha method
  extendedDoc.setGlobalAlpha = function(alpha: number): ExtendedJsPDF {
    this.internal.write(`${alpha} gs`);
    return this;
  };

  // Add roundedRect method
  extendedDoc.roundedRect = function(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style: string
  ): ExtendedJsPDF {
    const k = this.internal.scaleFactor;
    rx = rx * k;
    ry = ry * k;
    w = w * k;
    h = h * k;
    x = x * k;
    y = y * k;

    const ops = [
      { op: 'm', c: [x + rx, y] },
      { op: 'l', c: [x + w - rx, y] },
      { op: 'c', c: [x + w - rx / 2, y, x + w, y + ry / 2, x + w, y + ry] },
      { op: 'l', c: [x + w, y + h - ry] },
      { op: 'c', c: [x + w, y + h - ry / 2, x + w - rx / 2, y + h, x + w - rx, y + h] },
      { op: 'l', c: [x + rx, y + h] },
      { op: 'c', c: [x + rx / 2, y + h, x, y + h - ry / 2, x, y + h - ry] },
      { op: 'l', c: [x, y + ry] },
      { op: 'c', c: [x, y + ry / 2, x + rx / 2, y, x + rx, y] }
    ];

    ops.forEach(({ op, c }) => {
      if (op === 'm') this.internal.out(`${c[0].toFixed(2)} ${c[1].toFixed(2)} m`);
      else if (op === 'l') this.internal.out(`${c[0].toFixed(2)} ${c[1].toFixed(2)} l`);
      else if (op === 'c')
        this.internal.out(
          `${c[0].toFixed(2)} ${c[1].toFixed(2)} ${c[2].toFixed(2)} ${c[3].toFixed(2)} ${c[4].toFixed(
            2
          )} ${c[5].toFixed(2)} c`
        );
    });

    if (style === 'F') this.internal.out('f');
    else if (style === 'FD' || style === 'DF') this.internal.out('B');
    else this.internal.out('S');

    return this;
  };

  // Add addSpace method
  extendedDoc.addSpace = function(space: number): number {
    return space;
  };

  return extendedDoc;
}