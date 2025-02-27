
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalculatorKeypadProps {
  onNumber: (num: string) => void;
  onOperation: (op: string) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CalculatorKeypad({
  onNumber,
  onOperation,
  onCalculate,
  onClear
}: CalculatorKeypadProps) {
  const isMobile = useIsMobile();

  // Animation variants for buttons
  const buttonVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    tap: { scale: 0.95 }
  };

  const buttonClass = cn(
    "relative text-lg md:text-xl font-semibold transition-all duration-200",
    "bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm",
    "border border-white/10 shadow-sm hover:shadow-md hover:border-primary/30",
    isMobile ? "h-16" : "h-14",
    "rounded-xl"
  );

  const numberButtonClass = cn(
    buttonClass,
    "hover:bg-primary/10 text-foreground"
  );

  const operationButtonClass = cn(
    buttonClass,
    "bg-primary/20 hover:bg-primary/30 text-primary"
  );

  const equalButtonClass = cn(
    buttonClass,
    "bg-primary hover:bg-primary/90 text-primary-foreground"
  );

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {/* Première rangée */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.05 }}
        className="col-span-2"
      >
        <Button 
          onClick={onClear} 
          variant="outline" 
          className={cn(buttonClass, "w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30")}
        >
          C
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.1 }}
      >
        <Button 
          onClick={() => onOperation("%")} 
          variant="outline" 
          className={operationButtonClass}
        >
          %
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.15 }}
      >
        <Button 
          onClick={() => onOperation("/")} 
          variant="outline" 
          className={operationButtonClass}
        >
          ÷
        </Button>
      </motion.div>

      {/* Ligne 2 */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.2 }}
      >
        <Button 
          onClick={() => onNumber("7")} 
          variant="outline" 
          className={numberButtonClass}
        >
          7
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.25 }}
      >
        <Button 
          onClick={() => onNumber("8")} 
          variant="outline" 
          className={numberButtonClass}
        >
          8
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.3 }}
      >
        <Button 
          onClick={() => onNumber("9")} 
          variant="outline" 
          className={numberButtonClass}
        >
          9
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.35 }}
      >
        <Button 
          onClick={() => onOperation("*")} 
          variant="outline" 
          className={operationButtonClass}
        >
          ×
        </Button>
      </motion.div>

      {/* Ligne 3 */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.4 }}
      >
        <Button 
          onClick={() => onNumber("4")} 
          variant="outline" 
          className={numberButtonClass}
        >
          4
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.45 }}
      >
        <Button 
          onClick={() => onNumber("5")} 
          variant="outline" 
          className={numberButtonClass}
        >
          5
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.5 }}
      >
        <Button 
          onClick={() => onNumber("6")} 
          variant="outline" 
          className={numberButtonClass}
        >
          6
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.55 }}
      >
        <Button 
          onClick={() => onOperation("-")} 
          variant="outline" 
          className={operationButtonClass}
        >
          -
        </Button>
      </motion.div>

      {/* Ligne 4 */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.6 }}
      >
        <Button 
          onClick={() => onNumber("1")} 
          variant="outline" 
          className={numberButtonClass}
        >
          1
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.65 }}
      >
        <Button 
          onClick={() => onNumber("2")} 
          variant="outline" 
          className={numberButtonClass}
        >
          2
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.7 }}
      >
        <Button 
          onClick={() => onNumber("3")} 
          variant="outline" 
          className={numberButtonClass}
        >
          3
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.75 }}
      >
        <Button 
          onClick={() => onOperation("+")} 
          variant="outline" 
          className={operationButtonClass}
        >
          +
        </Button>
      </motion.div>

      {/* Ligne 5 */}
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.8 }}
        className="col-span-2"
      >
        <Button 
          onClick={() => onNumber("0")} 
          variant="outline" 
          className={cn(numberButtonClass, "w-full")}
        >
          0
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.85 }}
      >
        <Button 
          onClick={() => onNumber(".")} 
          variant="outline" 
          className={numberButtonClass}
        >
          .
        </Button>
      </motion.div>
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileTap="tap"
        transition={{ delay: 0.9 }}
      >
        <Button 
          onClick={onCalculate} 
          variant="default" 
          className={equalButtonClass}
        >
          =
        </Button>
      </motion.div>
    </div>
  );
}
