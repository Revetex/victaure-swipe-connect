
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentProps } from "@/types/payment";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface ZodiacSign {
  name: string;
  imageUrl: string;
  luckyNumbers: number[];
}

const zodiacSigns: ZodiacSign[] = [
  { name: "Aries", imageUrl: "/zodiac/aries.png", luckyNumbers: [3, 12, 21, 30] },
  { name: "Taurus", imageUrl: "/zodiac/taurus.png", luckyNumbers: [4, 13, 22, 31] },
  { name: "Gemini", imageUrl: "/zodiac/gemini.png", luckyNumbers: [5, 14, 23] },
  { name: "Cancer", imageUrl: "/zodiac/cancer.png", luckyNumbers: [6, 15, 24] },
  { name: "Leo", imageUrl: "/zodiac/leo.png", luckyNumbers: [7, 16, 25] },
  { name: "Virgo", imageUrl: "/zodiac/virgo.png", luckyNumbers: [8, 17, 26] },
  { name: "Libra", imageUrl: "/zodiac/libra.png", luckyNumbers: [9, 18, 27] },
  { name: "Scorpio", imageUrl: "/zodiac/scorpio.png", luckyNumbers: [1, 10, 19, 28] },
  { name: "Sagittarius", imageUrl: "/zodiac/sagittarius.png", luckyNumbers: [2, 11, 20, 29] },
  { name: "Capricorn", imageUrl: "/zodiac/capricorn.png", luckyNumbers: [3, 12, 21, 30] },
  { name: "Aquarius", imageUrl: "/zodiac/aquarius.png", luckyNumbers: [4, 13, 22, 31] },
  { name: "Pisces", imageUrl: "/zodiac/pisces.png", luckyNumbers: [5, 14, 23] },
];

export function ZodiacFortune({ onPaymentRequested }: PaymentProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [spin, setSpin] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (spin) {
      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * zodiacSigns.length);
        setSelectedSign(zodiacSigns[randomIndex]);
        setSpin(false);
        setShowResult(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [spin]);

  const handleSpin = async () => {
    try {
      await onPaymentRequested(2, "Zodiac Fortune Game");
      setSpin(true);
      setShowResult(false);
    } catch (error) {
      toast.error("Erreur lors du paiement");
      console.error("Payment error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className={`p-4 ${isMobile ? 'sm:p-6' : 'p-6'} flex flex-col items-center`}>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Zodiac Fortune</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 text-center">
          Tournez la roue pour découvrir votre fortune zodiacale !
        </p>

        <div className={`relative ${isMobile ? 'w-36 h-36' : 'w-48 h-48'} mb-4`}>
          {spin ? (
            <motion.img
              src="/zodiac/wheel.png"
              alt="Spinning Wheel"
              className="w-full h-full object-contain animate-spin"
              style={{ animationDuration: '3s' }}
            />
          ) : selectedSign ? (
            <motion.img
              key={selectedSign.name}
              src={selectedSign.imageUrl}
              alt={selectedSign.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <img
              src="/zodiac/placeholder.png"
              alt="Placeholder"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {showResult && selectedSign && (
          <div className="text-center mt-4 space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">{selectedSign.name}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Numéros chance : {selectedSign.luckyNumbers.join(", ")}
            </p>
          </div>
        )}

        <Button 
          onClick={handleSpin} 
          disabled={spin} 
          className="mt-4 w-full sm:w-auto"
          size={isMobile ? "sm" : "default"}
        >
          {spin ? "Tirage en cours..." : "Tirer (2 CAD$)"}
        </Button>
      </CardContent>
    </Card>
  );
}

