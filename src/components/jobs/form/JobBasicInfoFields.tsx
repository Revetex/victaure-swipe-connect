
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LocationAutocomplete } from "@/components/map/LocationAutocomplete";
import { useGeolocation } from "@/hooks/useGeolocation";

export function JobBasicInfoFields() {
  const { control, setValue } = useFormContext();
  const { getAddressFromCoordinates } = useGeolocation();

  const handlePlaceSelected = async (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      setValue('latitude', lat);
      setValue('longitude', lng);
      
      if (place.formatted_address) {
        setValue('location', place.formatted_address);
      }
      
      const addressInfo = await getAddressFromCoordinates(lat, lng);
      if (addressInfo.city) {
        setValue('city', addressInfo.city);
      }
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
                apiKey={process.env.GOOGLE_MAPS_API_KEY || ""}
                placeholder="Entrez l'adresse du poste"
                onPlaceSelected={handlePlaceSelected}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
