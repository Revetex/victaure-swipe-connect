
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    name: string;
  }) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export function LocationAutocomplete({
  onLocationSelect,
  placeholder = "Entrez une adresse...",
  defaultValue = "",
  className = ""
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'ca' },
          fields: ['geometry', 'formatted_address']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (place.geometry && place.geometry.location) {
            onLocationSelect({
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              name: place.formatted_address || inputValue
            });
            setInputValue(place.formatted_address || inputValue);
          }
        });

        autocompleteRef.current = autocomplete;
      }
    };

    initAutocomplete();
  }, [onLocationSelect]);

  return (
    <div className="relative">
      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={`pl-8 ${className}`}
      />
    </div>
  );
}
