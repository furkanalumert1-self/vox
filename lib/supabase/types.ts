export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          vapi_assistant_id: string | null;
          name: string;
          voice: string;
          greeting: string;
          actions: Json;
          is_active: boolean;
          calls_today: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["agents"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["agents"]["Insert"]>;
      };
      calls: {
        Row: {
          id: string;
          vapi_call_id: string | null;
          agent_id: string | null;
          agent_name: string | null;
          caller_number: string | null;
          caller_name: string | null;
          started_at: string;
          ended_at: string | null;
          duration_s: number | null;
          outcome: string | null;
          sentiment: string | null;
          transcript: Json | null;
          summary: string | null;
          recording_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["calls"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["calls"]["Insert"]>;
      };
    };
  };
}
