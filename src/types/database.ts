import { Database } from "@/integrations/supabase/types";
import type { PostgrestError } from "@supabase/supabase-js";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Helper type to handle Supabase query responses
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

// Specific table types
export type Profile = Tables<'profiles'>;
export type ProfileInsert = InsertTables<'profiles'>;
export type ProfileUpdate = UpdateTables<'profiles'>;

export type Job = Tables<'jobs'>;
export type JobInsert = InsertTables<'jobs'>;
export type JobUpdate = UpdateTables<'jobs'>;

export type Match = Tables<'matches'>;
export type MatchInsert = InsertTables<'matches'>;
export type MatchUpdate = UpdateTables<'matches'>;

export type Message = Tables<'messages'>;
export type MessageInsert = InsertTables<'messages'>;
export type MessageUpdate = UpdateTables<'messages'>;

export type Notification = Tables<'notifications'>;
export type NotificationInsert = InsertTables<'notifications'>;
export type NotificationUpdate = UpdateTables<'notifications'>;

export type AIChatMessage = Tables<'ai_chat_messages'>;
export type AIChatMessageInsert = InsertTables<'ai_chat_messages'>;
export type AIChatMessageUpdate = UpdateTables<'ai_chat_messages'>;

export type Experience = Tables<'experiences'>;
export type ExperienceInsert = InsertTables<'experiences'>;
export type ExperienceUpdate = UpdateTables<'experiences'>;

export type Certification = Tables<'certifications'>;
export type CertificationInsert = InsertTables<'certifications'>;
export type CertificationUpdate = UpdateTables<'certifications'>;

// Type guard for Supabase errors
export function isPostgrestError(error: unknown): error is PostgrestError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

// Helper type for query responses
export type QueryResult<T> = {
  data: T | null;
  error: PostgrestError | null;
};

// Helper type for single record responses
export type SingleQueryResult<T> = {
  data: T | null;
  error: PostgrestError | null;
};