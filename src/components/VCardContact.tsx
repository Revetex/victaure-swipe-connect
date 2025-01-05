import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface VCardContactProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddressSearch = async (search: string) => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeout) clearTimeout(searchTimeout);
    setIsSearching(true);

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(search)}.json?country=ca&types=address&access_token=pk.eyJ1IjoidGJsYW5jaGV0IiwiYSI6ImNscmxvZGVlZjBjcmUya3BnZGxqbXJyMWsifQ.YkOYoJrZJBGXBEVGhGE-Ug`
        );
        const data = await response.json();
        setSearchResults(data.features || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error("Erreur lors de la recherche d'adresses");
      } finally {
        setIsSearching(false);
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleAddressSelect = (location: any) => {
    const [longitude, latitude] = location.center;
    const address = location.place_name;
    const city = location.context?.find((item: any) => item.id.startsWith('place'))?.text || '';
    const region = location.context?.find((item: any) => item.id.startsWith('region'))?.text || '';
    const postcode = location.context?.find((item: any) => item.id.startsWith('postcode'))?.text || '';

    setProfile((prev: any) => ({
      ...prev,
      city,
      state: region,
      latitude,
      longitude,
      address,
      postal_code: postcode
    }));

    setIsOpen(false);
    toast.success("Adresse mise à jour avec succès");
  };

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

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-3"
        >
          <div className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
            <MapPin className="h-4 w-4 text-gray-600 dark:text-white" />
          </div>
          {isEditing ? (
            <div className="flex-1">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="w-full justify-between"
                  >
                    {profile.address || "Rechercher une adresse"}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Entrez une adresse..."
                      onValueChange={handleAddressSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Aucune adresse trouvée.</CommandEmpty>
                      {searchResults.map((result) => (
                        <CommandItem
                          key={result.id}
                          value={result.place_name}
                          onSelect={() => handleAddressSelect(result)}
                        >
                          {result.place_name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-gray-700 dark:text-gray-200 block">
                {profile.address || "Adresse non définie"}
              </span>
              {profile.city && (
                <span className="text-gray-600 dark:text-gray-300 text-sm block">
                  {profile.city}, {profile.state} {profile.postal_code}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}