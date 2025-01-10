import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const { selectedStyle } = useVCardStyle();
  
  const handleInputChange = (key: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }));
  };

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

  return (
    <div className="space-y-4">
      <h3 
        className="text-lg font-semibold"
        style={{ 
          color: selectedStyle.colors.text.primary,
          fontFamily: selectedStyle.font
        }}
      >
        Contact
      </h3>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4"
      >
        {contactFields.map((field) => (
          <motion.div 
            key={field.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div 
              className="p-2 rounded-full"
              style={{ 
                backgroundColor: `${selectedStyle.colors.primary}20`,
                color: selectedStyle.colors.primary 
              }}
            >
              <field.icon className="h-4 w-4" />
            </div>
            {isEditing ? (
              <Input
                type={field.type}
                value={field.value || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                style={{
                  color: selectedStyle.colors.text.primary
                }}
              />
            ) : (
              <span 
                className="text-base"
                style={{ 
                  color: selectedStyle.colors.text.secondary,
                  fontFamily: selectedStyle.font
                }}
              >
                {field.value || "Non défini"}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}