import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { LocationMap } from "./LocationMap";
import { toast } from "sonner";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }));

    // If the changed field is city, trigger geocoding
    if (key === 'city' && value) {
      if (searchTimeout) clearTimeout(searchTimeout);
      setIsSearching(true);

      const timeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?country=ca&types=place&access_token=pk.eyJ1IjoidGJsYW5jaGV0IiwiYSI6ImNscmxvZGVlZjBjcmUya3BnZGxqbXJyMWsifQ.YkOYoJrZJBGXBEVGhGE-Ug`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const location = data.features[0];
            const [longitude, latitude] = location.center;
            const context = location.context || [];
            
            const region = context.find((item: any) => item.id.startsWith('region'))?.text || '';
            const postcode = context.find((item: any) => item.id.startsWith('postcode'))?.text || '';

            setProfile((prev: any) => ({
              ...prev,
              city: location.text,
              state: region,
              latitude,
              longitude,
              postal_code: postcode
            }));

            toast.success("Localisation mise à jour");
          }
        } catch (error) {
          console.error('Error fetching location data:', error);
          toast.error("Erreur lors de la mise à jour de la localisation");
        } finally {
          setIsSearching(false);
        }
      }, 1000);

      setSearchTimeout(timeout);
    }
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
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
            <div className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
              <field.icon className="h-4 w-4 text-gray-600 dark:text-white" />
            </div>
            {isEditing ? (
              <Input
                type={field.type}
                value={field.value || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="flex-1 bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/50"
              />
            ) : (
              <span className="text-gray-700 dark:text-gray-200">
                {field.value || "Non défini"}
              </span>
            )}
          </motion.div>
        ))}

        {profile.state && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
              <MapPin className="h-4 w-4 text-gray-600 dark:text-white" />
            </div>
            <span className="text-gray-700 dark:text-gray-200">
              {profile.state}, {profile.postal_code || ""}
            </span>
          </motion.div>
        )}

        {isEditing && (profile.latitude || profile.longitude) && (
          <LocationMap
            latitude={profile.latitude}
            longitude={profile.longitude}
            onLocationSelect={(lat, lng) => {
              setProfile((prev: any) => ({
                ...prev,
                latitude: lat,
                longitude: lng
              }));
            }}
            isEditing={isEditing}
          />
        )}
      </motion.div>
    </div>
  );
}