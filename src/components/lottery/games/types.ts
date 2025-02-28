
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
