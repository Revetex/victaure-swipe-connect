import { Database as DatabaseGenerated } from '@/types/database/auth';
import { ProfileTypes } from '@/types/database/profiles';
import { JobTypes } from '@/types/database/jobs';
import { MatchTypes } from '@/types/database/matches';
import { PaymentTypes } from '@/types/database/payments';
import { MessageTypes } from '@/types/database/messages';

export type Database = DatabaseGenerated['public'] & 
  ProfileTypes['Tables'] & 
  JobTypes['Tables'] & 
  MatchTypes['Tables'] & 
  PaymentTypes['Tables'] & 
  MessageTypes['Tables'];

export type Tables<T extends keyof Database> = Database[T]['Row'];
export type Inserts<T extends keyof Database> = Database[T]['Insert'];
export type Updates<T extends keyof Database> = Database[T]['Update'];