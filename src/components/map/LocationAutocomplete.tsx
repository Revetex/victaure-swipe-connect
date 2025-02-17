
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader } from '@googlemaps/js-api-loader';

interface LocationAutocompleteProps {
  apiKey: string;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocomplete({
  apiKey,
  onPlaceSelected,
  placeholder = "Entrez une adresse",
  className
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();
        
        if (inputRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: "ca" },
            fields: ["address_components", "geometry", "formatted_address"]
          });

          if (onPlaceSelected) {
            autocompleteRef.current.addListener("place_changed", () => {
              const place = autocompleteRef.current?.getPlace();
              if (place) {
                onPlaceSelected(place);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      } finally {
        setLoading(false);
      }
    };

    initAutocomplete();
  }, [apiKey, onPlaceSelected]);

  if (loading) {
    return <div className="h-4 w-4 animate-spin" />;
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={className}
    />
  );
}
