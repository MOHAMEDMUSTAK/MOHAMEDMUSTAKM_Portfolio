export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          username?: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      ai_assistant_facts: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          label: string
          text: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          label: string
          text: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          label?: string
          text?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          date: string | null
          display_order: number
          id: string
          image_url: string | null
          name: string
          organization: string
          verification_link: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          name: string
          organization: string
          verification_link?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          name?: string
          organization?: string
          verification_link?: string | null
        }
        Relationships: []
      }
      contact: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          type: string
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          type: string
          value: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          type?: string
          value?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          featured: boolean | null
          github_link: string | null
          id: string
          image_url: string | null
          name: string
          technologies: string[] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean | null
          github_link?: string | null
          id?: string
          image_url?: string | null
          name: string
          technologies?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean | null
          github_link?: string | null
          id?: string
          image_url?: string | null
          name?: string
          technologies?: string[] | null
        }
        Relationships: []
      }
      resume: {
        Row: {
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          preview_url: string | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          preview_url?: string | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          preview_url?: string | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          color: string | null
          created_at: string
          display_order: number
          icon: string | null
          id: string
          name: string
          proficiency: number
        }
        Insert: {
          category?: string
          color?: string | null
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          proficiency?: number
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          proficiency?: number
        }
        Relationships: []
      }
      stats: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          value?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          value?: string
        }
        Relationships: []
      }
      timeline: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          gradient: string | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          gradient?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          gradient?: string | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      why_hire_me: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          gradient: string | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          gradient?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          gradient?: string | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
