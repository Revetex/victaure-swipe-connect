
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition, isPathClear } from "../moveValidation";

export type Direction = [number, number];

export function calculateSlidingMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][],
  directions: Direction[]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];

  for (const [rowDir, colDir] of directions) {
    let currentRow = row + rowDir;
    let currentCol = col + colDir;

    while (canMoveToPosition(currentRow, currentCol, piece, board)) {
      if (isPathClear(row, col, currentRow, currentCol, board)) {
        moves.push({ row: currentRow, col: currentCol });
        // Si on capture une pièce, on arrête dans cette direction
        if (board[currentRow][currentCol]) break;
      } else {
        break;
      }
      currentRow += rowDir;
      currentCol += colDir;
    }
  }

  return moves;
}

export const ORTHOGONAL_DIRECTIONS: Direction[] = [
  [0, 1], [0, -1], [1, 0], [-1, 0]
];

export const DIAGONAL_DIRECTIONS: Direction[] = [
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

export const ALL_DIRECTIONS: Direction[] = [
  ...ORTHOGONAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS
];
