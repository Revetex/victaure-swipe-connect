import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface SignupInputProps {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  Icon: LucideIcon;
}

export function SignupInput({
  id,
  label,
  placeholder,
  type,
  value,
  onChange,
  disabled,
  Icon
}: SignupInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="pl-10"
        />
      </div>
    </div>
  );
}