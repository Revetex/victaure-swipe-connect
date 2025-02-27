
import { LotoDraw } from "../types";

interface LastDrawProps {
  draw: LotoDraw;
}

export function LastDraw({ draw }: LastDrawProps) {
  if (!draw.draw_numbers) return null;

  return (
    <div className="rounded-lg border border-[#64B5D9]/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold mb-2">Dernier tirage</h3>
      <div className="flex gap-2">
        {draw.draw_numbers.map(number => (
          <div 
            key={number}
            className="w-10 h-10 rounded-full bg-[#64B5D9]/10 flex items-center justify-center text-[#64B5D9] font-bold"
          >
            {number}
          </div>
        ))}
        {draw.bonus_color && (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
            style={{ 
              backgroundColor: `${draw.bonus_color.toLowerCase()}1a`,
              color: draw.bonus_color.toLowerCase()
            }}
          >
            +
          </div>
        )}
      </div>
    </div>
  );
}
