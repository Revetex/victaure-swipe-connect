import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function DownloadApp() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
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

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('vcards')
        .getPublicUrl('victaure.apk');

      if (urlError || !publicUrl) {
        console.error('Error getting public URL:', urlError);
        toast.error("Erreur lors de la récupération du lien de téléchargement");
        return;
      }

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = publicUrl;
      link.setAttribute('download', 'victaure.apk');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      toast.success("Téléchargement démarré");
      console.log('Download URL:', publicUrl);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement de l'application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 bg-card rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">Télécharger l'application mobile</h3>
      <p className="text-sm text-muted-foreground text-center">
        Accédez à toutes les fonctionnalités de Victaure depuis votre téléphone Android
      </p>
      <Button 
        onClick={handleDownload} 
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        <Download className="w-4 h-4 mr-2" />
        {isLoading ? "Téléchargement..." : "Télécharger l'APK"}
      </Button>
    </div>
  );
}