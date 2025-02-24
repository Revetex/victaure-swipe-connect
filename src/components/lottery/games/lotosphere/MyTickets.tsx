
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Ticket } from "lucide-react";
import { motion } from "framer-motion";

interface LotoTicket {
  id: string;
  selected_numbers: number[];
  bonus_color: string;
  status: string;
  winning_amount: number;
  created_at: string;
}

export function MyTickets() {
  const [tickets, setTickets] = useState<LotoTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('loto_tickets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data) {
          setTickets(data.map(ticket => ({
            id: ticket.id,
            selected_numbers: ticket.selected_numbers,
            bonus_color: ticket.bonus_color,
            status: ticket.status,
            winning_amount: Number(ticket.winning_amount),
            created_at: ticket.created_at
          })));
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-6 w-6" />
          </motion.div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
        <Ticket className="h-5 w-5" />
        Mes derniers tickets
      </h3>
      
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Vous n'avez pas encore de tickets
          </p>
        ) : (
          tickets.map(ticket => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border bg-gradient-to-br 
                ${ticket.status === 'won' 
                  ? 'from-green-500/10 to-green-500/5 border-green-500/20' 
                  : 'from-card-foreground/5 to-card-foreground/0'}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-lg">
                  {ticket.selected_numbers.join(' - ')}
                </p>
                {ticket.winning_amount > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-right"
                  >
                    <p className="font-bold text-green-500">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' })
                        .format(ticket.winning_amount)}
                    </p>
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Bonus: {ticket.bonus_color}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
