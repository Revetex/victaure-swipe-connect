import { PaymentBox } from "@/components/dashboard/PaymentBox";
import { motion } from "framer-motion";

interface PaymentSectionProps {
  variants: any;
}

export function PaymentSection({ variants }: PaymentSectionProps) {
  return (
    <motion.div 
      variants={variants}
      className="col-span-1 md:col-span-2 xl:col-span-4 h-[450px]"
    >
      <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
        <div className="p-6 sm:p-8 h-full">
          <PaymentBox />
        </div>
      </div>
    </motion.div>
  );
}