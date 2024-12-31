import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export interface VCardContactInfoProps {
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export function VCardContactInfo({ email, phone, city, state }: VCardContactInfoProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-2 space-y-1.5"
    >
      {email && (
        <motion.div 
          variants={item}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/90 hover:text-foreground transition-colors group"
        >
          <div className="p-1 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <Mail className="h-3 w-3" />
          </div>
          <span className="truncate">{email}</span>
        </motion.div>
      )}
      {phone && (
        <motion.div 
          variants={item}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/90 hover:text-foreground transition-colors group"
        >
          <div className="p-1 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <Phone className="h-3 w-3" />
          </div>
          <span className="truncate">{phone}</span>
        </motion.div>
      )}
      {(city || state) && (
        <motion.div 
          variants={item}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/90 hover:text-foreground transition-colors group"
        >
          <div className="p-1 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <MapPin className="h-3 w-3" />
          </div>
          <span className="truncate">
            {city}{state && `, ${state}`}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}