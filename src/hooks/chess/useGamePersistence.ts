
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameState } from "./types/gameState";
import { Json } from "@/integrations/supabase/types";

export function useGamePersistence() {
  const [gameId, setGameId] = useState<string | null>(null);

  const serializeGameState = (gameState: GameState): Json => {
    return {
      board: gameState.board.map(row => 
        row.map(piece => 
          piece ? {
            type: piece.type,
            isWhite: piece.isWhite
          } : null
        )
      ),
      moveHistory: gameState.moveHistory,
      isWhiteTurn: gameState.isWhiteTurn,
      enPassantTarget: gameState.enPassantTarget,
      castlingRights: gameState.castlingRights,
      halfMoveClock: gameState.halfMoveClock,
      fullMoveNumber: gameState.fullMoveNumber,
      isCheck: gameState.isCheck,
      isCheckmate: gameState.isCheckmate,
      isStalemate: gameState.isStalemate,
      isDraw: gameState.isDraw,
      drawReason: gameState.drawReason
    } as Json;
  };

  const createGame = async (gameState: GameState, difficulty: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chess_games')
        .insert({
          white_player_id: user.id,
          ai_difficulty: difficulty,
          game_state: serializeGameState(gameState),
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      setGameId(data.id);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const saveGameState = async (gameState: GameState, gameOver: boolean) => {
    if (!gameId) return;

    try {
      const { error } = await supabase
        .from('chess_games')
        .update({
          game_state: serializeGameState(gameState),
          status: gameOver ? 'completed' : 'in_progress',
          is_check: gameState.isCheck,
          is_checkmate: gameState.isCheckmate,
          is_stalemate: gameState.isStalemate,
          is_draw: gameState.isDraw,
          draw_reason: gameState.drawReason
        })
        .eq('id', gameId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const loadGame = async (onLoadGame: (gameState: GameState) => void) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chess_games')
      .select('*')
      .eq('white_player_id', user.id)
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error loading game:', error);
      }
      return;
    }

    if (data) {
      setGameId(data.id);
      onLoadGame(data.game_state);
    }
  };

  return {
    gameId,
    createGame,
    saveGameState,
    loadGame
  };
}
