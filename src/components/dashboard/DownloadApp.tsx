import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DownloadApp = () => {
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('vcards')
        .createSignedUrl('victaure.apk', 60); // URL valide pendant 60 secondes

      if (error) {
        console.error('Error getting download URL:', error);
        toast.error("Erreur lors du téléchargement de l'application");
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement de l'application");
    }
  };

  // On utilise la même URL pour le QR code
  const publicUrl = `${supabase.storageUrl}/object/public/vcards/victaure.apk`;

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-card/50">
      <h3 className="text-lg font-semibold">Télécharger l'application</h3>
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG 
          value={publicUrl}
          size={150}
          level="H"
          includeMargin={true}
        />
      </div>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Télécharger l'APK
      </Button>
    </div>
  );
};