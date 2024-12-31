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
      className="mt-4 space-y-2.5"
    >
      {email && (
        <motion.div 
          variants={item}
          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1.5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <Mail className="h-4 w-4" />
          </div>
          <span>{email}</span>
        </motion.div>
      )}
      {phone && (
        <motion.div 
          variants={item}
          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1.5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <Phone className="h-4 w-4" />
          </div>
          <span>{phone}</span>
        </motion.div>
      )}
      {city && (
        <motion.div 
          variants={item}
          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="p-1.5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
            <MapPin className="h-4 w-4" />
          </div>
          <span>{city}{state && `, ${state}`}</span>
        </motion.div>
      )}
    </motion.div>
  );
}