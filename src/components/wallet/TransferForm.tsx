
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const transferSchema = z.object({
  receiverWalletId: z.string().min(4, {
    message: "L'identifiant du portefeuille doit comporter au moins 4 caractères",
  }),
  amount: z.coerce.number().positive({
    message: "Le montant doit être positif",
  }),
  description: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

export function TransferForm() {
  const { wallet, transferFunds } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      receiverWalletId: "",
      amount: 0,
      description: "",
    },
  });

  async function onSubmit(values: TransferFormValues) {
    if (!wallet) {
      toast.error("Portefeuille non disponible");
      return;
    }

    if (values.amount > wallet.balance) {
      form.setError("amount", {
        message: "Solde insuffisant",
      });
      return;
    }

    setIsSubmitting(true);
    setTransferSuccess(false);

    try {
      const success = await transferFunds(
        values.amount,
        values.receiverWalletId,
        values.description || "Transfert"
      );

      if (success) {
        setTransferSuccess(true);
        form.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatCurrency = (amount: number, currency: string = 'CAD') => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency
    }).format(amount);
  };

  return (
    <Card className="p-6">
      {transferSuccess ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold">Transfert réussi !</h3>
          <p className="text-center text-muted-foreground">
            Votre transfert a été effectué avec succès.
          </p>
          <Button onClick={() => setTransferSuccess(false)}>
            Effectuer un autre transfert
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="receiverWalletId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID du portefeuille destinataire</FormLabel>
                  <FormControl>
                    <Input placeholder="ID du portefeuille" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez l'identifiant du portefeuille destinataire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Solde disponible: {formatCurrency(wallet?.balance || 0, wallet?.currency)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez une description pour ce transfert..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                "Effectuer le transfert"
              )}
            </Button>
          </form>
        </Form>
      )}
    </Card>
  );
}
