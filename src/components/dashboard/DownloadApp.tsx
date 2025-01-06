import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const DownloadApp = () => {
  const apkUrl = "https://victaure.com/download/app.apk"; // Replace with your actual APK URL

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-card/50">
      <h3 className="text-lg font-semibold">Télécharger l'application</h3>
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG 
          value={apkUrl}
          size={150}
          level="H"
          includeMargin={true}
        />
      </div>
      <Button variant="outline" onClick={() => window.open(apkUrl, '_blank')}>
        <Download className="mr-2 h-4 w-4" />
        Télécharger l'APK
      </Button>
    </div>
  );
};