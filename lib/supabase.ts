import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase client for read-only operations
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types for TypeScript
export interface RoastResult {
  id: string;
  created_at: string;
  goals_text: string;
  profile_text: string;
  context_text?: string;
  roast_text: string;
  savage_score: string; // e.g., "65/100"
  brutal_feedback: string;
  constructive_path_forward: string;
  hashtags_to_avoid: string[];
  top_skills_to_highlight: string[];
  session_id: string;
  profile_pdf_url?: string;
  context_file_url?: string;
}

export interface EmailLead {
  id: string;
  created_at: string;
  email: string;
  roast_result_id?: string;
  wants_upgrade: boolean;
}

// Client-side database operations (read-only)
export const RoastDB = {
  async getById(id: string): Promise<RoastResult | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data, error } = await supabase
      .from('roasts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching roast:', error);
      return null;
    }

    return data;
  },

  async getAll(): Promise<RoastResult[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data, error } = await supabase
      .from('roasts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching roasts:', error);
      return [];
    }

    return data || [];
  }
};

// Note: EmailDB operations are server-side only for security
export const EmailDB = {
  // Client-side operations removed for security
  // All email operations go through API routes
}; 