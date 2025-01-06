import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export function UploadApk() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.apk')) {
      toast.error("Le fichier doit être un APK");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://mfjllillnpleasclqabb.supabase.co/functions/v1/upload-apk', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Échec du téléversement');
      }

      toast.success("APK téléversé avec succès");
    } catch (error) {
      console.error('Erreur de téléversement:', error);
      toast.error("Erreur lors du téléversement de l'APK");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold">Téléverser l'APK</h3>
      <p className="text-sm text-muted-foreground text-center">
        Sélectionnez le fichier APK de l'application Victaure
      </p>
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".apk"
          onChange={handleUpload}
          className="hidden"
          disabled={isUploading}
        />
        <Button 
          variant="outline"
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Téléversement..." : "Sélectionner l'APK"}
        </Button>
      </label>
    </div>
  );
}