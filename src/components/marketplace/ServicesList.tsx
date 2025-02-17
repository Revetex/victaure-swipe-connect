import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { MarketplaceService } from '@/types/marketplace';

export function ServicesList() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['marketplace-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MarketplaceService[];
    }
  });

  const createBid = async (serviceId: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour faire une offre');
        return;
      }

      const { error } = await supabase.from('service_bids').insert({
        service_id: serviceId,
        user_id: user.id,
        amount: amount,
        status: 'pending'
      });

      if (error) throw error;
      toast.success('Votre offre a été envoyée');
    } catch (error) {
      console.error('Error creating bid:', error);
      toast.error('Erreur lors de l\'envoi de l\'offre');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {services.map((service) => (
        <Card key={service.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
              <div className="mt-4">
                <p className="font-medium">Budget: {service.budget}€</p>
                <p className="text-sm">Délai: {service.deadline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Votre offre"
                className="w-32"
                min={0}
                onChange={(e) => {
                  const amount = parseFloat(e.target.value);
                  if (amount && amount > 0) {
                    createBid(service.id, amount);
                  }
                }}
              />
              <Button variant="outline">Faire une offre</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
