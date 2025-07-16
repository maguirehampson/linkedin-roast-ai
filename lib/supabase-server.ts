import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key for privileged operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only create client if environment variables are available
const supabaseServer = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
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
  vibe_tags: string[];
  share_quote: string;
  meme_caption: string;
  diagnostics: any[];
  roast_output: any; // Full AI response as JSONB for production analysis
}

export interface EmailLead {
  id: string;
  created_at: string;
  email: string;
  roast_result_id?: string;
  wants_upgrade: boolean;
}

function ensureNotTestMode() {
  if (process.env.TEST_MODE === 'true') {
    throw new Error('Database/storage/email features are paused in Test Mode.');
  }
}

// Supabase Storage operations
export const SupabaseStorage = {
  async uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
    ensureNotTestMode();
    if (!supabaseServer) {
      console.error('Supabase client not initialized. Environment variables:', {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    console.log('Attempting to upload to Supabase Storage:', {
      fileName,
      contentType,
      fileSize: file.length,
      bucket: 'roast-pdfs'
    });

    // First, check if bucket exists
    const { data: buckets, error: bucketError } = await supabaseServer.storage.listBuckets();
    if (bucketError) {
      console.error('Error listing buckets:', bucketError);
    } else {
      console.log('Available buckets:', buckets?.map(b => b.name));
    }

    const { data, error } = await supabaseServer.storage
      .from('roast-pdfs')
      .upload(fileName, file, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Detailed Supabase Storage error:', {
        error,
        message: error.message,
        fileName,
        contentType
      });
      throw new Error(`Failed to upload file to Supabase Storage: ${error.message}`);
    }

    console.log('File uploaded successfully:', data);

    // Get the public URL
    const { data: urlData } = supabaseServer.storage
      .from('roast-pdfs')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  },

  async getFileUrl(fileName: string): Promise<string> {
    ensureNotTestMode();
    if (!supabaseServer) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data } = supabaseServer.storage
      .from('roast-pdfs')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteFile(fileName: string): Promise<void> {
    ensureNotTestMode();
    if (!supabaseServer) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { error } = await supabaseServer.storage
      .from('roast-pdfs')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting from Supabase Storage:', error);
      throw new Error('Failed to delete file from Supabase Storage');
    }
  }
};

// Secure database operations using service role key
export const RoastDB = {
  async create(roastData: Omit<RoastResult, 'id' | 'created_at'>): Promise<RoastResult> {
    ensureNotTestMode();
    if (!supabaseServer) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data, error } = await supabaseServer
      .from('roasts')
      .insert([roastData])
      .select()
      .single();

    if (error) {
      console.error('Error creating roast:', error);
      throw new Error('Failed to create roast');
    }

    return data;
  },

  async getById(id: string): Promise<RoastResult | null> {
    ensureNotTestMode();
    if (!supabaseServer) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data, error } = await supabaseServer
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
    ensureNotTestMode();
    if (!supabaseServer) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data, error } = await supabaseServer
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

export const EmailDB = {
  async create(emailData: Omit<EmailLead, 'id' | 'created_at'>): Promise<EmailLead> {
    ensureNotTestMode();
    if (!supabaseServer) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data, error } = await supabaseServer
      .from('emails')
      .insert([emailData])
      .select()
      .single();

    if (error) {
      console.error('Error creating email:', error);
      throw new Error('Failed to create email');
    }

    return data;
  },

  async getAll(): Promise<EmailLead[]> {
    ensureNotTestMode();
    if (!supabaseServer) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    const { data, error } = await supabaseServer
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emails:', error);
      return [];
    }

    return data || [];
  }
}; 