
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, isOpen, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="fixed inset-0 p-0 max-w-none max-h-none h-screen w-screen bg-black/95 border-none z-50">
        <VisuallyHidden asChild>
          <DialogTitle>Visualisation d'image {currentIndex + 1} sur {images.length}</DialogTitle>
        </VisuallyHidden>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </>
          )}
          
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-[90%] max-h-[90vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
