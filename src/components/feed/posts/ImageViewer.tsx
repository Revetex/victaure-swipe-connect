
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, isOpen, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  }, [handlePrevious, handleNext, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed inset-0 p-0 max-w-none max-h-none h-screen w-screen bg-black/95 border-none z-50"
        onKeyDown={handleKeyDown}
      >
        <VisuallyHidden asChild>
          <DialogTitle>Image {currentIndex + 1} sur {images.length}</DialogTitle>
        </VisuallyHidden>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-[#F2EBE4]" />
        </Button>
        
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
                onClick={handlePrevious}
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6 text-[#F2EBE4]" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
                onClick={handleNext}
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6 text-[#F2EBE4]" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm">
                <span className="text-[#F2EBE4] text-sm">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
