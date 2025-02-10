
import { ChessPiece } from "@/types/chess";
import { isValidPosition } from "./boardUtils";

type BoardState = (ChessPiece | null)[][];

export function calculatePossibleMoves(
  fromRow: number, 
  fromCol: number, 
  piece: ChessPiece, 
  board: BoardState
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];

  const isPathClear = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const rowStep = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colStep = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    
    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;
    
    while (currentRow !== endRow || currentCol !== endCol) {
      if (!isValidPosition(currentRow, currentCol) || board[currentRow][currentCol]) {
        return false;
      }
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  };

  const addMove = (row: number, col: number) => {
    if (isValidPosition(row, col)) {
      const targetPiece = board[row][col];
      if (!targetPiece || targetPiece.isWhite !== piece.isWhite) {
        moves.push({ row, col });
      }
    }
  };

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.isWhite ? -1 : 1;
      const startRow = piece.isWhite ? 6 : 1;

      // Forward movement
      const nextRow = fromRow + direction;
      if (isValidPosition(nextRow, fromCol) && !board[nextRow][fromCol]) {
        addMove(nextRow, fromCol);
        
        // Double move from starting position
        if (fromRow === startRow && !board[fromRow + 2 * direction]?.[fromCol]) {
          addMove(fromRow + 2 * direction, fromCol);
        }
      }

      // Captures
      for (const captureCol of [fromCol - 1, fromCol + 1]) {
        if (isValidPosition(nextRow, captureCol)) {
          const target = board[nextRow][captureCol];
          if (target && target.isWhite !== piece.isWhite) {
            addMove(nextRow, captureCol);
          }
        }
      }
      break;
    }

    case 'rook': {
      // Horizontal movements
      for (let col = 0; col < 8; col++) {
        if (col !== fromCol && isPathClear(fromRow, fromCol, fromRow, col)) {
          addMove(fromRow, col);
        }
      }
      // Vertical movements
      for (let row = 0; row < 8; row++) {
        if (row !== fromRow && isPathClear(fromRow, fromCol, row, fromCol)) {
          addMove(row, fromCol);
        }
      }
      break;
    }

    case 'knight': {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [rowOffset, colOffset] of knightMoves) {
        const newRow = fromRow + rowOffset;
        const newCol = fromCol + colOffset;
        addMove(newRow, newCol);
      }
      break;
    }

    case 'bishop': {
      for (let i = 1; i < 8; i++) {
        for (const [rowDir, colDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const newRow = fromRow + i * rowDir;
          const newCol = fromCol + i * colDir;
          if (isValidPosition(newRow, newCol) && isPathClear(fromRow, fromCol, newRow, newCol)) {
            addMove(newRow, newCol);
          }
        }
      }
      break;
    }

    case 'queen': {
      // Horizontal and vertical movements (like rook)
      for (let i = 0; i < 8; i++) {
        if (i !== fromCol && isPathClear(fromRow, fromCol, fromRow, i)) {
          addMove(fromRow, i);
        }
        if (i !== fromRow && isPathClear(fromRow, fromCol, i, fromCol)) {
          addMove(i, fromCol);
        }
      }
      // Diagonal movements (like bishop)
      for (let i = 1; i < 8; i++) {
        for (const [rowDir, colDir] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const newRow = fromRow + i * rowDir;
          const newCol = fromCol + i * colDir;
          if (isValidPosition(newRow, newCol) && isPathClear(fromRow, fromCol, newRow, newCol)) {
            addMove(newRow, newCol);
          }
        }
      }
      break;
    }

    case 'king': {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset === 0 && colOffset === 0) continue;
          const newRow = fromRow + rowOffset;
          const newCol = fromCol + colOffset;
          addMove(newRow, newCol);
        }
      }
      break;
    }
  }
  
  return moves;
}
