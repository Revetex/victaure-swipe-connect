
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PyramidLevelProps {
  level: number;
  maxNumbers: number;
  selectedNumbers: number[];
  onNumberSelect: (number: number) => void;
}

export function PyramidLevel({ level, maxNumbers, selectedNumbers, onNumberSelect }: PyramidLevelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-5 gap-4"
    >
      {Array.from({ length: maxNumbers }, (_, i) => i + 1).map((number) => (
        <Button
          key={number}
          variant={selectedNumbers.includes(number) ? "default" : "outline"}
          onClick={() => onNumberSelect(number)}
          className="h-12 w-12 p-0 font-semibold"
        >
          {number}
        </Button>
      ))}
    </motion.div>
  );
}
