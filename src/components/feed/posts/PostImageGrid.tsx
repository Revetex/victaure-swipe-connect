
import { Button } from "@/components/ui/button";
import { ImageViewer } from "./ImageViewer";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PostImageGridProps {
  images: string[];
}

export const PostImageGrid = ({ images }: PostImageGridProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) return null;

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            {image.toLowerCase().endsWith('.pdf') ? (
              <a 
                href={image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 bg-muted rounded hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <span className="text-sm">Voir le PDF</span>
                </div>
              </a>
            ) : (
              <div className="relative w-full h-48">
                {!loadedImages.has(index) && (
                  <Skeleton className="absolute inset-0 rounded" />
                )}
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className={`w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity border border-border ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  onLoad={() => handleImageLoad(index)}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <ImageViewer
        images={images.filter(img => !img.toLowerCase().endsWith('.pdf'))}
        initialIndex={selectedImageIndex || 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
      />
    </>
  );
};
