export type Database = {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string;
          join_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          join_code: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
        Relationships: [];
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string | null;
          display_name: string;
          relation: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id?: string | null;
          display_name: string;
          relation?: string;
          color?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_members"]["Insert"]>;
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          relation: string;
          phone: string | null;
          category: "famille" | "prestataire";
          provider_type: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          relation?: string;
          phone?: string | null;
          category?: "famille" | "prestataire";
          provider_type?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          storage_path: string;
          category: "administratif" | "recettes" | "photos" | "general";
          size_bytes: number;
          mime_type: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          storage_path: string;
          category?: "administratif" | "recettes" | "photos" | "general";
          size_bytes?: number;
          mime_type?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          location: string | null;
          start_at: string;
          end_at: string | null;
          all_day: boolean;
          color: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          location?: string | null;
          start_at: string;
          end_at?: string | null;
          all_day?: boolean;
          color?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [];
      };
      lists: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lists"]["Insert"]>;
        Relationships: [];
      };
      list_items: {
        Row: {
          id: string;
          list_id: string;
          label: string;
          done: boolean;
          assigned_to: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          label: string;
          done?: boolean;
          assigned_to?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["list_items"]["Insert"]>;
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          body: string | null;
          color: string;
          author: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          body?: string | null;
          color?: string;
          author?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
        Relationships: [];
      };
      photos: {
        Row: {
          id: string;
          family_id: string;
          album: string;
          storage_path: string;
          is_video: boolean;
          duration_seconds: number | null;
          taken_at: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          album?: string;
          storage_path: string;
          is_video?: boolean;
          duration_seconds?: number | null;
          taken_at?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["photos"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      activity_feed: {
        Row: {
          family_id: string;
          kind: "document" | "note" | "event" | "photo";
          title: string;
          actor: string | null;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type FamilyMember = Database["public"]["Tables"]["family_members"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type ListRow = Database["public"]["Tables"]["lists"]["Row"];
export type ListItem = Database["public"]["Tables"]["list_items"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Photo = Database["public"]["Tables"]["photos"]["Row"];
export type ActivityItem = Database["public"]["Views"]["activity_feed"]["Row"];
