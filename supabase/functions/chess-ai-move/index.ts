
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChessPiece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  isWhite: boolean;
}

interface Position {
  row: number;
  col: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { board, difficulty } = await req.json();

    // Find all valid moves for black pieces
    const validMoves: { from: Position; to: Position }[] = [];

    // Helper to check if a position is within bounds
    const isValidPosition = (row: number, col: number) => 
      row >= 0 && row < 8 && col >= 0 && col < 8;

    // Find all possible moves for black pieces
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && !piece.isWhite) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidPosition(toRow, toCol)) {
                const targetPiece = board[toRow][toCol];
                if (!targetPiece || targetPiece.isWhite) {
                  // Basic move validation based on piece type
                  if (piece.type === 'pawn') {
                    // Pawns can only move forward one square (or two from starting position)
                    if (fromCol === toCol && !targetPiece) {
                      if (toRow === fromRow + 1 || (fromRow === 1 && toRow === 3)) {
                        validMoves.push({ 
                          from: { row: fromRow, col: fromCol },
                          to: { row: toRow, col: toCol }
                        });
                      }
                    }
                    // Pawns capture diagonally
                    else if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + 1 && targetPiece?.isWhite) {
                      validMoves.push({
                        from: { row: fromRow, col: fromCol },
                        to: { row: toRow, col: toCol }
                      });
                    }
                  } else {
                    // Simplified movement for other pieces
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
      }
    }

    if (validMoves.length === 0) {
      return new Response(
        JSON.stringify({ gameOver: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select a move based on difficulty
    let selectedMove;
    switch (difficulty) {
      case 'hard':
        // For hard difficulty, prioritize capturing moves or random
        selectedMove = validMoves.find(move => board[move.to.row][move.to.col]?.isWhite) || 
                      validMoves[Math.floor(Math.random() * validMoves.length)];
        break;
      
      case 'easy':
        // For easy difficulty, avoid capturing when possible
        selectedMove = validMoves.find(move => !board[move.to.row][move.to.col]) || 
                      validMoves[Math.floor(Math.random() * validMoves.length)];
        break;
      
      case 'medium':
      default:
        // For medium difficulty, completely random move
        selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        break;
    }

    return new Response(
      JSON.stringify({ 
        move: selectedMove,
        gameOver: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chess-ai-move function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
