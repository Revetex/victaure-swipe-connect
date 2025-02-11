
import { motion } from "framer-motion";
import { Sword, Crown, Brain, History, AlertCircle } from "lucide-react";
import { ChessBoard } from "./chess/ChessBoard";
import { ChessControls } from "./chess/ChessControls";
import { useChessGame } from "@/hooks/chess/useChessGame";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChessPage() {
  const {
    board,
    selectedPiece,
    isWhiteTurn,
    isThinking,
    gameOver,
    possibleMoves,
    difficulty,
    moveHistory,
    gameStatus,
    handleSquareClick,
    resetGame,
    setDifficulty,
  } = useChessGame();

  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto rounded-2xl bg-gradient-to-br from-[#1e293b]/50 to-[#0f172a]/50 backdrop-blur-sm border border-white/10 overflow-hidden"
      >
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
              >
                <Sword className="h-6 w-6 text-yellow-400" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                  Échecs vs IA
                </h1>
                <p className="text-sm text-yellow-200/60">
                  {isWhiteTurn ? "À vous de jouer" : "L'IA réfléchit..."}
                </p>
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10",
                gameStatus.isCheck ? "bg-red-500/20 animate-pulse" : "bg-white/5"
              )}
            >
              {gameStatus.isCheck ? (
                <>
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-200">Échec !</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-200/80">Mode {difficulty}</span>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Game Area */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <div className="space-y-6">
              <ChessControls
                isThinking={isThinking}
                isWhiteTurn={isWhiteTurn}
                gameOver={gameOver}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                onReset={resetGame}
              />
              
              <div className="relative">
                {gameOver && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md rounded-2xl"
                  >
                    <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 border border-white/10 shadow-2xl">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                      </motion.div>
                      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                        {gameStatus.reason}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetGame}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 
                                 text-yellow-200 font-medium transition-colors border border-white/10"
                      >
                        Nouvelle partie
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                
                <ChessBoard
                  board={board}
                  selectedPiece={selectedPiece}
                  possibleMoves={possibleMoves}
                  isThinking={isThinking}
                  gameOver={gameOver}
                  isWhiteTurn={isWhiteTurn}
                  onSquareClick={handleSquareClick}
                />
              </div>
            </div>

            {/* Move History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <History className="h-4 w-4 text-yellow-400" />
                <h3 className="font-medium text-yellow-200/80">Historique des coups</h3>
              </div>
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-2">
                  {moveHistory.map((move, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-2 rounded-lg text-sm",
                        index % 2 === 0 ? "bg-white/5" : "bg-white/10"
                      )}
                    >
                      {index + 1}. {move}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
