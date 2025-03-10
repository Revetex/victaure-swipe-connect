import { QRCodeSVG } from "qrcode.react";

export function VCardExpandedQR() {
  return (
    <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
      <QRCodeSVG
        value={window.location.href}
        size={120}
        level="H"
        includeMargin={true}
        className="rounded-lg"
      />
    </div>
  );
}