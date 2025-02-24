
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LegalDialogProps {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LegalDialog({ title, children, open, onOpenChange }: LegalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#1B2A4A] border-2 border-[#F1F0FB]/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4 text-[#F1F0FB]">{title}</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm prose-invert max-w-none text-[#F1F0FB]/80">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
