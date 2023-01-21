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
          room_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          profile_id?: string;
          room_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          profile_id?: string;
          room_id?: string | null;
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
      room_participants: {
        Row: {
          created_at: string;
          profile_id: string;
          room_id: string;
        };
        Insert: {
          created_at?: string;
          profile_id: string;
          room_id: string;
        };
        Update: {
          created_at?: string;
          profile_id?: string;
          room_id?: string;
        };
      };
      rooms: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
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
      create_room: {
        Args: { name: string };
        Returns: unknown;
      };
      is_room_participant: {
        Args: { room_id: string; profile_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
