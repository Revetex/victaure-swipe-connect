import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useChessBoard } from "./useChessBoard";
import { useChessAI } from "./useChessAI";
import { getSquareName } from "./chessUtils";
import { ChessPiece } from "@/types/chess";
import { Json } from "@/integrations/supabase/types";

interface GameState {
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

export function useChessGame() {
  const {
    board,
    selectedPiece,
    possibleMoves,
    handlePieceSelect,
    makeMove,
    resetBoard,
    setBoard,
    setPossibleMoves,
    setSelectedPiece
  } = useChessBoard();
  
  const { isThinking, makeAIMove } = useChessAI();
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [gameId, setGameId] = useState<string | null>(null);
  const [enPassantTarget, setEnPassantTarget] = useState<{row: number; col: number} | null>(null);
  const [castlingRights, setCastlingRights] = useState({
    white_kingside: true,
    white_queenside: true,
    black_kingside: true,
    black_queenside: true
  });
  const [halfMoveClock, setHalfMoveClock] = useState(0);
  const [fullMoveNumber, setFullMoveNumber] = useState(1);
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [drawReason, setDrawReason] = useState<string | null>(null);

  const serializeGameState = (): Json => {
    return {
      board: board.map(row => 
        row.map(piece => 
          piece ? {
            type: piece.type,
            isWhite: piece.isWhite
          } : null
        )
      ),
      moveHistory,
      isWhiteTurn,
      enPassantTarget,
      castlingRights,
      halfMoveClock,
      fullMoveNumber,
      isCheck,
      isCheckmate,
      isStalemate,
      isDraw,
      drawReason
    } as Json;
  };

  const loadGameState = (gameState: any) => {
    if (!gameState) return;
    
    setBoard(gameState.board);
    setMoveHistory(gameState.moveHistory || []);
    setIsWhiteTurn(gameState.isWhiteTurn);
    setEnPassantTarget(gameState.enPassantTarget);
    setCastlingRights(gameState.castlingRights);
    setHalfMoveClock(gameState.halfMoveClock);
    setFullMoveNumber(gameState.fullMoveNumber);
    setIsCheck(gameState.isCheck);
    setIsCheckmate(gameState.isCheckmate);
    setIsStalemate(gameState.isStalemate);
    setIsDraw(gameState.isDraw);
    setDrawReason(gameState.drawReason);
  };

  const createGame = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chess_games')
        .insert({
          white_player_id: user.id,
          ai_difficulty: difficulty,
          game_state: serializeGameState(),
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

  const saveGameState = async () => {
    if (!gameId) return;

    try {
      const { error } = await supabase
        .from('chess_games')
        .update({
          game_state: serializeGameState(),
          status: gameOver ? 'completed' : 'in_progress',
          is_check: isCheck,
          is_checkmate: isCheckmate,
          is_stalemate: isStalemate,
          is_draw: isDraw,
          draw_reason: drawReason
        })
        .eq('id', gameId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const loadGame = async () => {
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
      if (error.code !== 'PGRST116') { // No rows returned
        console.error('Error loading game:', error);
      }
      return;
    }

    if (data) {
      setGameId(data.id);
      loadGameState(data.game_state);
    }
  };

  useEffect(() => {
    if (!gameId) {
      loadGame();
    }
  }, []);

  useEffect(() => {
    if (gameId && board && moveHistory.length > 0) {
      saveGameState();
    }
  }, [board, moveHistory, isWhiteTurn, gameOver, isCheck, isCheckmate, isStalemate, isDraw]);

  const checkForKing = (currentBoard: (ChessPiece | null)[][]): boolean => {
    let blackKingFound = false;
    let whiteKingFound = false;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
        if (piece?.type === 'king') {
          if (piece.isWhite) {
            whiteKingFound = true;
          } else {
            blackKingFound = true;
          }
        }
      }
    }

    if (!blackKingFound) {
      toast.success("Félicitations ! Vous avez gagné en capturant le roi noir !");
      return true;
    }
    if (!whiteKingFound) {
      toast.success("L'IA a gagné en capturant votre roi !");
      return true;
    }

    return false;
  };

  const handleSquareClick = async (row: number, col: number) => {
    if (gameOver || (!isWhiteTurn && !selectedPiece)) return;

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        setBoard(newBoard);
        
        const move = `${getSquareName(selectedPiece.row, selectedPiece.col)} → ${getSquareName(row, col)}`;
        setMoveHistory(prev => [...prev, move]);
        setSelectedPiece(null);
        setPossibleMoves([]);

        // Mettre à jour le compteur de coups
        setHalfMoveClock(prev => prev + 1);
        if (!isWhiteTurn) {
          setFullMoveNumber(prev => prev + 1);
        }

        if (checkForKing(newBoard)) {
          setGameOver(true);
          setIsCheckmate(true);
          return;
        }

        setIsWhiteTurn(false);

        try {
          await makeAIMove(
            newBoard,
            difficulty,
            (from, to) => {
              const aiBoard = newBoard.map(row => [...row]);
              aiBoard[to.row][to.col] = aiBoard[from.row][from.col];
              aiBoard[from.row][from.col] = null;
              
              const aiMove = `${getSquareName(from.row, from.col)} → ${getSquareName(to.row, to.col)}`;
              setMoveHistory(prev => [...prev, aiMove]);
              setBoard(aiBoard);
              setHalfMoveClock(prev => prev + 1);
              setFullMoveNumber(prev => prev + 1);

              if (checkForKing(aiBoard)) {
                setGameOver(true);
                setIsCheckmate(true);
                return;
              }

              setIsWhiteTurn(true);
            },
            () => {
              setGameOver(true);
              setIsCheckmate(true);
              toast.success("Échec et mat ! Partie terminée");
            }
          );
        } catch (error) {
          console.error("Error during AI move:", error);
          toast.error("Erreur lors du coup de l'IA");
          setIsWhiteTurn(true);
        }
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
        
        const piece = board[row][col];
        if (piece && piece.isWhite === isWhiteTurn) {
          handlePieceSelect(row, col, isWhiteTurn);
        }
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhiteTurn) {
        handlePieceSelect(row, col, isWhiteTurn);
      }
    }
  };

  const resetGame = () => {
    resetBoard();
    setIsWhiteTurn(true);
    setGameOver(false);
    setMoveHistory([]);
    setGameId(null);
    setSelectedPiece(null);
    setPossibleMoves([]);
    setEnPassantTarget(null);
    setCastlingRights({
      white_kingside: true,
      white_queenside: true,
      black_kingside: true,
      black_queenside: true
    });
    setHalfMoveClock(0);
    setFullMoveNumber(1);
    setIsCheck(false);
    setIsCheckmate(false);
    setIsStalemate(false);
    setIsDraw(false);
    setDrawReason(null);
    createGame();
  };

  return {
    board,
    selectedPiece,
    isWhiteTurn,
    isThinking,
    gameOver,
    moveHistory,
    possibleMoves,
    difficulty,
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    drawReason,
    handleSquareClick,
    resetGame,
    setDifficulty,
  };
}
