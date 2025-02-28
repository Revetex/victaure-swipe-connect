

export interface LotoDraw {
  id: string;
  prize_pool: number;
  scheduled_for: string;
  draw_numbers: number[] | null;
  bonus_color: string | null;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at: string | null;
}

export interface LotoTicket {
  id: string;
  user_id: string;
  draw_id: string;
  selected_numbers: number[];
  bonus_color: string;
  status: 'pending' | 'won' | 'lost';
  winning_amount: number;
  checked: boolean;
  created_at: string;
}

export interface LotoWin {
  id: string;
  ticket_id: string;
  user_id: string;
  draw_id: string;
  amount: number;
  matched_numbers: number;
  matched_color: boolean;
  created_at: string;
}

export interface LotoNumberStat {
  number: number;
  times_drawn: number;
  times_picked: number;
  last_drawn: string | null;
}

