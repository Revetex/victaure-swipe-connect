
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

const KING_MOVES = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
] as const;

export function calculateKingMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];

  for (const [rowOffset, colOffset] of KING_MOVES) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    
    if (canMoveToPosition(newRow, newCol, piece, board)) {
      // Vérifier que le roi ne se met pas en échec
      const tempBoard = board.map(row => [...row]);
      tempBoard[row][col] = null;
      tempBoard[newRow][newCol] = piece;
      
      // Si la case n'est pas menacée, c'est un mouvement valide
      if (!isSquareUnderAttack(newRow, newCol, piece.isWhite, tempBoard)) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  return moves;
}

function isSquareUnderAttack(
  row: number,
  col: number,
  isWhite: boolean,
  board: (ChessPiece | null)[][]
): boolean {
  // Vérifier les attaques des pions
  const pawnDirection = isWhite ? 1 : -1;
  const pawnAttacks = [
    [pawnDirection, -1],
    [pawnDirection, 1]
  ];

  for (const [rowOffset, colOffset] of pawnAttacks) {
    const attackRow = row + rowOffset;
    const attackCol = col + colOffset;
    if (isValidPosition(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol];
      if (piece && piece.type === 'pawn' && piece.isWhite !== isWhite) {
        return true;
      }
    }
  }

  // Vérifier les attaques des cavaliers
  for (const [rowOffset, colOffset] of KNIGHT_MOVES) {
    const attackRow = row + rowOffset;
    const attackCol = col + colOffset;
    if (isValidPosition(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol];
      if (piece && piece.type === 'knight' && piece.isWhite !== isWhite) {
        return true;
      }
    }
  }

  // Vérifier les attaques en ligne (tour et dame)
  for (const [rowDir, colDir] of ORTHOGONAL_DIRECTIONS) {
    if (isDirectionUnderAttack(row, col, rowDir, colDir, isWhite, board, ['rook', 'queen'])) {
      return true;
    }
  }

  // Vérifier les attaques en diagonale (fou et dame)
  for (const [rowDir, colDir] of DIAGONAL_DIRECTIONS) {
    if (isDirectionUnderAttack(row, col, rowDir, colDir, isWhite, board, ['bishop', 'queen'])) {
      return true;
    }
  }

  return false;
}

function isDirectionUnderAttack(
  row: number,
  col: number,
  rowDir: number,
  colDir: number,
  isWhite: boolean,
  board: (ChessPiece | null)[][],
  threatTypes: string[]
): boolean {
  let currentRow = row + rowDir;
  let currentCol = col + colDir;

  while (isValidPosition(currentRow, currentCol)) {
    const piece = board[currentRow][currentCol];
    if (piece) {
      if (piece.isWhite !== isWhite && threatTypes.includes(piece.type)) {
        return true;
      }
      break;
    }
    currentRow += rowDir;
    currentCol += colDir;
  }

  return false;
}

function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

const KNIGHT_MOVES = [
  [-2, -1], [-2, 1],
  [-1, -2], [-1, 2],
  [1, -2], [1, 2],
  [2, -1], [2, 1]
] as const;

const ORTHOGONAL_DIRECTIONS = [
  [0, 1], [0, -1],
  [1, 0], [-1, 0]
] as const;

const DIAGONAL_DIRECTIONS = [
  [1, 1], [1, -1],
  [-1, 1], [-1, -1]
] as const;
