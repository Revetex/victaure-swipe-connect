
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Location } from '@/types/database/locations';

export function useGeolocation() {
  const [loading, setLoading] = useState(false);

  const saveLocation = async (location: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('locations')
        .insert(location);

      if (error) throw error;
      toast.success('Localisation enregistrée avec succès');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error("Erreur lors de l'enregistrement de la localisation");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error)
      );
    });
  }, []);

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
    loading,
    saveLocation,
    getCurrentPosition,
    getAddressFromCoordinates
  };
}
