
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LocationAutocomplete } from "@/components/map/LocationAutocomplete";
import { useGeolocation } from "@/hooks/useGeolocation";

export function JobBasicInfoFields() {
  const { control, setValue } = useFormContext();
  const { getAddressFromCoordinates } = useGeolocation();

  const handleLocationSelect = async (location: { latitude: number; longitude: number; name: string }) => {
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
    setValue('location', location.name);
    
    const addressInfo = await getAddressFromCoordinates(location.latitude, location.longitude);
    if (addressInfo.city) {
      setValue('city', addressInfo.city);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de l'offre</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Développeur Full Stack React/Node.js" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localisation</FormLabel>
            <FormControl>
              <LocationAutocomplete
                placeholder="Entrez l'adresse du poste"
                onLocationSelect={handleLocationSelect}
                defaultValue={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
