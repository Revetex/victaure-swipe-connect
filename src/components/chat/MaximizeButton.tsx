import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MaximizeButtonProps {
  isMaximized: boolean;
  onToggle: () => void;
}

export function MaximizeButton({ isMaximized, onToggle }: MaximizeButtonProps) {
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute top-4 right-4 hover:bg-victaure-blue/10"
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isMaximized ? t("mrVictaure.minimize") : t("mrVictaure.maximize")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}