export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          profile_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          profile_id?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          profile_id?: string;
        };
      };
      profiles: {
        Row: {
          created_at: string | null;
          id: string;
          username: unknown;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          username: unknown;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          username?: unknown;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      citext:
        | {
            Args: { "": string };
            Returns: unknown;
          }
        | {
            Args: { "": boolean };
            Returns: unknown;
          }
        | {
            Args: { "": unknown };
            Returns: unknown;
          };
      citext_hash: {
        Args: { "": unknown };
        Returns: number;
      };
      citextin: {
        Args: { "": unknown };
        Returns: unknown;
      };
      citextout: {
        Args: { "": unknown };
        Returns: unknown;
      };
      citextrecv: {
        Args: { "": unknown };
        Returns: unknown;
      };
      citextsend: {
        Args: { "": unknown };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
