
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PostImageGridProps {
  images: string[];
}

export function PostImageGrid({ images }: PostImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const getGridClassName = (length: number) => {
    switch (length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return isMobile ? "grid-cols-1" : "grid-cols-2";
      default:
        return isMobile ? "grid-cols-1" : "grid-cols-2";
    }
  };

  const getImageClassName = (index: number, length: number) => {
    if (length === 1) return "col-span-1 row-span-1 aspect-video";
    if (isMobile) {
      return "col-span-1 row-span-1 aspect-video";
    }
    if (length === 3 && index === 0) return "col-span-2 row-span-2 aspect-video";
    return "col-span-1 row-span-1 aspect-square";
  };

  if (!images.length) return null;

  return (
    <>
      <div className={cn(
        "grid gap-1 rounded-xl overflow-hidden",
        getGridClassName(images.length)
      )}>
        {images.slice(0, isMobile ? 2 : 4).map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative group cursor-pointer overflow-hidden",
              getImageClassName(index, images.length)
            )}
            onClick={() => setSelectedImage(image)}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />
            {image ? (
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <Image className="w-6 h-6 text-white/40" />
              </div>
            )}
            
            {/* Indicateur d'images supplémentaires */}
            {isMobile && index === 1 && images.length > 2 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-white font-medium text-lg">+{images.length - 2}</span>
              </div>
            )}
            
            {!isMobile && index === 3 && images.length > 4 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-white font-medium text-lg">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-full sm:max-w-4xl w-screen h-screen sm:h-auto p-0 m-0 bg-transparent border-none">
          <div className="relative w-full h-full flex items-center justify-center bg-black/90">
            <img
              src={selectedImage || ''}
              alt=""
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            {/* Navigation pour les images */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      img === selectedImage ? "bg-white" : "bg-white/40"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(img);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
