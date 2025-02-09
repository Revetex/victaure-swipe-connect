
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavigationItem } from "./NavigationItem";
import { NavigationSectionProps } from "./types";

export function NavigationSection({ section, isOpen, onToggle }: NavigationSectionProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="space-y-1"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between px-2 py-1 h-8 text-sm"
        >
          <span className="font-medium">{section.title}</span>
          {isOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {section.items.map((item) => (
          <NavigationItem key={item.to} {...item} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
