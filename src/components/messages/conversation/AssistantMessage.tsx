import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
interface AssistantMessageProps {
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
}
export function AssistantMessage({
  chatMessages,
  onSelectConversation
}: AssistantMessageProps) {
  return;
}