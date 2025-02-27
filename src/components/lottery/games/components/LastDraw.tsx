
import { LotoDraw } from "../types";

interface LastDrawProps {
  draw: LotoDraw;
}

export function LastDraw({ draw }: LastDrawProps) {
  if (!draw.draw_numbers) return null;

  return (
    <div className="relative rounded-lg border border-[#64B5D9]/20 bg-white/5 p-4 overflow-hidden">
      {/* Éléments décoratifs CAD */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#64B5D9]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#64B5D9]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#64B5D9]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#64B5D9]/30" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-2">Dernier tirage</h3>
        <div className="flex gap-2">
          {draw.draw_numbers.map(number => (
            <div 
              key={number}
              className="relative w-10 h-10 rounded-full bg-[#64B5D9]/10 flex items-center justify-center text-[#64B5D9] font-bold"
            >
              <div className="absolute inset-0 rounded-full border border-[#64B5D9]/20" />
              {number}
            </div>
          ))}
          {draw.bonus_color && (
            <div 
              className="relative w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ 
                backgroundColor: `${draw.bonus_color.toLowerCase()}1a`,
                color: draw.bonus_color.toLowerCase()
              }}
            >
              <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${draw.bonus_color.toLowerCase()}30` }} />
              +
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
