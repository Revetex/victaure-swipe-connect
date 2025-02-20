
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useListingImages() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImagePreview = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      const urls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async () => {
    const uploadedImageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `marketplace/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        return filePath;
      })
    );

    return uploadedImageUrls;
  };

  const resetImages = () => {
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImageUrls([]);
  };

  return {
    imageFiles,
    imageUrls,
    handleImagePreview,
    removeImage,
    uploadImages,
    resetImages
  };
}
