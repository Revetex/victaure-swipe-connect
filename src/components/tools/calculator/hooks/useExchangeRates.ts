
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { ExchangeRates, Rate } from '../types';

export function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [cryptoRates, setCryptoRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);

  const saveRate = async (fromCurrency: string, toCurrency: string, rate: number, type: string) => {
    try {
      const { error } = await supabase
        .from('exchange_rates')
        .upsert({
          from_currency: fromCurrency,
          to_currency: toCurrency,
          rate: rate,
          type: type,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving rate:', error);
      // Don't show error to user as this is a background operation
    }
  };

  const fetchSavedRates = async (type: string) => {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('type', type)
        .gt('last_updated', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      if (data && data.length > 0) {
        const rates: ExchangeRates = {};
        data.forEach((rate: Rate) => {
          rates[rate.to_currency] = rate.rate;
        });
        return rates;
      }
      return null;
    } catch (error) {
      console.error('Error fetching saved rates:', error);
      return null;
    }
  };

  const fetchCurrencyRates = async () => {
    setLoading(true);
    const savedRates = await fetchSavedRates('currency');
    
    if (savedRates) {
      setExchangeRates(savedRates);
    } else {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CAD');
        const data = await response.json();
        setExchangeRates(data.rates);
        
        // Save each rate individually
        for (const [currency, rate] of Object.entries(data.rates)) {
          await saveRate('CAD', currency, rate as number, 'currency');
        }
      } catch (error) {
        console.error('Error fetching currency rates:', error);
        toast.error("Error fetching currency rates");
      }
    }
    setLoading(false);
  };

  const fetchCryptoRates = async () => {
    setLoading(true);
    const savedRates = await fetchSavedRates('crypto');
    
    if (savedRates) {
      setCryptoRates(savedRates);
    } else {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,solana,dogecoin&vs_currencies=cad');
        const data = await response.json();
        
        const rates: ExchangeRates = {
          BTC: 1 / data.bitcoin.cad,
          ETH: 1 / data.ethereum.cad,
          XRP: 1 / data.ripple.cad,
          ADA: 1 / data.cardano.cad,
          SOL: 1 / data.solana.cad,
          DOGE: 1 / data.dogecoin.cad,
        };
        
        setCryptoRates(rates);
        
        // Save each rate individually
        for (const [currency, rate] of Object.entries(rates)) {
          await saveRate('CAD', currency, rate, 'crypto');
        }
      } catch (error) {
        console.error('Error fetching crypto rates:', error);
        toast.error("Error fetching crypto rates");
      }
    }
    setLoading(false);
  };

  return {
    exchangeRates,
    cryptoRates,
    loading,
    fetchCurrencyRates,
    fetchCryptoRates
  };
}
