import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const contactFields = [
    {
      icon: Mail,
      value: profile.email,
      label: "Email",
      key: "email",
      type: "email",
      placeholder: "Votre email"
    },
    {
      icon: Phone,
      value: profile.phone,
      label: "Téléphone",
      key: "phone",
      type: "tel",
      placeholder: "Votre numéro de téléphone"
    },
    {
      icon: MapPin,
      value: profile.city,
      label: "Ville",
      key: "city",
      type: "text",
      placeholder: "Votre ville"
    }
  ];

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

  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Contact</h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-3 sm:gap-4"
      >
        {contactFields.map((field) => (
          <motion.div 
            key={field.key} 
            variants={item}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="p-1.5 sm:p-2 rounded-full bg-white/10">
              <field.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            {isEditing ? (
              <Input
                type={field.type}
                value={field.value || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="flex-1 text-sm sm:text-base bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            ) : (
              <span className="text-sm sm:text-base text-white/90">
                {field.value || "Non défini"}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}