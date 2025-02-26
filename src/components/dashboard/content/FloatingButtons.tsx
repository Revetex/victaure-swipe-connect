
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        className="rounded-full w-12 h-12 bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white shadow-lg transition-all"
        size="icon"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
