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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      client_order_supplier_orders: {
        Row: {
          client_order_id: string
          supplier_order_id: string
        }
        Insert: {
          client_order_id: string
          supplier_order_id: string
        }
        Update: {
          client_order_id?: string
          supplier_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_order_supplier_orders_client_order_id_fkey"
            columns: ["client_order_id"]
            isOneToOne: false
            referencedRelation: "client_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_order_supplier_orders_supplier_order_id_fkey"
            columns: ["supplier_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      client_orders: {
        Row: {
          client_id: string | null
          client_name: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          date: string
          id: string
          linked_invoice_id: string | null
          linked_sales_invoice_id: string | null
          note: string | null
          number: string
          phone: string
          status: Database["public"]["Enums"]["doc_status"]
          total: number
          updated_at: string
          vin: string | null
        }
        Insert: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          id?: string
          linked_invoice_id?: string | null
          linked_sales_invoice_id?: string | null
          note?: string | null
          number: string
          phone?: string
          status?: Database["public"]["Enums"]["doc_status"]
          total?: number
          updated_at?: string
          vin?: string | null
        }
        Update: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          id?: string
          linked_invoice_id?: string | null
          linked_sales_invoice_id?: string | null
          note?: string | null
          number?: string
          phone?: string
          status?: Database["public"]["Enums"]["doc_status"]
          total?: number
          updated_at?: string
          vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_co_invoice"
            columns: ["linked_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_co_sales_invoice"
            columns: ["linked_sales_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          balance: number
          balance_type: Database["public"]["Enums"]["balance_type"]
          city: string
          contact_person: string
          contracts: number
          created_at: string
          edrpou: string
          email: string
          id: string
          last_activity: string
          manager: string | null
          name: string
          notes: string | null
          phone: string
          source: string | null
          tags: string[]
          type: Database["public"]["Enums"]["contractor_type"]
          updated_at: string
        }
        Insert: {
          balance?: number
          balance_type?: Database["public"]["Enums"]["balance_type"]
          city?: string
          contact_person?: string
          contracts?: number
          created_at?: string
          edrpou?: string
          email?: string
          id?: string
          last_activity?: string
          manager?: string | null
          name: string
          notes?: string | null
          phone?: string
          source?: string | null
          tags?: string[]
          type: Database["public"]["Enums"]["contractor_type"]
          updated_at?: string
        }
        Update: {
          balance?: number
          balance_type?: Database["public"]["Enums"]["balance_type"]
          city?: string
          contact_person?: string
          contracts?: number
          created_at?: string
          edrpou?: string
          email?: string
          id?: string
          last_activity?: string
          manager?: string | null
          name?: string
          notes?: string | null
          phone?: string
          source?: string | null
          tags?: string[]
          type?: Database["public"]["Enums"]["contractor_type"]
          updated_at?: string
        }
        Relationships: []
      }
      doc_items: {
        Row: {
          article: string
          brand: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          doc_id: string
          doc_type: string
          id: string
          name: string
          price: number
          qty: number
          sort_order: number
          total: number
        }
        Insert: {
          article?: string
          brand?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          doc_id: string
          doc_type: string
          id?: string
          name?: string
          price?: number
          qty?: number
          sort_order?: number
          total?: number
        }
        Update: {
          article?: string
          brand?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          doc_id?: string
          doc_type?: string
          id?: string
          name?: string
          price?: number
          qty?: number
          sort_order?: number
          total?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          counterparty_id: string | null
          counterparty_name: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          date: string
          direction: Database["public"]["Enums"]["invoice_direction"]
          due_date: string | null
          id: string
          linked_doc_id: string | null
          linked_doc_type: string | null
          number: string
          paid: number
          status: Database["public"]["Enums"]["doc_status"]
          total: number
          updated_at: string
        }
        Insert: {
          counterparty_id?: string | null
          counterparty_name?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          direction: Database["public"]["Enums"]["invoice_direction"]
          due_date?: string | null
          id?: string
          linked_doc_id?: string | null
          linked_doc_type?: string | null
          number: string
          paid?: number
          status?: Database["public"]["Enums"]["doc_status"]
          total?: number
          updated_at?: string
        }
        Update: {
          counterparty_id?: string | null
          counterparty_name?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          direction?: Database["public"]["Enums"]["invoice_direction"]
          due_date?: string | null
          id?: string
          linked_doc_id?: string | null
          linked_doc_type?: string | null
          number?: string
          paid?: number
          status?: Database["public"]["Enums"]["doc_status"]
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_counterparty_id_fkey"
            columns: ["counterparty_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          amount: number | null
          company: string | null
          converted_contractor_id: string | null
          created_at: string
          email: string | null
          id: string
          manager: string
          name: string
          note: string | null
          phone: string
          source: string
          stage: Database["public"]["Enums"]["lead_stage"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          company?: string | null
          converted_contractor_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          manager?: string
          name: string
          note?: string | null
          phone: string
          source?: string
          stage?: Database["public"]["Enums"]["lead_stage"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          company?: string | null
          converted_contractor_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          manager?: string
          name?: string
          note?: string | null
          phone?: string
          source?: string
          stage?: Database["public"]["Enums"]["lead_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_contractor_id_fkey"
            columns: ["converted_contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_invoices: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          date: string
          id: string
          linked_supplier_order_id: string | null
          number: string
          status: Database["public"]["Enums"]["doc_status"]
          supplier_id: string | null
          supplier_name: string
          total: number
          updated_at: string
          warehouse: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          id?: string
          linked_supplier_order_id?: string | null
          number: string
          status?: Database["public"]["Enums"]["doc_status"]
          supplier_id?: string | null
          supplier_name?: string
          total?: number
          updated_at?: string
          warehouse?: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          id?: string
          linked_supplier_order_id?: string | null
          number?: string
          status?: Database["public"]["Enums"]["doc_status"]
          supplier_id?: string | null
          supplier_name?: string
          total?: number
          updated_at?: string
          warehouse?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_invoices_linked_supplier_order_id_fkey"
            columns: ["linked_supplier_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoices: {
        Row: {
          client_id: string | null
          client_name: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          date: string
          id: string
          linked_client_order_id: string | null
          linked_invoice_id: string | null
          number: string
          status: Database["public"]["Enums"]["doc_status"]
          total: number
          updated_at: string
          warehouse: string
        }
        Insert: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          id?: string
          linked_client_order_id?: string | null
          linked_invoice_id?: string | null
          number: string
          status?: Database["public"]["Enums"]["doc_status"]
          total?: number
          updated_at?: string
          warehouse?: string
        }
        Update: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          id?: string
          linked_client_order_id?: string | null
          linked_invoice_id?: string | null
          number?: string
          status?: Database["public"]["Enums"]["doc_status"]
          total?: number
          updated_at?: string
          warehouse?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_si_invoice"
            columns: ["linked_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_invoices_linked_client_order_id_fkey"
            columns: ["linked_client_order_id"]
            isOneToOne: false
            referencedRelation: "client_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          amount: number
          contractor_id: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          date: string
          description: string
          document: string
          id: string
          type: Database["public"]["Enums"]["settlement_type"]
        }
        Insert: {
          amount?: number
          contractor_id: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          description?: string
          document?: string
          id?: string
          type: Database["public"]["Enums"]["settlement_type"]
        }
        Update: {
          amount?: number
          contractor_id?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          description?: string
          document?: string
          id?: string
          type?: Database["public"]["Enums"]["settlement_type"]
        }
        Relationships: [
          {
            foreignKeyName: "settlements_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_orders: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          date: string
          expected_date: string | null
          id: string
          linked_client_order_id: string | null
          linked_purchase_invoice_id: string | null
          number: string
          status: Database["public"]["Enums"]["doc_status"]
          supplier_id: string | null
          supplier_name: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          expected_date?: string | null
          id?: string
          linked_client_order_id?: string | null
          linked_purchase_invoice_id?: string | null
          number: string
          status?: Database["public"]["Enums"]["doc_status"]
          supplier_id?: string | null
          supplier_name?: string
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          date?: string
          expected_date?: string | null
          id?: string
          linked_client_order_id?: string | null
          linked_purchase_invoice_id?: string | null
          number?: string
          status?: Database["public"]["Enums"]["doc_status"]
          supplier_id?: string | null
          supplier_name?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_so_purchase_invoice"
            columns: ["linked_purchase_invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_orders_linked_client_order_id_fkey"
            columns: ["linked_client_order_id"]
            isOneToOne: false
            referencedRelation: "client_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          contractor_id: string
          created_at: string
          id: string
          make: string
          model: string
          plate: string | null
          updated_at: string
          vin: string
          year: number
        }
        Insert: {
          contractor_id: string
          created_at?: string
          id?: string
          make?: string
          model?: string
          plate?: string | null
          updated_at?: string
          vin?: string
          year?: number
        }
        Update: {
          contractor_id?: string
          created_at?: string
          id?: string
          make?: string
          model?: string
          plate?: string | null
          updated_at?: string
          vin?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      balance_type: "positive" | "negative" | "zero"
      contractor_type: "supplier" | "buyer"
      currency_code: "UAH" | "EUR" | "USD"
      doc_status:
        | "draft"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      invoice_direction: "incoming" | "outgoing"
      lead_stage:
        | "new"
        | "contact"
        | "negotiation"
        | "proposal"
        | "won"
        | "lost"
      settlement_type: "income" | "expense"
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
    Enums: {
      balance_type: ["positive", "negative", "zero"],
      contractor_type: ["supplier", "buyer"],
      currency_code: ["UAH", "EUR", "USD"],
      doc_status: [
        "draft",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      invoice_direction: ["incoming", "outgoing"],
      lead_stage: ["new", "contact", "negotiation", "proposal", "won", "lost"],
      settlement_type: ["income", "expense"],
    },
  },
} as const
