
import { ChessPiece } from "@/types/chess";

export interface GameState {
  board: (ChessPiece | null)[][];
  moveHistory: string[];
  isWhiteTurn: boolean;
  enPassantTarget: { row: number; col: number } | null;
  castlingRights: {
    white_kingside: boolean;
    white_queenside: boolean;
    black_kingside: boolean;
    black_queenside: boolean;
  };
  halfMoveClock: number;
  fullMoveNumber: number;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  drawReason: string | null;
}
