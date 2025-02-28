
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
      status: 204,
    });
  }

  try {
    // Create a Supabase client with the Deno server's credentials
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the draw ID from the request if present
    let drawId: string | null = null;
    
    if (req.method === "POST") {
      const body = await req.json();
      drawId = body.drawId;
    }

    // If no draw ID is provided, find the next scheduled draw that's due
    if (!drawId) {
      const now = new Date();
      
      const { data: draws, error: fetchError } = await supabase
        .from('loto_draws')
        .select('id')
        .eq('status', 'pending')
        .lte('scheduled_for', now.toISOString())
        .order('scheduled_for', { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (!draws) {
        return new Response(
          JSON.stringify({ success: false, message: "No draws to process" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }
      
      drawId = draws.id;
    }

    // Generate random numbers for the draw (5 numbers from 1-35)
    const drawNumbers: number[] = [];
    while (drawNumbers.length < 5) {
      const num = Math.floor(Math.random() * 35) + 1;
      if (!drawNumbers.includes(num)) {
        drawNumbers.push(num);
      }
    }
    
    // Generate a random bonus color
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
    const bonusColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Update the draw with the results
    const { data: updatedDraw, error: updateError } = await supabase
      .from('loto_draws')
      .update({
        draw_numbers: drawNumbers,
        bonus_color: bonusColor,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', drawId)
      .select()
      .single();
    
    if (updateError) throw updateError;

    // Get ticket purchases for this draw to determine winners
    const { data: tickets, error: ticketsError } = await supabase
      .from('loto_tickets')
      .select('*')
      .eq('draw_id', drawId);
    
    if (ticketsError) throw ticketsError;

    // Process winners if there are any tickets
    if (tickets && tickets.length > 0) {
      // TODO: Implement winner determination logic
      console.log(`Processing ${tickets.length} tickets for winners`);
      
      // For now, just logging winners would be processed
      const processedTickets = tickets.map(ticket => {
        const matches = ticket.selected_numbers.filter((num: number) => 
          drawNumbers.includes(num)
        ).length;
        
        const colorMatch = ticket.selected_color === bonusColor;
        
        return {
          ticketId: ticket.id,
          userId: ticket.user_id,
          matches,
          colorMatch,
          prize: calculatePrize(matches, colorMatch, updatedDraw.prize_pool)
        };
      });
      
      console.log("Processed tickets:", processedTickets);
      
      // TODO: Update winners in the database
    }

    return new Response(
      JSON.stringify({
        success: true,
        draw: updatedDraw,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing loto draw:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Calculate prize based on matches and percentage of prize pool
function calculatePrize(matches: number, colorMatch: boolean, prizePool: number): number {
  // Example prize distribution:
  // 5 matches + color: 50% of prize pool
  // 5 matches: 20% of prize pool
  // 4 matches + color: 10% of prize pool
  // 4 matches: 5% of prize pool
  // 3 matches + color: 3% of prize pool
  // 3 matches: 1% of prize pool
  // 2 matches + color: 0.5% of prize pool
  // color only: 0.2% of prize pool
  
  if (matches === 5 && colorMatch) return prizePool * 0.5;
  if (matches === 5) return prizePool * 0.2;
  if (matches === 4 && colorMatch) return prizePool * 0.1;
  if (matches === 4) return prizePool * 0.05;
  if (matches === 3 && colorMatch) return prizePool * 0.03;
  if (matches === 3) return prizePool * 0.01;
  if (matches === 2 && colorMatch) return prizePool * 0.005;
  if (colorMatch) return prizePool * 0.002;
  
  return 0;
}
