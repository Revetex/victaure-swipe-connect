
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, isOpen, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : images.length - 1;
      setIsLoading(true);
      return newIndex;
    });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev < images.length - 1 ? prev + 1 : 0;
      setIsLoading(true);
      return newIndex;
    });
  }, [images.length]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
        
        <div className="relative w-full h-full flex items-center justify-center bg-black/90">
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
                onClick={handlePrevious}
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
                onClick={handleNext}
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </>
          )}
          
          <div className="relative max-w-[90%] max-h-[90%]">
            {isLoading && (
              <Skeleton className="absolute inset-0 bg-gray-800/50" />
            )}
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
