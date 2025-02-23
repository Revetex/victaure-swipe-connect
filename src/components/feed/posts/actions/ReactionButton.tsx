import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
interface ReactionButtonProps {
  icon: LucideIcon;
  count: number;
  suffix?: string;
  isActive?: boolean;
  onClick: () => void;
  activeClassName?: string;
}
export function ReactionButton({
  icon: Icon,
  count,
  suffix,
  isActive,
  onClick,
  activeClassName
}: ReactionButtonProps) {
  return;
}