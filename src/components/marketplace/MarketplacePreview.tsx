import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useServicesData } from "@/hooks/useServicesData";
import { Loader2 } from "lucide-react";
import type { MarketplaceService } from "@/types/marketplace";

interface MarketplacePreviewProps {
  onAuthRequired: () => void;
}

export function MarketplacePreview({ onAuthRequired }: MarketplacePreviewProps) {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['marketplace-services-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as MarketplaceService[];
    }
  });

  const previewServices = (services || []).slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {previewServices.map((service: MarketplaceService) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-card p-4 rounded-lg shadow-md"
          >
            <h3 className="font-semibold mb-2">{service.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {service.description}
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onAuthRequired}
            >
              Voir les détails
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button 
          size="lg"
          onClick={() => navigate("/auth")}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Accéder au Marketplace complet
        </Button>
      </div>
    </div>
  );
}
