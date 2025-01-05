import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function VCardSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto glass-card animate-pulse">
      <CardContent className="p-6">
        <div className="h-24 bg-muted rounded-lg mb-6"></div>
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  );
}