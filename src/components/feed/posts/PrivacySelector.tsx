
import { Globe, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostPrivacyLevel } from "./types";
import { cn } from "@/lib/utils";

interface PrivacySelectorProps {
  value: PostPrivacyLevel;
  onChange: (value: PostPrivacyLevel) => void;
  className?: string;
}

export function PrivacySelector({ value, onChange, className }: PrivacySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange as (value: string) => void}>
      <SelectTrigger className={cn("w-[180px] h-9", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Public</span>
          </div>
        </SelectItem>
        <SelectItem value="connections">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Connexions uniquement</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
