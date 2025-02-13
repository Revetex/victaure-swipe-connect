
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useChessBoard } from "./useChessBoard";
import { useChessAI } from "./useChessAI";
import { getSquareName } from "./chessUtils";
import { useGamePersistence } from "./useGamePersistence";
import { useGameRules } from "./useGameRules";
import { GameState } from "./types/gameState";

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
  const { createGame, saveGameState, loadGame } = useGamePersistence();
  const { checkForKing } = useGameRules();

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");
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

  const getCurrentGameState = (): GameState => ({
    board,
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
  });

  const loadGameState = (gameState: GameState) => {
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

  useEffect(() => {
    loadGame(loadGameState);
  }, []);

  useEffect(() => {
    if (board && moveHistory.length > 0) {
      saveGameState(getCurrentGameState(), gameOver);
    }
  }, [board, moveHistory, isWhiteTurn, gameOver, isCheck, isCheckmate, isStalemate, isDraw]);

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
    createGame(getCurrentGameState(), difficulty);
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
