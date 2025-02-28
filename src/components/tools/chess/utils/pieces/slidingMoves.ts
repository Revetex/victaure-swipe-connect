
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition, isPathClear } from "../moveValidation";

export const ORTHOGONAL_DIRECTIONS = [
  { row: -1, col: 0 }, // haut
  { row: 1, col: 0 },  // bas
  { row: 0, col: -1 }, // gauche
  { row: 0, col: 1 }   // droite
];

export const DIAGONAL_DIRECTIONS = [
  { row: -1, col: -1 }, // haut-gauche
  { row: -1, col: 1 },  // haut-droite
  { row: 1, col: -1 },  // bas-gauche
  { row: 1, col: 1 }    // bas-droite
];

export const ALL_DIRECTIONS = [
  ...ORTHOGONAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS
];

export function calculateSlidingMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][],
  directions: { row: number; col: number }[]
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  directions.forEach(direction => {
    for (let distance = 1; distance < 8; distance++) {
      const newRow = row + direction.row * distance;
      const newCol = col + direction.col * distance;
      
      if (!canMoveToPosition(newRow, newCol, piece, board)) {
        break; // On sort de la boucle si la position n'est pas valide
      }
      
      if (!isPathClear(row, col, newRow, newCol, board)) {
        break; // On sort de la boucle si le chemin est bloqué
      }
      
      moves.push({ row: newRow, col: newCol });
      
      // Si on a capturé une pièce, on ne peut pas aller plus loin
      if (board[newRow][newCol] !== null) {
        break;
      }
    }
  });

  return moves;
}
