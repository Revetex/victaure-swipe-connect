
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";

interface PostImageGridProps {
  images: string[];
}

export function PostImageGrid({ images }: PostImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getGridClassName = (length: number) => {
    switch (length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      default:
        return "grid-cols-2";
    }
  };

  const getImageClassName = (index: number, length: number) => {
    if (length === 1) return "col-span-1 row-span-1 aspect-video";
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
        {images.slice(0, 4).map((image, index) => (
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
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 retina-optimize"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <Image className="w-6 h-6 text-white/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
          <img
            src={selectedImage || ''}
            alt=""
            className="w-full h-full object-contain rounded-lg retina-optimize"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
