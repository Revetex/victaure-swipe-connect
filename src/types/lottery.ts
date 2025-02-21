
export interface LotoDraw {
  id: string;
  draw_numbers: number[];
  bonus_color: string;
  prize_pool: number;
  winner_count: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_for: string;
  created_at: string;
  completed_at?: string;
}

export interface LotoTicket {
  id: string;
  draw_id: string;
  selected_numbers: number[];
  bonus_color: string;
  status: 'active' | 'won' | 'lost' | 'cancelled';
  price: number;
  purchase_date: string;
  winning_amount: number;
  checked: boolean;
}

export interface LotoWin {
  id: string;
  ticket_id: string;
  amount: number;
  matched_numbers: number;
  matched_color: boolean;
  claimed: boolean;
  created_at: string;
  claimed_at?: string;
}

export interface NumberStat {
  number: number;
  times_drawn: number;
  last_drawn?: string;
  times_picked: number;
}
