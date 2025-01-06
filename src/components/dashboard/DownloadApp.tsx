import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DownloadApp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // First check if the file exists
      const { data: fileExists } = await supabase.storage
        .from('vcards')
        .list('', {
          search: 'victaure.apk'
        });

      if (!fileExists || fileExists.length === 0) {
        toast.error("Le fichier APK n'est pas disponible pour le moment");
        return;
      }

      const { data, error } = await supabase.storage
        .from('vcards')
        .createSignedUrl('victaure.apk', 60);

      if (error) {
        console.error('Error getting download URL:', error);
        toast.error("Erreur lors du téléchargement de l'application");
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
        toast.success("Téléchargement démarré");
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement de l'application");
    } finally {
      setIsLoading(false);
    }
  };

  // Get the public URL for the QR code
  const { data } = supabase.storage
    .from('vcards')
    .getPublicUrl('victaure.apk');

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-card/50">
      <h3 className="text-lg font-semibold">Télécharger l'application</h3>
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG 
          value={data.publicUrl}
          size={150}
          level="H"
          includeMargin={true}
        />
      </div>
      <Button 
        variant="outline" 
        onClick={handleDownload}
        disabled={isLoading}
      >
        <Download className="mr-2 h-4 w-4" />
        {isLoading ? 'Chargement...' : 'Télécharger l\'APK'}
      </Button>
    </div>
  );
};