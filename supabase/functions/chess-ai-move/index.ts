
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

interface Move {
  from: Position;
  to: Position;
}

// Validate if a position is within the board bounds
const isValidPosition = (row: number, col: number): boolean => 
  row >= 0 && row < 8 && col >= 0 && col < 8;

// Check if a move is valid for a pawn
const isValidPawnMove = (
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position,
  isWhitePiece: boolean
): boolean => {
  const direction = isWhitePiece ? -1 : 1;
  const startRow = isWhitePiece ? 6 : 1;
  const rowDiff = to.row - from.row;
  const colDiff = Math.abs(to.col - from.col);
  const targetPiece = board[to.row][to.col];

  // Forward movement
  if (colDiff === 0 && !targetPiece) {
    // One square forward
    if (rowDiff === direction) return true;
    // Two squares forward from starting position
    if (from.row === startRow && rowDiff === 2 * direction) {
      const intermediateRow = from.row + direction;
      return !board[intermediateRow][from.col];
    }
  }
  
  // Capture diagonally
  if (colDiff === 1 && rowDiff === direction && targetPiece && targetPiece.isWhite !== isWhitePiece) {
    return true;
  }

  return false;
};

// Check if a move is valid for a knight
const isValidKnightMove = (from: Position, to: Position): boolean => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

// Check if a move is valid for a bishop
const isValidBishopMove = (
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position
): boolean => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  if (rowDiff !== colDiff) return false;

  const rowDir = to.row > from.row ? 1 : -1;
  const colDir = to.col > from.col ? 1 : -1;

  for (let i = 1; i < rowDiff; i++) {
    if (board[from.row + i * rowDir][from.col + i * colDir]) return false;
  }

  return true;
};

// Check if a move is valid for a rook
const isValidRookMove = (
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position
): boolean => {
  if (from.row !== to.row && from.col !== to.col) return false;

  const isHorizontal = from.row === to.row;
  const start = isHorizontal ? Math.min(from.col, to.col) : Math.min(from.row, to.row);
  const end = isHorizontal ? Math.max(from.col, to.col) : Math.max(from.row, to.row);

  for (let i = start + 1; i < end; i++) {
    if (board[isHorizontal ? from.row : i][isHorizontal ? i : from.col]) return false;
  }

  return true;
};

// Check if a move is valid for a queen (combination of bishop and rook)
const isValidQueenMove = (
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position
): boolean => 
  isValidBishopMove(board, from, to) || isValidRookMove(board, from, to);

// Check if a move is valid for a king
const isValidKingMove = (from: Position, to: Position): boolean => {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return rowDiff <= 1 && colDiff <= 1;
};

// Validate a chess move based on piece type and game rules
const isValidMove = (
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position,
  piece: ChessPiece
): boolean => {
  if (!isValidPosition(to.row, to.col)) return false;

  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.isWhite === piece.isWhite) return false;

  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(board, from, to, piece.isWhite);
    case 'knight':
      return isValidKnightMove(from, to);
    case 'bishop':
      return isValidBishopMove(board, from, to);
    case 'rook':
      return isValidRookMove(board, from, to);
    case 'queen':
      return isValidQueenMove(board, from, to);
    case 'king':
      return isValidKingMove(from, to);
    default:
      return false;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { board, difficulty } = await req.json();
    console.log("Received request with difficulty:", difficulty);
    console.log("Current board state:", JSON.stringify(board));

    // Find all valid moves for black pieces
    const validMoves: Move[] = [];

    // Scan the board for black pieces and their possible moves
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && !piece.isWhite) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              const from = { row: fromRow, col: fromCol };
              const to = { row: toRow, col: toCol };
              
              if (isValidMove(board, from, to, piece)) {
                validMoves.push({ from, to });
              }
            }
          }
        }
      }
    }

    console.log("Found valid moves:", validMoves.length);

    if (validMoves.length === 0) {
      console.log("No valid moves found - game over");
      return new Response(
        JSON.stringify({ gameOver: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select a move based on difficulty
    let selectedMove: Move;
    const targetPieces = validMoves.filter(move => board[move.to.row][move.to.col]?.isWhite);

    switch (difficulty) {
      case 'hard':
        // Prioritize capturing moves
        selectedMove = targetPieces.length > 0 
          ? targetPieces[Math.floor(Math.random() * targetPieces.length)]
          : validMoves[Math.floor(Math.random() * validMoves.length)];
        break;
      
      case 'easy':
        // Avoid capturing when possible
        selectedMove = validMoves.find(move => !board[move.to.row][move.to.col]) || 
                      validMoves[Math.floor(Math.random() * validMoves.length)];
        break;
      
      case 'medium':
      default:
        // Random move with 50% chance to capture if possible
        selectedMove = targetPieces.length > 0 && Math.random() < 0.5
          ? targetPieces[Math.floor(Math.random() * targetPieces.length)]
          : validMoves[Math.floor(Math.random() * validMoves.length)];
        break;
    }

    console.log("Selected move:", JSON.stringify(selectedMove));

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
