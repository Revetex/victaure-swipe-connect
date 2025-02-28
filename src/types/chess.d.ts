
export interface ChessPiece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  isWhite: boolean;
}

export interface ChessGameState {
  board: (ChessPiece | null)[][];
  currentTurn: 'white' | 'black';
  capturedPieces: {
    white: ChessPiece[];
    black: ChessPiece[];
  };
  moveHistory: string[];
  check: boolean;
  checkmate: boolean;
  stalemate: boolean;
  isGameOver: boolean;
}
