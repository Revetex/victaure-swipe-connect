
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ExchangeRates {
  [key: string]: number;
}

const conversionRates = {
  length: {
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    ft: 3.28084,
    in: 39.3701,
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274,
  },
  temperature: {
    c: (value: number) => value,
    f: (value: number) => (value * 9/5) + 32,
    k: (value: number) => value + 273.15,
  }
};

export function useConverter() {
  const [conversionType, setConversionType] = useState("currency");
  const [fromUnit, setFromUnit] = useState("CAD");
  const [toUnit, setToUnit] = useState("USD");
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [cryptoRates, setCryptoRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Exchange Rates API (gratuite)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CAD');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Erreur lors de la récupération des taux de change:', error);
        toast.error("Erreur lors de la récupération des taux de change");
      }
    };

    const fetchCryptoRates = async () => {
      try {
        // CoinGecko API (gratuite, sans clé API requise)
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
      } catch (error) {
        console.error('Erreur lors de la récupération des taux crypto:', error);
        toast.error("Erreur lors de la récupération des taux crypto");
      }
    };

    if (conversionType === "currency") {
      fetchExchangeRates();
    } else if (conversionType === "crypto") {
      fetchCryptoRates();
    }
  }, [conversionType]);

  const handleConversion = () => {
    if (!conversionValue || isNaN(Number(conversionValue))) {
      toast.error("Veuillez entrer une valeur numérique valide");
      return;
    }

    const value = parseFloat(conversionValue);
    let result = 0;

    if (conversionType === "temperature") {
      const fromTemp = conversionRates.temperature[fromUnit as keyof typeof conversionRates.temperature](value);
      let toTemp = fromTemp;
      
      if (toUnit === "f") {
        toTemp = (fromTemp * 9/5) + 32;
      } else if (toUnit === "k") {
        toTemp = fromTemp + 273.15;
      }
      
      setConversionResult(toTemp.toFixed(2));
    } else if (conversionType === "currency" && exchangeRates[fromUnit] && exchangeRates[toUnit]) {
      // Conversion de devises en utilisant les taux en direct
      result = (value / exchangeRates[fromUnit]) * exchangeRates[toUnit];
      setConversionResult(result.toFixed(4));
    } else if (conversionType === "crypto" && cryptoRates[fromUnit] && cryptoRates[toUnit]) {
      // Conversion de crypto en utilisant les taux en direct
      result = (value / cryptoRates[fromUnit]) * cryptoRates[toUnit];
      setConversionResult(result.toFixed(8));
    } else {
      const rates = conversionRates[conversionType as keyof typeof conversionRates];
      if (!rates) return;
      
      const fromRate = rates[fromUnit as keyof typeof rates] as number;
      const toRate = rates[toUnit as keyof typeof rates] as number;
      
      result = (value / fromRate) * toRate;
      setConversionResult(result.toFixed(4));
    }
  };

  return {
    conversionType,
    fromUnit,
    toUnit,
    conversionValue,
    conversionResult,
    loading,
    setConversionType,
    setFromUnit,
    setToUnit,
    setConversionValue,
    handleConversion
  };
}
