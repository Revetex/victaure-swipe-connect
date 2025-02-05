import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface LocationFieldsProps {
  city: string;
  state: string;
  country: string;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
}

export function LocationFields({
  city,
  state,
  country,
  isEditing,
  onChange
}: LocationFieldsProps) {
  if (isEditing) {
    return (
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2"
      >
        <MapPin className="h-4 w-4 text-purple-500" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
          <Input
            value={city || ""}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Ville"
            className="h-8 bg-white/5 border-purple-500/20"
          />
          <Input
            value={state || ""}
            onChange={(e) => onChange("state", e.target.value)}
            placeholder="Province"
            className="h-8 bg-white/5 border-purple-500/20"
          />
          <Input
            value={country || ""}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Pays"
            className="h-8 bg-white/5 border-purple-500/20"
          />
        </div>
      </motion.div>
    );
  }

  const location = [city, state, country].filter(Boolean).join(", ");
  
  return location ? (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-2"
    >
      <MapPin className="h-4 w-4 text-purple-500" />
      <span className="text-sm">{location}</span>
    </motion.div>
  ) : null;
}