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
      const { data: fileExists, error: listError } = await supabase.storage
        .from('vcards')
        .list('', {
          search: 'victaure.apk'
        });

      if (listError) {
        console.error('Error checking file:', listError);
        toast.error("Erreur lors de la vérification du fichier");
        return;
      }

      if (!fileExists || fileExists.length === 0) {
        toast.error("Le fichier APK n'est pas disponible pour le moment");
        return;
      }

      // Get the download URL
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from('vcards')
        .download('victaure.apk');

      if (downloadError) {
        console.error('Error downloading file:', downloadError);
        toast.error("Erreur lors du téléchargement de l'application");
        return;
      }

      // Create a download link
      const url = window.URL.createObjectURL(downloadData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'victaure.apk');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Téléchargement démarré");
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