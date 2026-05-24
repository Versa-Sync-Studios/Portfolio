export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          full_name: string;
          role: string;
          headline: string;
          bio: string;
          avatar_url: string | null;
          resume_url: string | null;
          location: string | null;
          email: string;
          github_url: string | null;
          linkedin_url: string | null;
          website_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          role: string;
          headline: string;
          bio: string;
          avatar_url?: string | null;
          resume_url?: string | null;
          location?: string | null;
          email: string;
          github_url?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: string;
          headline?: string;
          bio?: string;
          avatar_url?: string | null;
          resume_url?: string | null;
          location?: string | null;
          email?: string;
          github_url?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string;
          description: string;
          impact: string | null;
          image_url: string | null;
          repo_url: string | null;
          live_url: string | null;
          case_study_url: string | null;
          tech_stack: string[];
          featured: boolean;
          is_published: boolean;
          sort_order: number;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          description: string;
          impact?: string | null;
          image_url?: string | null;
          repo_url?: string | null;
          live_url?: string | null;
          case_study_url?: string | null;
          tech_stack?: string[];
          featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          description?: string;
          impact?: string | null;
          image_url?: string | null;
          repo_url?: string | null;
          live_url?: string | null;
          case_study_url?: string | null;
          tech_stack?: string[];
          featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          proficiency: number;
          icon_name: string | null;
          sort_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          proficiency?: number;
          icon_name?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          proficiency?: number;
          icon_name?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experience: {
        Row: {
          id: string;
          company: string;
          role: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          summary: string;
          highlights: string[];
          tech_stack: string[];
          sort_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          summary: string;
          highlights?: string[];
          tech_stack?: string[];
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          role?: string;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          summary?: string;
          highlights?: string[];
          tech_stack?: string[];
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          author_company: string | null;
          author_avatar_url: string | null;
          quote: string;
          source_url: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_role?: string | null;
          author_company?: string | null;
          author_avatar_url?: string | null;
          quote: string;
          source_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_role?: string | null;
          author_company?: string | null;
          author_avatar_url?: string | null;
          quote?: string;
          source_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string | null;
          subject: string | null;
          message: string;
          source: string;
          status: "new" | "read" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company?: string | null;
          subject?: string | null;
          message: string;
          source?: string;
          status?: "new";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string | null;
          subject?: string | null;
          message?: string;
          source?: string;
          status?: "new" | "read" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Row"];

export type TablesInsert<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Insert"];

export type TablesUpdate<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Update"];
