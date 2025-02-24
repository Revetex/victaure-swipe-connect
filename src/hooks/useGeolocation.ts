
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Location } from '@/types/database/locations';

interface GeolocationState {
  location: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            loading: false,
            error: null
          });
        },
        (error) => {
          setState({
            location: null,
            loading: false,
            error: error.message
          });
          console.error('Erreur de géolocalisation:', error);
        }
      );
    } else {
      setState({
        location: null,
        loading: false,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur'
      });
    }
  }, []);

  const saveLocation = async (location: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('locations')
        .insert(location);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error("Erreur lors de l'enregistrement de la localisation");
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number, 
    longitude: number
  ): Promise<Partial<Location>> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const address = data.results[0];
        const addressComponents = address.address_components;

        const getComponent = (type: string) => {
          const component = addressComponents.find((c: any) => 
            c.types.includes(type)
          );
          return component ? component.long_name : undefined;
        };

        return {
          address: address.formatted_address,
          city: getComponent('locality'),
          state: getComponent('administrative_area_level_1'),
          country: getComponent('country')
        };
      }
      return {};
    } catch (error) {
      console.error('Error fetching address:', error);
      return {};
    }
  };

  return {
    ...state,
    saveLocation,
    getAddressFromCoordinates
  };
}
