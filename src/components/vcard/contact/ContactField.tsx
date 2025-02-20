import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ContactFieldProps {
  icon: ReactNode;
  value: string;
  onChange?: (value: string) => void;
  isEditing?: boolean;
  placeholder?: string;
  delay?: number;
  href?: string;
}

export function ContactField({
  icon,
  value,
  onChange,
  isEditing,
  placeholder,
  delay = 0,
  href
}: ContactFieldProps) {
  const content = isEditing ? (
    <Input
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="h-8 bg-white/5 border-purple-500/20"
    />
  ) : href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-purple-500 hover:text-purple-400 transition-colors"
    >
      {value}
    </a>
  ) : (
    <span className="text-sm">{value}</span>
  );

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-2"
    >
      <span className="text-purple-500">{icon}</span>
      {content}
    </motion.div>
  );
}