
import { Bot } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-[#64B5D9]/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bot className="w-10 h-10 text-[#64B5D9]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1A1F2C]" />
        </div>
        <div>
          <h3 className="font-semibold text-[#F1F0FB]">Mr. Victaure</h3>
          <p className="text-xs text-[#F1F0FB]/60">Assistant IA</p>
        </div>
      </div>
    </div>
  );
}
