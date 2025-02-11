
import { ChessPiece } from "@/types/chess";

export type GameStatus = {
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  winner: 'white' | 'black' | null;
  reason: string;
};

export function isKingInCheck(
  board: (ChessPiece | null)[][],
  isWhiteKing: boolean
): boolean {
  // Trouver la position du roi
  let kingPosition: { row: number; col: number } | null = null;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.isWhite === isWhiteKing) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return false;

  // Vérifier si une pièce adverse peut attaquer le roi
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.isWhite !== isWhiteKing) {
        const moves = calculatePossibleMoves(row, col, piece, board, true);
        if (moves.some(move => move.row === kingPosition!.row && move.col === kingPosition!.col)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function calculatePossibleMoves(
  row: number,
  col: number,
  piece: ChessPiece,
  board: (ChessPiece | null)[][],
  ignoreCheck: boolean = false
): { row: number; col: number }[] {
  const moves: { row: number; col: number }[] = [];
  const directions = {
    bishop: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    rook: [[-1, 0], [1, 0], [0, -1], [0, 1]],
    queen: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]],
    knight: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]],
    king: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  };

  const addMove = (newRow: number, newCol: number) => {
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.isWhite !== piece.isWhite) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  };

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.isWhite ? -1 : 1;
      const startRow = piece.isWhite ? 6 : 1;

      // Avancer d'une case
      if (!board[row + direction]?.[col]) {
        addMove(row + direction, col);

        // Avancer de deux cases au premier coup
        if (row === startRow && !board[row + 2 * direction]?.[col]) {
          addMove(row + 2 * direction, col);
        }
      }

      // Captures en diagonale
      for (const offset of [-1, 1]) {
        const newCol = col + offset;
        const newRow = row + direction;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];
          if (targetPiece && targetPiece.isWhite !== piece.isWhite) {
            addMove(newRow, newCol);
          }
        }
      }
      break;
    }

    case 'bishop':
    case 'rook':
    case 'queen': {
      const pieceDirections = directions[piece.type];
      for (const [dx, dy] of pieceDirections) {
        let newRow = row + dx;
        let newCol = col + dy;
        
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];
          if (!targetPiece) {
            addMove(newRow, newCol);
          } else {
            if (targetPiece.isWhite !== piece.isWhite) {
              addMove(newRow, newCol);
            }
            break;
          }
          newRow += dx;
          newCol += dy;
        }
      }
      break;
    }

    case 'knight': {
      for (const [dx, dy] of directions.knight) {
        addMove(row + dx, col + dy);
      }
      break;
    }

    case 'king': {
      for (const [dx, dy] of directions.king) {
        addMove(row + dx, col + dy);
      }
      break;
    }
  }

  if (!ignoreCheck) {
    // Filtrer les mouvements qui mettraient le roi en échec
    return moves.filter(move => {
      const newBoard = board.map(r => [...r]);
      newBoard[move.row][move.col] = newBoard[row][col];
      newBoard[row][col] = null;
      return !isKingInCheck(newBoard, piece.isWhite);
    });
  }

  return moves;
}

export function getGameStatus(
  board: (ChessPiece | null)[][],
  isWhiteTurn: boolean
): GameStatus {
  const isWhiteInCheck = isKingInCheck(board, true);
  const isBlackInCheck = isKingInCheck(board, false);
  let hasLegalMoves = false;

  // Vérifier si le joueur actuel a des mouvements légaux
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhiteTurn) {
        const moves = calculatePossibleMoves(row, col, piece, board);
        if (moves.length > 0) {
          hasLegalMoves = true;
          break;
        }
      }
    }
    if (hasLegalMoves) break;
  }

  // Déterminer le statut du jeu
  const currentPlayerInCheck = isWhiteTurn ? isWhiteInCheck : isBlackInCheck;

  if (!hasLegalMoves) {
    if (currentPlayerInCheck) {
      return {
        isCheck: true,
        isCheckmate: true,
        isStalemate: false,
        winner: isWhiteTurn ? 'black' : 'white',
        reason: `Échec et mat ! Les ${isWhiteTurn ? 'noirs' : 'blancs'} gagnent`,
      };
    } else {
      return {
        isCheck: false,
        isCheckmate: false,
        isStalemate: true,
        winner: null,
        reason: 'Pat ! Match nul',
      };
    }
  }

  return {
    isCheck: currentPlayerInCheck,
    isCheckmate: false,
    isStalemate: false,
    winner: null,
    reason: currentPlayerInCheck ? 'Échec !' : '',
  };
}
