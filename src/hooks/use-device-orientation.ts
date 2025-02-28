
import { useState, useEffect } from 'react';

type Orientation = 'portrait' | 'landscape';

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<Orientation>(
    typeof window !== 'undefined' 
      ? window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      : 'portrait'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', handleResize);
    
    // Gestion spécifique de l'événement d'orientation pour les appareils mobiles
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleResize);
    } else if ('orientation' in window) {
      window.addEventListener('orientationchange', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleResize);
      } else if ('orientation' in window) {
        window.removeEventListener('orientationchange', handleResize);
      }
    };
  }, []);

  return orientation;
}
