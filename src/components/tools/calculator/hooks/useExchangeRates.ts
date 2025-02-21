
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { ExchangeRates } from '../types';

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CAD');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des taux de change');
        }
        const data: ExchangeRates = await response.json();
        setRates(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (!rates || !rates.rates) return 0;
    
    const baseRate = rates.rates[fromCurrency] || 1;
    const targetRate = rates.rates[toCurrency] || 1;
    
    return Number(((amount / baseRate) * targetRate).toFixed(2));
  };

  return {
    rates,
    loading,
    error,
    convertAmount
  };
}
