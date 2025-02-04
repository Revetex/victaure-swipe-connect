import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { board } = await req.json();

    // Simple AI logic - randomly select a valid move
    const validMoves = [];
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && !piece.isWhite) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              const targetPiece = board[toRow][toCol];
              if (!targetPiece || targetPiece.isWhite) {
                validMoves.push({
                  from: { row: fromRow, col: fromCol },
                  to: { row: toRow, col: toCol }
                });
              }
            }
          }
        }
      }
    }

    if (validMoves.length === 0) {
      return new Response(
        JSON.stringify({ gameOver: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

    return new Response(
      JSON.stringify({ 
        move: randomMove,
        gameOver: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chess-ai-move function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});