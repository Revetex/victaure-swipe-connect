import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DownloadApp = () => {
  const { toast } = useToast();
  // L'URL de votre APK - à remplacer par l'URL réelle une fois déployée
  const apkUrl = "http://localhost:5173/victaure.apk";

  const handleDirectDownload = () => {
    window.location.href = apkUrl;
    toast({
      title: "Téléchargement démarré",
      description: "L'application va commencer à se télécharger automatiquement",
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Télécharger l'application</h3>
      
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG 
          value={apkUrl}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <p className="text-sm text-gray-600 text-center">
        Scannez le QR code avec votre téléphone Android
        ou cliquez sur le bouton ci-dessous
      </p>

      <Button 
        onClick={handleDirectDownload}
        className="w-full"
      >
        <Download className="mr-2 h-4 w-4" />
        Télécharger l'APK
      </Button>
    </div>
  );
};

export default DownloadApp;