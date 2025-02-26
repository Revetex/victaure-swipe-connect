
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <Button 
        className="rounded-full w-12 h-12 bg-[#64B5D9] text-white shadow-lg"
        size="icon"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
