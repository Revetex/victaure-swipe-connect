
import { Bot } from "lucide-react";

export function ChatHeader() {
  return (
    <>
      <div className="relative">
        <Bot className="w-8 h-8 text-[#64B5D9]" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1A1F2C]" />
      </div>
      <div>
        <h3 className="font-medium text-sm text-[#F1F0FB]">Mr. Victaure</h3>
      </div>
    </>
  );
}
