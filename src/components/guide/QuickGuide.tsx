
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface GuideStep {
  title: string;
  description: string;
}

interface QuickGuideProps {
  title: string;
  steps: GuideStep[];
  onClose?: () => void;
}

export function QuickGuide({ title, steps, onClose }: QuickGuideProps) {
  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
        {onClose && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onClose}>
            <HelpCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-1">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
