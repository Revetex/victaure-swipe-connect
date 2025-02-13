
export interface ChessPiece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  isWhite: boolean;
}

export interface ChessGame {
  id: string;
  white_player_id: string;
  black_player_id: string | null;
  ai_difficulty: string;
  game_state: any;
  status: string;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}
