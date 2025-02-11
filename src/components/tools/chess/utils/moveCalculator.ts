
import { ChessPiece } from "@/types/chess";
import { calculatePawnMoves } from "./pieces/pawnMoves";
import { calculateKnightMoves } from "./pieces/knightMoves";
import { calculateKingMoves } from "./pieces/kingMoves";
import { 
  calculateSlidingMoves, 
  ORTHOGONAL_DIRECTIONS, 
  DIAGONAL_DIRECTIONS,
  ALL_DIRECTIONS 
} from "./pieces/slidingMoves";

export function calculatePossibleMoves(
  row: number, 
  col: number, 
  piece: ChessPiece, 
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  switch (piece.type) {
    case 'pawn': {
      return calculatePawnMoves(row, col, piece, board);
    }
    case 'rook': {
      return calculateSlidingMoves(row, col, piece, board, ORTHOGONAL_DIRECTIONS);
    }
    case 'knight': {
      return calculateKnightMoves(row, col, piece, board);
    }
    case 'bishop': {
      return calculateSlidingMoves(row, col, piece, board, DIAGONAL_DIRECTIONS);
    }
    case 'queen': {
      return calculateSlidingMoves(row, col, piece, board, ALL_DIRECTIONS);
    }
    case 'king': {
      return calculateKingMoves(row, col, piece, board);
    }
    default: {
      return [];
    }
  }
}
