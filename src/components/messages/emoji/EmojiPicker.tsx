
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

// Common emojis array
const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", 
  "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", 
  "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", 
  "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨", 
  "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", 
  "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", 
  "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", 
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", 
  "💞", "💓", "💗", "💖", "💘", "💝", "💟"
];

// Categories for the emoji picker
const categories = [
  { id: 'recent', name: 'Recent', emoji: '🕒' },
  { id: 'smileys', name: 'Smileys', emoji: '😀' },
  { id: 'people', name: 'People', emoji: '👋' },
  { id: 'animals', name: 'Animals', emoji: '🐶' },
  { id: 'food', name: 'Food', emoji: '🍔' },
  { id: 'travel', name: 'Travel', emoji: '✈️' },
  { id: 'activities', name: 'Activities', emoji: '⚽' },
  { id: 'objects', name: 'Objects', emoji: '💡' },
  { id: 'symbols', name: 'Symbols', emoji: '❤️' },
  { id: 'flags', name: 'Flags', emoji: '🏳️' }
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [filteredEmojis, setFilteredEmojis] = useState(emojis);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredEmojis(emojis.filter(emoji => 
        emoji.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredEmojis(emojis);
    }
  }, [searchQuery]);

  return (
    <div 
      ref={pickerRef}
      className="bg-[#242F44] border border-[#64B5D9]/20 rounded-lg shadow-lg w-72 max-h-80 flex flex-col overflow-hidden"
    >
      <div className="p-2 border-b border-[#64B5D9]/10 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-[#F2EBE4]/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un emoji"
            className="pl-8 h-8 bg-[#1A2335] border-[#64B5D9]/10 text-[#F2EBE4] placeholder-[#F2EBE4]/30"
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-8 w-8 text-[#F2EBE4]/70 hover:text-[#F2EBE4]"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex overflow-x-auto py-1 px-2 border-b border-[#64B5D9]/10 scrollbar-thin scrollbar-thumb-[#64B5D9]/10">
        {categories.map(category => (
          <button
            key={category.id}
            className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mx-1 ${
              activeCategory === category.id ? 'bg-[#64B5D9]/20' : 'hover:bg-[#1A2335]'
            }`}
            onClick={() => setActiveCategory(category.id)}
            title={category.name}
          >
            <span>{category.emoji}</span>
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 grid grid-cols-8 gap-1 scrollbar-thin scrollbar-thumb-[#64B5D9]/10">
        {filteredEmojis.map((emoji, index) => (
          <button
            key={index}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#1A2335] transition-colors"
            onClick={() => onEmojiSelect(emoji)}
          >
            <span className="text-xl">{emoji}</span>
          </button>
        ))}
        {filteredEmojis.length === 0 && (
          <div className="col-span-8 text-center py-4 text-[#F2EBE4]/50">
            Aucun emoji trouvé
          </div>
        )}
      </div>
    </div>
  );
}
