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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact</h3>
      <motion.div 
        className="grid gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {contactFields.map((field, index) => (
          <div key={field.key} className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/5">
              <field.icon className="h-4 w-4 text-primary" />
            </div>
            {isEditing ? (
              <Input
                type={field.type}
                value={field.value || ""}
                onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="flex-1"
              />
            ) : (
              <span className="text-muted-foreground">
                {field.value || "Non défini"}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}