export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TechStackCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "database"
  | "no_code"
  | "tools";

export type ProjectScreenshot = {
  url: string;
  caption?: string | null;
  alt?: string | null;
};

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
          domain: string | null;
          tagline: string | null;
          summary: string;
          description: string;
          impact: string | null;
          image_url: string | null;
          cover_image_url: string | null;
          status: string | null;
          video_url: string | null;
          problem: string | null;
          my_role: string | null;
          solution: string | null;
          outcome: string | null;
          screenshots: ProjectScreenshot[];
          repo_url: string | null;
          live_url: string | null;
          case_study_url: string | null;
          featured: boolean;
          featured_order: number;
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
          domain?: string | null;
          tagline?: string | null;
          summary: string;
          description: string;
          impact?: string | null;
          image_url?: string | null;
          cover_image_url?: string | null;
          status?: string | null;
          video_url?: string | null;
          problem?: string | null;
          my_role?: string | null;
          solution?: string | null;
          outcome?: string | null;
          screenshots?: ProjectScreenshot[];
          repo_url?: string | null;
          live_url?: string | null;
          case_study_url?: string | null;
          featured?: boolean;
          featured_order?: number;
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
          domain?: string | null;
          tagline?: string | null;
          summary?: string;
          description?: string;
          impact?: string | null;
          image_url?: string | null;
          cover_image_url?: string | null;
          status?: string | null;
          video_url?: string | null;
          problem?: string | null;
          my_role?: string | null;
          solution?: string | null;
          outcome?: string | null;
          screenshots?: ProjectScreenshot[];
          repo_url?: string | null;
          live_url?: string | null;
          case_study_url?: string | null;
          featured?: boolean;
          featured_order?: number;
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
      resume_meta: {
        Row: {
          id: string;
          label: string;
          file_url: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label?: string;
          file_url: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          file_url?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tech_stack_items: {
        Row: {
          id: string;
          name: string;
          category: TechStackCategory;
          icon_url: string | null;
          sort_order: number;
          visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: TechStackCategory;
          icon_url?: string | null;
          sort_order?: number;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: TechStackCategory;
          icon_url?: string | null;
          sort_order?: number;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_tech_stack: {
        Row: {
          id: string;
          project_id: string;
          tech_stack_item_id: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          tech_stack_item_id: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          project_id?: string;
          tech_stack_item_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "project_tech_stack_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tech_stack_tech_stack_item_id_fkey";
            columns: ["tech_stack_item_id"];
            isOneToOne: false;
            referencedRelation: "tech_stack_items";
            referencedColumns: ["id"];
          },
        ];
      };
      client_testimonials: {
        Row: {
          id: string;
          quote: string;
          client_name: string;
          client_title: string | null;
          client_company: string | null;
          avatar_url: string | null;
          visible: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          client_name: string;
          client_title?: string | null;
          client_company?: string | null;
          avatar_url?: string | null;
          visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quote?: string;
          client_name?: string;
          client_title?: string | null;
          client_company?: string | null;
          avatar_url?: string | null;
          visible?: boolean;
          sort_order?: number;
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
    Enums: {
      tech_stack_category: TechStackCategory;
    };
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

export type ResumeMeta = Tables<"resume_meta">;
export type TechStackItem = Tables<"tech_stack_items">;
export type ProjectTechStack = Tables<"project_tech_stack"> & {
  tech_stack_items: TechStackItem;
};
export type Project = Tables<"projects"> & {
  project_tech_stack?: ProjectTechStack[];
};
export type ClientTestimonial = Tables<"client_testimonials">;
