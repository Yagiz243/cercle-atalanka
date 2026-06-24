export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          description: string
          cover_image_url: string
          pdf_url: string | null
          price: number
          is_premium: boolean
          category: string
          rating: number | null
          reviews: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description: string
          cover_image_url: string
          pdf_url?: string | null
          price: number
          is_premium?: boolean
          category: string
          rating?: number | null
          reviews?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          author?: string
          description?: string
          cover_image_url?: string
          pdf_url?: string | null
          price?: number
          is_premium?: boolean
          category?: string
          rating?: number | null
          reviews?: number | null
          updated_at?: string
        }
      }
      teachings: {
        Row: {
          id: string
          title: string
          description: string
          type: 'video' | 'text_video' | 'text_photo' | 'text'
          video_url: string | null
          content: string | null
          images: Json | null
          is_premium: boolean
          category: string
          duration: string | null
          rating: number | null
          views: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'video' | 'text_video' | 'text_photo' | 'text'
          video_url?: string | null
          content?: string | null
          images?: Json | null
          is_premium?: boolean
          category: string
          duration?: string | null
          rating?: number | null
          views?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          type?: 'video' | 'text_video' | 'text_photo' | 'text'
          video_url?: string | null
          content?: string | null
          images?: Json | null
          is_premium?: boolean
          category?: string
          duration?: string | null
          rating?: number | null
          views?: number | null
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          item_id: string
          item_type: 'book' | 'teaching'
          amount: number
          status: 'completed' | 'pending' | 'failed'
          external_sale_id: string | null
          provider: 'internal' | 'chariow'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          item_type: 'book' | 'teaching'
          amount: number
          status?: 'completed' | 'pending' | 'failed'
          external_sale_id?: string | null
          provider?: 'internal' | 'chariow'
          created_at?: string
        }
        Update: {
          status?: 'completed' | 'pending' | 'failed'
          external_sale_id?: string | null
          provider?: 'internal' | 'chariow'
        }
      }
      payment_sessions: {
        Row: {
          id: string
          user_id: string
          provider: string
          status: 'pending' | 'redirected' | 'completed' | 'failed' | 'cancelled' | 'already_purchased'
          sale_id: string | null
          transaction_id: string | null
          item_id: string
          item_type: 'book' | 'teaching'
          item_title: string
          chariow_product_id: string
          amount: number
          currency: string
          customer_email: string
          customer_name: string
          phone_number: string
          phone_country_code: string
          checkout_url: string | null
          metadata: Json | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider?: string
          status?: 'pending' | 'redirected' | 'completed' | 'failed' | 'cancelled' | 'already_purchased'
          sale_id?: string | null
          transaction_id?: string | null
          item_id: string
          item_type: 'book' | 'teaching'
          item_title: string
          chariow_product_id: string
          amount: number
          currency?: string
          customer_email: string
          customer_name: string
          phone_number: string
          phone_country_code: string
          checkout_url?: string | null
          metadata?: Json | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          provider?: string
          status?: 'pending' | 'redirected' | 'completed' | 'failed' | 'cancelled' | 'already_purchased'
          sale_id?: string | null
          transaction_id?: string | null
          item_title?: string
          chariow_product_id?: string
          amount?: number
          currency?: string
          customer_email?: string
          customer_name?: string
          phone_number?: string
          phone_country_code?: string
          checkout_url?: string | null
          metadata?: Json | null
          error_message?: string | null
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string
          message: string
          is_admin_reply: boolean
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          is_admin_reply?: boolean
          read?: boolean
          created_at?: string
        }
        Update: {
          message?: string
          read?: boolean
        }
      }
      community_members: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          interests: string[]
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          interests?: string[]
          joined_at?: string
        }
        Update: {
          bio?: string | null
          interests?: string[]
        }
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
  }
}
