/**
 * Hand-authored database types mirroring supabase/migrations.
 *
 * Once the migrations are applied to a live project you can regenerate this
 * file with:
 *   supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
 * (or the Supabase MCP `generate_typescript_types` tool). Until then this keeps
 * the app fully type-safe.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StockStatus = "in_stock" | "limited" | "made_to_order" | "out_of_stock";
export type ProductCondition = "new" | "used" | "refurbished";
export type QuoteStatus = "new" | "reviewing" | "quoted" | "won" | "lost" | "archived";
export type InvoiceType = "proforma" | "commercial" | "bulk";
export type InvoiceRequestStatus = "new" | "processing" | "invoiced" | "paid" | "cancelled";
export type LeadSource =
  | "web_form"
  | "whatsapp"
  | "quote_cart"
  | "invoice_request"
  | "phone"
  | "email"
  | "referral"
  | "other";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

/** A single line item inside a quote_requests.items array. */
export type QuoteItem = {
  product_id: string | null;
  name: string;
  slug?: string | null;
  quantity: number;
  custom_specs?: string | null;
  notes?: string | null;
};

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          sku: string | null;
          short_description: string | null;
          description: string | null;
          specs: Json;
          price: number | null;
          currency: string;
          condition: ProductCondition | null;
          stock_status: StockStatus;
          images: string[];
          videos: string[];
          is_featured: boolean;
          is_published: boolean;
          sort_order: number;
          view_count: number;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          sku?: string | null;
          short_description?: string | null;
          description?: string | null;
          specs?: Json;
          price?: number | null;
          currency?: string;
          condition?: ProductCondition | null;
          stock_status?: StockStatus;
          images?: string[];
          videos?: string[];
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          view_count?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          type: string | null;
          summary: string | null;
          description: string | null;
          images: string[];
          videos: string[];
          testimonial: string | null;
          testimonial_author: string | null;
          specs: Json;
          location: string | null;
          completed_at: string | null;
          is_featured: boolean;
          is_published: boolean;
          sort_order: number;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          type?: string | null;
          summary?: string | null;
          description?: string | null;
          images?: string[];
          videos?: string[];
          testimonial?: string | null;
          testimonial_author?: string | null;
          specs?: Json;
          location?: string | null;
          completed_at?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          company: string | null;
          country: string | null;
          address: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          company?: string | null;
          country?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          customer_id: string | null;
          name: string | null;
          email: string | null;
          phone: string | null;
          company: string | null;
          country: string | null;
          source: LeadSource;
          status: LeadStatus;
          message: string | null;
          product_id: string | null;
          quote_request_id: string | null;
          invoice_request_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          country?: string | null;
          source?: LeadSource;
          status?: LeadStatus;
          message?: string | null;
          product_id?: string | null;
          quote_request_id?: string | null;
          invoice_request_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
      quote_requests: {
        Row: {
          id: string;
          customer_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          company: string | null;
          country: string | null;
          items: Json;
          custom_specs: Json;
          notes: string | null;
          status: QuoteStatus;
          total_estimate: number | null;
          source: LeadSource;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          country?: string | null;
          items?: Json;
          custom_specs?: Json;
          notes?: string | null;
          status?: QuoteStatus;
          total_estimate?: number | null;
          source?: LeadSource;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quote_requests"]["Insert"]>;
        Relationships: [];
      };
      invoice_requests: {
        Row: {
          id: string;
          customer_id: string | null;
          full_name: string;
          company_name: string | null;
          email: string;
          phone: string | null;
          country: string | null;
          product_id: string | null;
          product_name: string | null;
          quantity: number;
          delivery_address: string | null;
          invoice_type: InvoiceType;
          status: InvoiceRequestStatus;
          notes: string | null;
          invoice_number: string | null;
          invoice_url: string | null;
          issued_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          full_name: string;
          company_name?: string | null;
          email: string;
          phone?: string | null;
          country?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          quantity?: number;
          delivery_address?: string | null;
          invoice_type?: InvoiceType;
          status?: InvoiceRequestStatus;
          notes?: string | null;
          invoice_number?: string | null;
          invoice_url?: string | null;
          issued_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoice_requests"]["Insert"]>;
        Relationships: [];
      };
      site_stats: {
        Row: {
          id: string;
          key: string;
          label: string;
          value: number;
          suffix: string | null;
          prefix: string | null;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          value?: number;
          suffix?: string | null;
          prefix?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_stats"]["Insert"]>;
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string | null;
          subtitle: string | null;
          body: string | null;
          media_url: string | null;
          content: Json;
          is_active: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title?: string | null;
          subtitle?: string | null;
          body?: string | null;
          media_url?: string | null;
          content?: Json;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_sections"]["Insert"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          author_company: string | null;
          content: string;
          rating: number | null;
          avatar_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_role?: string | null;
          author_company?: string | null;
          content: string;
          rating?: number | null;
          avatar_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          author: string | null;
          tags: string[];
          is_published: boolean;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          author?: string | null;
          tags?: string[];
          is_published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
      app_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["app_settings"]["Insert"]>;
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: number;
          event_type: string;
          path: string | null;
          product_id: string | null;
          referrer: string | null;
          session_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          event_type: string;
          path?: string | null;
          product_id?: string | null;
          referrer?: string | null;
          session_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      stock_status: StockStatus;
      product_condition: ProductCondition;
      quote_status: QuoteStatus;
      invoice_type: InvoiceType;
      invoice_request_status: InvoiceRequestStatus;
      lead_source: LeadSource;
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<never, never>;
  };
};

/* ---- Convenience row aliases -------------------------------------------- */
type Tables = Database["public"]["Tables"];
export type Category = Tables["categories"]["Row"];
export type Product = Tables["products"]["Row"];
export type Project = Tables["projects"]["Row"];
export type Customer = Tables["customers"]["Row"];
export type Lead = Tables["leads"]["Row"];
export type QuoteRequest = Tables["quote_requests"]["Row"];
export type InvoiceRequest = Tables["invoice_requests"]["Row"];
export type SiteStat = Tables["site_stats"]["Row"];
export type HomepageSection = Tables["homepage_sections"]["Row"];
export type Testimonial = Tables["testimonials"]["Row"];
export type BlogPost = Tables["blog_posts"]["Row"];
export type AppSetting = Tables["app_settings"]["Row"];
export type AnalyticsEvent = Tables["analytics_events"]["Row"];
