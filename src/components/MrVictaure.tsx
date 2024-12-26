import { UserRound, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MrVictaure() {
  return (
    <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-victaure-blue/20 flex items-center justify-center">
          <Bot className="h-6 w-6 text-victaure-blue" />
        </div>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Mr. Victaure
            <Sparkles className="h-4 w-4 text-victaure-orange" />
          </h2>
          <p className="text-sm text-victaure-gray">Votre assistant personnel</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <Button className="w-full justify-start" variant="ghost">
          <UserRound className="mr-2 h-4 w-4" />
          Commencer une conversation
        </Button>
      </div>
    </div>
  );
}