
import { Button } from "@/components/ui/button";
import { useChessGame } from "@/hooks/chess/useChessGame";
import { ChessBoard } from "./chess/ChessBoard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Trophy, Clock, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ChessPage() {
  const {
    board,
    selectedPiece,
    isWhiteTurn,
    isThinking,
    gameOver,
    moveHistory,
    possibleMoves,
    difficulty,
    lastMoveHighlight,
    handleSquareClick,
    resetGame,
    setDifficulty
  } = useChessGame();

  return (
    <div className="relative p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#64B5D9]" />
          <h2 className="text-xl font-bold text-[#F2EBE4]">Imperium Chess</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[140px] h-9 bg-[#1B2A4A]/80 border-[#64B5D9]/30">
              <SelectValue placeholder="Difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Facile</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="hard">Difficile</SelectItem>
            </SelectContent>
          </Select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={resetGame}
                  className="h-9 w-9 border-[#64B5D9]/30 bg-[#1B2A4A]/80 hover:bg-[#1B2A4A] hover:text-[#64B5D9]"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nouvelle partie</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ChessBoard
            board={board}
            selectedPiece={selectedPiece}
            possibleMoves={possibleMoves}
            isThinking={isThinking}
            gameOver={gameOver}
            isWhiteTurn={isWhiteTurn}
            lastMoveHighlight={lastMoveHighlight}
            onSquareClick={handleSquareClick}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-[#64B5D9]/20 bg-black/40 overflow-hidden"
          >
            <div className="border-b border-[#64B5D9]/10 bg-[#1B2A4A]/40 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#64B5D9]" />
                <h3 className="font-medium text-[#F2EBE4]">Historique des coups</h3>
              </div>
              <div className={cn(
                "h-2 w-2 rounded-full transition-colors",
                isWhiteTurn ? "bg-white" : "bg-black border border-white/20"
              )} />
            </div>
            
            <ScrollArea className="h-[180px] sm:h-[300px]">
              <div className="p-4">
                {moveHistory.length === 0 ? (
                  <div className="text-sm text-[#F2EBE4]/60 text-center py-4">
                    La partie n'a pas encore commencé
                  </div>
                ) : (
                  <ol className="space-y-2">
                    {moveHistory.map((move, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * (index % 10) }}
                        className={cn(
                          "text-sm py-1 px-2 rounded flex items-center gap-2",
                          index % 2 === 0 
                            ? "bg-white/5 text-white" 
                            : "bg-black/20 text-[#F2EBE4]/80"
                        )}
                      >
                        <span className="w-6 text-[#64B5D9]/80 font-mono">
                          {Math.floor(index / 2) + 1}.
                        </span>
                        <span className="font-medium">{move}</span>
                      </motion.li>
                    ))}
                  </ol>
                )}
              </div>
            </ScrollArea>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-[#64B5D9]/20 bg-black/40 p-4"
          >
            <div className="flex items-start gap-3 text-sm text-[#F2EBE4]/80">
              <HelpCircle className="h-5 w-5 text-[#64B5D9] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p>
                  Vous jouez les pièces blanches. Sélectionnez une pièce pour voir les mouvements possibles, puis cliquez sur une case de destination.
                </p>
                <p>
                  Les niveaux de difficulté déterminent la profondeur de réflexion de l'IA et sa stratégie.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "rounded-lg border p-3 flex items-center justify-between",
              gameOver 
                ? "border-emerald-500/30 bg-emerald-500/10" 
                : "border-[#64B5D9]/20 bg-black/40"
            )}
          >
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  "h-3 w-3 rounded-full",
                  gameOver 
                    ? "bg-emerald-400" 
                    : isWhiteTurn 
                      ? "bg-white" 
                      : "bg-black border border-white/20"
                )} 
              />
              <span className="text-sm font-medium text-[#F2EBE4]">
                {gameOver 
                  ? "Partie terminée" 
                  : isWhiteTurn 
                    ? "Votre tour" 
                    : "Tour de l'IA"}
              </span>
            </div>
            
            {gameOver && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetGame}
                className="h-8 bg-transparent border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
              >
                Nouvelle partie
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
