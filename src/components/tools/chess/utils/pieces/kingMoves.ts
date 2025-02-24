
import { ChessPiece } from "@/types/chess";
import { canMoveToPosition } from "../moveValidation";

const KING_MOVES = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
] as const;

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

export function calculateKingMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][]
): { row: number; col: number; }[] {
  const moves: { row: number; col: number; }[] = [];

  // Vérifier tous les mouvements possibles du roi
  for (const [rowOffset, colOffset] of KING_MOVES) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    
    if (canMoveToPosition(newRow, newCol, piece, board)) {
      // Simulation du mouvement pour vérifier si le roi ne se met pas en échec
      const tempBoard = board.map(row => [...row]);
      tempBoard[row][col] = null;
      tempBoard[newRow][newCol] = piece;
      
      // Ne permettre le mouvement que si le roi n'est pas en échec après le déplacement
      if (!isKingInCheck(newRow, newCol, piece.isWhite, tempBoard)) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  return moves;
}

// Fonction améliorée pour vérifier l'échec
function isKingInCheck(
  kingRow: number,
  kingCol: number,
  isWhiteKing: boolean,
  board: (ChessPiece | null)[][]
): boolean {
  // Vérifier les attaques des pions
  const pawnDirection = isWhiteKing ? 1 : -1;
  const pawnAttacks = [
    [pawnDirection, -1],
    [pawnDirection, 1]
  ];

  for (const [rowOffset, colOffset] of pawnAttacks) {
    const attackRow = kingRow + rowOffset;
    const attackCol = kingCol + colOffset;
    if (isValidPosition(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol];
      if (piece?.type === 'pawn' && piece.isWhite !== isWhiteKing) {
        return true;
      }
    }
  }

  // Vérifier les attaques des cavaliers
  for (const [rowOffset, colOffset] of KNIGHT_MOVES) {
    const attackRow = kingRow + rowOffset;
    const attackCol = kingCol + colOffset;
    if (isValidPosition(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol];
      if (piece?.type === 'knight' && piece.isWhite !== isWhiteKing) {
        return true;
      }
    }
  }

  // Vérifier les attaques orthogonales (tour et dame)
  for (const [rowDir, colDir] of ORTHOGONAL_DIRECTIONS) {
    if (isDirectionThreatened(kingRow, kingCol, rowDir, colDir, isWhiteKing, board, ['rook', 'queen'])) {
      return true;
    }
  }

  // Vérifier les attaques diagonales (fou et dame)
  for (const [rowDir, colDir] of DIAGONAL_DIRECTIONS) {
    if (isDirectionThreatened(kingRow, kingCol, rowDir, colDir, isWhiteKing, board, ['bishop', 'queen'])) {
      return true;
    }
  }

  // Vérifier la présence du roi adverse à proximité
  for (const [rowOffset, colOffset] of KING_MOVES) {
    const attackRow = kingRow + rowOffset;
    const attackCol = kingCol + colOffset;
    if (isValidPosition(attackRow, attackCol)) {
      const piece = board[attackRow][attackCol];
      if (piece?.type === 'king' && piece.isWhite !== isWhiteKing) {
        return true;
      }
    }
  }

  return false;
}

// Fonction améliorée pour vérifier les menaces dans une direction
function isDirectionThreatened(
  row: number,
  col: number,
  rowDir: number,
  colDir: number,
  isWhiteKing: boolean,
  board: (ChessPiece | null)[][],
  threatTypes: string[]
): boolean {
  let currentRow = row + rowDir;
  let currentCol = col + colDir;

  while (isValidPosition(currentRow, currentCol)) {
    const piece = board[currentRow][currentCol];
    if (piece) {
      if (piece.isWhite === isWhiteKing) {
        return false; // Pièce amie bloque la ligne
      }
      return piece.isWhite !== isWhiteKing && threatTypes.includes(piece.type);
    }
    currentRow += rowDir;
    currentCol += colDir;
  }

  return false;
}

// Fonction utilitaire pour vérifier si une position est valide sur l'échiquier
function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Nouvelle fonction pour vérifier l'échec et mat
export function isCheckmate(
  kingRow: number,
  kingCol: number,
  isWhiteKing: boolean,
  board: (ChessPiece | null)[][]
): boolean {
  // Si le roi n'est pas en échec, ce n'est pas un échec et mat
  if (!isKingInCheck(kingRow, kingCol, isWhiteKing, board)) {
    return false;
  }

  // Vérifier tous les mouvements possibles pour toutes les pièces de la couleur du roi
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhiteKing) {
        const moves = calculateKingMoves(row, col, piece, board);
        if (moves.length > 0) {
          return false; // Il existe au moins un mouvement légal
        }
      }
    }
  }

  return true; // Aucun mouvement légal n'a été trouvé
}

