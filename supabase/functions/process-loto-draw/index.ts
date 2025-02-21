
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting loto draw process...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current pending draw
    const { data: draw, error: drawError } = await supabase
      .from('loto_draws')
      .select('*')
      .eq('status', 'pending')
      .single();

    if (drawError || !draw) {
      console.error('No pending draw found:', drawError);
      throw new Error('No pending draw found');
    }

    console.log('Found pending draw:', draw.id);

    // Generate random numbers and color
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 50) + 1);
    }
    const colors = ['Rouge', 'Vert', 'Bleu', 'Jaune', 'Violet'];
    const bonusColor = colors[Math.floor(Math.random() * colors.length)];

    console.log('Generated numbers:', Array.from(numbers), 'and color:', bonusColor);

    // Update draw with numbers and color
    const { error: updateError } = await supabase
      .from('loto_draws')
      .update({
        draw_numbers: Array.from(numbers),
        bonus_color: bonusColor,
        status: 'in_progress'
      })
      .eq('id', draw.id);

    if (updateError) {
      console.error('Error updating draw:', updateError);
      throw updateError;
    }

    console.log('Draw updated, processing winners...');

    // Process the draw using the database function
    const { error: processError } = await supabase
      .rpc('process_loto_draw', { draw_id: draw.id });

    if (processError) {
      console.error('Error processing draw:', processError);
      throw processError;
    }

    // Get winning tickets
    const { data: winners, error: winnersError } = await supabase
      .from('loto_wins')
      .select('*, loto_tickets(user_id)')
      .eq('draw_id', draw.id);

    if (winnersError) {
      console.error('Error fetching winners:', winnersError);
      throw winnersError;
    }

    console.log(`Found ${winners?.length || 0} winners`);

    // Send notifications to winners
    if (winners) {
      for (const winner of winners) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: winner.loto_tickets.user_id,
            title: 'Félicitations ! 🎉',
            message: `Vous avez gagné ${winner.amount} ${draw.currency} au tirage LotoSphere !`,
            type: 'loto_win'
          });

        if (notifError) {
          console.error('Error sending notification:', notifError);
        }
      }
    }

    console.log('Scheduling next draw...');

    // Schedule next draw
    await supabase.rpc('schedule_next_draw');

    console.log('Draw process completed successfully');

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error processing draw:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
