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
      agent_numbers: {
        Row: {
          agent_mobile: string | null
          agent_name: string | null
          agent_whatsapp: string | null
          property_url: string
        }
        Insert: {
          agent_mobile?: string | null
          agent_name?: string | null
          agent_whatsapp?: string | null
          property_url: string
        }
        Update: {
          agent_mobile?: string | null
          agent_name?: string | null
          agent_whatsapp?: string | null
          property_url?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          "Agency Fee Applicable": string | null
          Aircon: string | null
          Availability: string | null
          Balcony: string | null
          Bathrooms: number | null
          "BBQ Pits": string | null
          Bedrooms: number | null
          "Built Year": number | null
          Clubhouse: string | null
          "condo  Name": string | null
          "Cooking Allowed": string | null
          "Cooking Preference": string | null
          Country: string | null
          "Distance from MRT": string | null
          District: string | null
          Facing: string | null
          "Fitness Corner": string | null
          "Floor Area (sqft)": number | null
          "Floor Level": string | null
          "Furnishing Status": string | null
          "Gender Preferred": string | null
          "Group Size": string | null
          Gym: string | null
          Jacuzzi: string | null
          "Jogging Track": string | null
          Level: number | null
          "Maid Room Available": string | null
          "Minimum Lease Period": string | null
          "MRT Line": string | null
          "Nationality Preference": string | null
          "Nearest Bus Stop": string | null
          "Nearest Convenience Store": string | null
          "Nearest MRT": string | null
          "Nearest School": string | null
          "Nearest University": string | null
          "Pet Friendly": string | null
          "Postal Code": number | null
          "Preferred Profile": string | null
          "Property Type": string | null
          Renovated: string | null
          "Rental Price (SGD/month)": number | null
          "Security Deposit": string | null
          "Smoking Allowed": string | null
          Street: string | null
          "Swimming Pool": string | null
          "Unit No": string | null
          "Visitors Allowed": string | null
        }
        Insert: {
          "Agency Fee Applicable"?: string | null
          Aircon?: string | null
          Availability?: string | null
          Balcony?: string | null
          Bathrooms?: number | null
          "BBQ Pits"?: string | null
          Bedrooms?: number | null
          "Built Year"?: number | null
          Clubhouse?: string | null
          "condo  Name"?: string | null
          "Cooking Allowed"?: string | null
          "Cooking Preference"?: string | null
          Country?: string | null
          "Distance from MRT"?: string | null
          District?: string | null
          Facing?: string | null
          "Fitness Corner"?: string | null
          "Floor Area (sqft)"?: number | null
          "Floor Level"?: string | null
          "Furnishing Status"?: string | null
          "Gender Preferred"?: string | null
          "Group Size"?: string | null
          Gym?: string | null
          Jacuzzi?: string | null
          "Jogging Track"?: string | null
          Level?: number | null
          "Maid Room Available"?: string | null
          "Minimum Lease Period"?: string | null
          "MRT Line"?: string | null
          "Nationality Preference"?: string | null
          "Nearest Bus Stop"?: string | null
          "Nearest Convenience Store"?: string | null
          "Nearest MRT"?: string | null
          "Nearest School"?: string | null
          "Nearest University"?: string | null
          "Pet Friendly"?: string | null
          "Postal Code"?: number | null
          "Preferred Profile"?: string | null
          "Property Type"?: string | null
          Renovated?: string | null
          "Rental Price (SGD/month)"?: number | null
          "Security Deposit"?: string | null
          "Smoking Allowed"?: string | null
          Street?: string | null
          "Swimming Pool"?: string | null
          "Unit No"?: string | null
          "Visitors Allowed"?: string | null
        }
        Update: {
          "Agency Fee Applicable"?: string | null
          Aircon?: string | null
          Availability?: string | null
          Balcony?: string | null
          Bathrooms?: number | null
          "BBQ Pits"?: string | null
          Bedrooms?: number | null
          "Built Year"?: number | null
          Clubhouse?: string | null
          "condo  Name"?: string | null
          "Cooking Allowed"?: string | null
          "Cooking Preference"?: string | null
          Country?: string | null
          "Distance from MRT"?: string | null
          District?: string | null
          Facing?: string | null
          "Fitness Corner"?: string | null
          "Floor Area (sqft)"?: number | null
          "Floor Level"?: string | null
          "Furnishing Status"?: string | null
          "Gender Preferred"?: string | null
          "Group Size"?: string | null
          Gym?: string | null
          Jacuzzi?: string | null
          "Jogging Track"?: string | null
          Level?: number | null
          "Maid Room Available"?: string | null
          "Minimum Lease Period"?: string | null
          "MRT Line"?: string | null
          "Nationality Preference"?: string | null
          "Nearest Bus Stop"?: string | null
          "Nearest Convenience Store"?: string | null
          "Nearest MRT"?: string | null
          "Nearest School"?: string | null
          "Nearest University"?: string | null
          "Pet Friendly"?: string | null
          "Postal Code"?: number | null
          "Preferred Profile"?: string | null
          "Property Type"?: string | null
          Renovated?: string | null
          "Rental Price (SGD/month)"?: number | null
          "Security Deposit"?: string | null
          "Smoking Allowed"?: string | null
          Street?: string | null
          "Swimming Pool"?: string | null
          "Unit No"?: string | null
          "Visitors Allowed"?: string | null
        }
        Relationships: []
      }
      prospect: {
        Row: {
          created_at: string
          Email: string | null
          Gender: string | null
          Name: string | null
          Nationality: string | null
          Phone: number | null
        }
        Insert: {
          created_at?: string
          Email?: string | null
          Gender?: string | null
          Name?: string | null
          Nationality?: string | null
          Phone?: number | null
        }
        Update: {
          created_at?: string
          Email?: string | null
          Gender?: string | null
          Name?: string | null
          Nationality?: string | null
          Phone?: number | null
        }
        Relationships: []
      }
      rate_psf: {
        Row: {
          date: string | null
          url_23600506: string | null
          url_23602000: string | null
          url_23785073: string | null
          url_25340539: string | null
          url_25362943: string | null
          url_25432339: string | null
          url_25589601: string | null
          url_25612080: string | null
          url_60012059: string | null
          url_60013539: string | null
          url_60019279: string | null
        }
        Insert: {
          date?: string | null
          url_23600506?: string | null
          url_23602000?: string | null
          url_23785073?: string | null
          url_25340539?: string | null
          url_25362943?: string | null
          url_25432339?: string | null
          url_25589601?: string | null
          url_25612080?: string | null
          url_60012059?: string | null
          url_60013539?: string | null
          url_60019279?: string | null
        }
        Update: {
          date?: string | null
          url_23600506?: string | null
          url_23602000?: string | null
          url_23785073?: string | null
          url_25340539?: string | null
          url_25362943?: string | null
          url_25432339?: string | null
          url_25589601?: string | null
          url_25612080?: string | null
          url_60012059?: string | null
          url_60013539?: string | null
          url_60019279?: string | null
        }
        Relationships: []
      }
      rent_data: {
        Row: {
          date: string | null
          url_23600506: number | null
          url_23602000: number | null
          url_23785073: number | null
          url_25340539: number | null
          url_25362943: number | null
          url_25432339: number | null
          url_25589601: number | null
          url_25612080: number | null
          url_60012059: number | null
          url_60013539: number | null
          url_60019279: number | null
        }
        Insert: {
          date?: string | null
          url_23600506?: number | null
          url_23602000?: number | null
          url_23785073?: number | null
          url_25340539?: number | null
          url_25362943?: number | null
          url_25432339?: number | null
          url_25589601?: number | null
          url_25612080?: number | null
          url_60012059?: number | null
          url_60013539?: number | null
          url_60019279?: number | null
        }
        Update: {
          date?: string | null
          url_23600506?: number | null
          url_23602000?: number | null
          url_23785073?: number | null
          url_25340539?: number | null
          url_25362943?: number | null
          url_25432339?: number | null
          url_25589601?: number | null
          url_25612080?: number | null
          url_60012059?: number | null
          url_60013539?: number | null
          url_60019279?: number | null
        }
        Relationships: []
      }
      rent_track: {
        Row: {
          "2025_06_27": string | null
          "2025_06_28": string | null
          "2025_06_29": string | null
          "2025_06_30": string | null
          "2025_07_01": string | null
          bedrooms: number | null
          property_name: string | null
          property_url: string
        }
        Insert: {
          "2025_06_27"?: string | null
          "2025_06_28"?: string | null
          "2025_06_29"?: string | null
          "2025_06_30"?: string | null
          "2025_07_01"?: string | null
          bedrooms?: number | null
          property_name?: string | null
          property_url?: string
        }
        Update: {
          "2025_06_27"?: string | null
          "2025_06_28"?: string | null
          "2025_06_29"?: string | null
          "2025_06_30"?: string | null
          "2025_07_01"?: string | null
          bedrooms?: number | null
          property_name?: string | null
          property_url?: string
        }
        Relationships: []
      }
      url_agent: {
        Row: {
          id: number
          properties: string | null
          status: string | null
        }
        Insert: {
          id?: number
          properties?: string | null
          status?: string | null
        }
        Update: {
          id?: number
          properties?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_details: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      user_message: {
        Row: {
          created_at: string
          message: string | null
        }
        Insert: {
          created_at: string
          message?: string | null
        }
        Update: {
          created_at?: string
          message?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { filter: Json; match_count: number; query_embedding: string }
        Returns: {
          id: string
          content: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
