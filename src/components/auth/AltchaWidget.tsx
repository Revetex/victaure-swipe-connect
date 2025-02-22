
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    altchaCallback: (token: string) => void;
  }
}

interface AltchaWidgetProps {
  onVerify: (isValid: boolean) => void;
}

export function AltchaWidget({ onVerify }: AltchaWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fonction de callback pour ALTCHA
    window.altchaCallback = async (token: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-altcha', {
          body: { token }
        });

        if (error) throw error;
        onVerify(data.success);

        if (data.success) {
          toast.success('Vérification réussie');
        } else {
          toast.error('Vérification échouée');
        }
      } catch (error) {
        console.error('Erreur de vérification:', error);
        toast.error('Erreur lors de la vérification');
        onVerify(false);
      }
    };

    // Charger le script ALTCHA
    const script = document.createElement('script');
    script.src = 'https://www.altcha.org/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Nettoyage
      document.head.removeChild(script);
      delete window.altchaCallback;
    };
  }, [onVerify]);

  return (
    <div className="w-full flex justify-center my-4">
      <div
        ref={widgetRef}
        data-altcha-widget
        data-callback="altchaCallback"
      />
    </div>
  );
}
