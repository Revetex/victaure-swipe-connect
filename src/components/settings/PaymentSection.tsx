
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, Plus, Trash2 } from "lucide-react";
import { PaymentMethod } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTypeSelector } from "@/components/dashboard/payment/PaymentTypeSelector";
import { toast } from "sonner";

export function PaymentSection() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'credit_card' | 'interac'>('credit_card');
  const [addingPayment, setAddingPayment] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const { data: methods, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      
      const typedMethods = methods?.map(method => ({
        ...method,
        payment_type: method.payment_type as 'credit_card' | 'interac'
      }));
      
      setPaymentMethods(typedMethods || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error("Erreur lors du chargement des méthodes de paiement");
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async () => {
    try {
      setAddingPayment(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('payment_methods')
        .insert({
          payment_type: selectedType,
          user_id: user.id,
          is_default: paymentMethods.length === 0
        });

      if (error) throw error;
      
      toast.success("Méthode de paiement ajoutée");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error("Erreur lors de l'ajout de la méthode de paiement");
    } finally {
      setAddingPayment(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Méthode de paiement supprimée");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .neq('id', id);

      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Méthode de paiement par défaut mise à jour");
      loadPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className="group flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-black/5 to-black/10 
                           dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-border/50
                           hover:from-black/10 hover:to-black/15 
                           dark:hover:from-white/10 dark:hover:to-white/15 
                           transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.payment_type === 'credit_card' ? 'Carte de crédit' : 'Interac'}
                        {method.is_default && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                            Par défaut
                          </span>
                        )}
                      </p>
                      {method.card_last_four && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {method.card_brand} se terminant par {method.card_last_four}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="transition-transform hover:scale-105"
                      >
                        Définir par défaut
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => deletePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3 bg-gradient-to-br from-black/5 to-black/10 
                         dark:from-white/5 dark:to-white/10 rounded-xl border border-dashed border-border/50">
              <CreditCard className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Aucune méthode de paiement</p>
            </div>
          )}

          <div className="pt-4 space-y-4">
            <PaymentTypeSelector
              selectedPaymentType={selectedType}
              onSelect={setSelectedType}
            />
            
            <Button 
              className="w-full relative overflow-hidden group"
              variant="outline"
              onClick={addPaymentMethod}
              disabled={addingPayment}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 
                           group-hover:from-primary/20 group-hover:to-primary/10 transition-opacity" />
              <span className="relative flex items-center justify-center">
                {addingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Ajouter une méthode de paiement
              </span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
