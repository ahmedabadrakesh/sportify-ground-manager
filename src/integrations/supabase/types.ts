export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_slots: {
        Row: {
          booking_id: string
          slot_id: string
        }
        Insert: {
          booking_id: string
          slot_id: string
        }
        Update: {
          booking_id?: string
          slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_slots_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_slots_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_status: string
          created_at: string
          date: string
          game_ids: string[] | null
          ground_id: string
          id: string
          payment_status: string
          sports_area_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_status: string
          created_at?: string
          date: string
          game_ids?: string[] | null
          ground_id: string
          id?: string
          payment_status: string
          sports_area_id?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_status?: string
          created_at?: string
          date?: string
          game_ids?: string[] | null
          ground_id?: string
          id?: string
          payment_status?: string
          sports_area_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string
          city: string
          created_at: string
          event_date: string
          event_name: string
          event_time: string
          id: string
          image: string | null
          location: Json | null
          qr_code: string | null
          registration_url: string | null
          sport_id: string | null
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          event_date: string
          event_name: string
          event_time: string
          id?: string
          image?: string | null
          location?: Json | null
          qr_code?: string | null
          registration_url?: string | null
          sport_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          event_date?: string
          event_name?: string
          event_time?: string
          id?: string
          image?: string | null
          location?: Json | null
          qr_code?: string | null
          registration_url?: string | null
          sport_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      ground_facilities: {
        Row: {
          created_at: string
          facility_id: string
          ground_id: string
          id: string
        }
        Insert: {
          created_at?: string
          facility_id: string
          ground_id: string
          id?: string
        }
        Update: {
          created_at?: string
          facility_id?: string
          ground_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ground_facilities_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ground_facilities_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      ground_inventory: {
        Row: {
          ground_id: string
          item_id: string
          quantity: number
        }
        Insert: {
          ground_id: string
          item_id: string
          quantity?: number
        }
        Update: {
          ground_id?: string
          item_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "ground_inventory_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ground_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      grounds: {
        Row: {
          address: string
          created_at: string
          description: string | null
          facilities: string[] | null
          games: string[] | null
          id: string
          images: string[] | null
          location: Json | null
          name: string
          owner_id: string
          rating: number | null
          review_count: number | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          games?: string[] | null
          id?: string
          images?: string[] | null
          location?: Json | null
          name: string
          owner_id: string
          rating?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          games?: string[] | null
          id?: string
          images?: string[] | null
          location?: Json | null
          name?: string
          owner_id?: string
          rating?: number | null
          review_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grounds_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          price: number
          purchase_price: number | null
          purchase_quantity: number | null
          quantity: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          price: number
          purchase_price?: number | null
          purchase_quantity?: number | null
          quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: number
          purchase_price?: number | null
          purchase_quantity?: number | null
          quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_method: string
          payment_status: string
          shipping_address: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method: string
          payment_status: string
          shipping_address: string
          status: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: string
          payment_status?: string
          shipping_address?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_registrations: {
        Row: {
          created_at: string
          id: string
          name: string
          password: string
          phone: string
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          password: string
          phone: string
          updated_at?: string
          user_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          password?: string
          phone?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      sports_areas: {
        Row: {
          ground_id: string
          id: string
          name: string
        }
        Insert: {
          ground_id: string
          id?: string
          name: string
        }
        Update: {
          ground_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sports_areas_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_professionals: {
        Row: {
          accomplishments: string[] | null
          address: string
          awards: string[] | null
          certifications: string[] | null
          city: string
          coaching_availability: string[] | null
          comments: string | null
          contact_number: string
          created_at: string
          facebook_link: string | null
          fee: number
          fee_type: Database["public"]["Enums"]["fee_type"]
          game_id: string
          id: string
          images: string[] | null
          instagram_link: string | null
          level: string | null
          linkedin_link: string | null
          name: string
          photo: string | null
          profession_type: Database["public"]["Enums"]["sport_profession_type"]
          punch_line: string | null
          total_match_played: number | null
          training_locations: string[] | null
          updated_at: string
          user_id: string | null
          videos: string[] | null
          website: string | null
          years_of_experience: number | null
          youtube_link: string | null
        }
        Insert: {
          accomplishments?: string[] | null
          address: string
          awards?: string[] | null
          certifications?: string[] | null
          city: string
          coaching_availability?: string[] | null
          comments?: string | null
          contact_number: string
          created_at?: string
          facebook_link?: string | null
          fee: number
          fee_type: Database["public"]["Enums"]["fee_type"]
          game_id: string
          id?: string
          images?: string[] | null
          instagram_link?: string | null
          level?: string | null
          linkedin_link?: string | null
          name: string
          photo?: string | null
          profession_type: Database["public"]["Enums"]["sport_profession_type"]
          punch_line?: string | null
          total_match_played?: number | null
          training_locations?: string[] | null
          updated_at?: string
          user_id?: string | null
          videos?: string[] | null
          website?: string | null
          years_of_experience?: number | null
          youtube_link?: string | null
        }
        Update: {
          accomplishments?: string[] | null
          address?: string
          awards?: string[] | null
          certifications?: string[] | null
          city?: string
          coaching_availability?: string[] | null
          comments?: string | null
          contact_number?: string
          created_at?: string
          facebook_link?: string | null
          fee?: number
          fee_type?: Database["public"]["Enums"]["fee_type"]
          game_id?: string
          id?: string
          images?: string[] | null
          instagram_link?: string | null
          level?: string | null
          linkedin_link?: string | null
          name?: string
          photo?: string | null
          profession_type?: Database["public"]["Enums"]["sport_profession_type"]
          punch_line?: string | null
          total_match_played?: number | null
          training_locations?: string[] | null
          updated_at?: string
          user_id?: string | null
          videos?: string[] | null
          website?: string | null
          years_of_experience?: number | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_professionals_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sports_professionals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          created_at: string
          date: string
          end_time: string
          ground_id: string
          id: string
          is_booked: boolean | null
          price: number
          sports_area_id: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          ground_id: string
          id?: string
          is_booked?: boolean | null
          price: number
          sports_area_id?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          ground_id?: string
          id?: string
          is_booked?: boolean | null
          price?: number
          sports_area_id?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_admin_user: {
        Args: {
          user_name: string
          user_email: string
          user_phone: string
          user_whatsapp: string
        }
        Returns: {
          auth_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          whatsapp: string | null
        }
      }
      delete_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          auth_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          whatsapp: string | null
        }[]
      }
      get_auth_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      fee_type: "Per Hour" | "Per Day" | "Per Match"
      sport_profession_type:
        | "Athlete"
        | "Coach"
        | "Trainer"
        | "Sports Manager"
        | "Support Staff"
        | "Player"
        | "Umpire"
      user_role:
        | "user"
        | "sports_professional"
        | "admin"
        | "super_admin"
        | "ground_owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      fee_type: ["Per Hour", "Per Day", "Per Match"],
      sport_profession_type: [
        "Athlete",
        "Coach",
        "Trainer",
        "Sports Manager",
        "Support Staff",
        "Player",
        "Umpire",
      ],
      user_role: [
        "user",
        "sports_professional",
        "admin",
        "super_admin",
        "ground_owner",
      ],
    },
  },
} as const
