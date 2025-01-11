import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { ColorPicker } from "./vcard/ColorPicker";
import { toast } from "sonner";

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

  const handleColorChange = (colorType: string, color: string) => {
    setProfile((prev: any) => ({ 
      ...prev, 
      [`custom_${colorType}`]: color 
    }));
    toast.success(`Couleur ${colorType} mise à jour`);
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
        className="text-lg font-semibold text-primary"
        style={{ 
          fontFamily: selectedStyle.font,
          color: profile.custom_text_color || selectedStyle.colors.text.primary
        }}
      >
        Contact
      </h3>

      {isEditing && (
        <div className="space-y-4 p-4 bg-card rounded-lg border">
          <div className="space-y-2">
            <label className="text-sm font-medium">Couleur du texte</label>
            <ColorPicker
              color={profile.custom_text_color || selectedStyle.colors.text.primary}
              onChange={(color) => handleColorChange('text_color', color)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Couleur de fond</label>
            <ColorPicker
              color={profile.custom_background || selectedStyle.colors.background.card}
              onChange={(color) => handleColorChange('background', color)}
              className="w-full"
            />
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4"
        style={{
          backgroundColor: profile.custom_background || 'transparent'
        }}
      >
        {contactFields.map((field) => (
          <motion.div 
            key={field.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div 
              className="p-2 rounded-full bg-primary/10"
              style={{
                backgroundColor: `${profile.custom_background || selectedStyle.colors.primary}15`
              }}
            >
              <field.icon 
                className="h-4 w-4 text-primary"
                style={{
                  color: profile.custom_text_color || selectedStyle.colors.primary
                }}
              />
            </div>
            {isEditing ? (
              <Input
                type={field.type}
                value={field.value || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="flex-1 bg-background border-border"
                style={{
                  color: profile.custom_text_color || selectedStyle.colors.text.primary,
                  backgroundColor: profile.custom_background || selectedStyle.colors.background.card
                }}
              />
            ) : (
              <span 
                className="text-base text-muted-foreground"
                style={{ 
                  fontFamily: selectedStyle.font,
                  color: profile.custom_text_color || selectedStyle.colors.text.primary
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