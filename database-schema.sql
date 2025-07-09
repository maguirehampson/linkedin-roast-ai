-- LinkedIn Roast AI Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roasts table
CREATE TABLE IF NOT EXISTS roasts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    goals_text TEXT NOT NULL,
    profile_text TEXT NOT NULL,
    context_text TEXT,
    roast_text TEXT NOT NULL,
    savage_score VARCHAR(10) NOT NULL, -- e.g., "65/100"
    brutal_feedback TEXT NOT NULL,
    constructive_path_forward TEXT NOT NULL,
    hashtags_to_avoid TEXT[] NOT NULL,
    top_skills_to_highlight TEXT[] NOT NULL,
    session_id TEXT NOT NULL,
    profile_pdf_url TEXT,
    context_file_url TEXT
);

-- Emails table
CREATE TABLE IF NOT EXISTS emails (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL UNIQUE,
    roast_result_id UUID REFERENCES roasts(id) ON DELETE SET NULL,
    wants_upgrade BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roasts_created_at ON roasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roasts_session_id ON roasts(session_id);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_roast_result_id ON emails(roast_result_id);

-- Enable Row Level Security (RLS)
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access
-- Note: In production, you might want more restrictive policies
CREATE POLICY "Allow public read access to roasts" ON roasts
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to roasts" ON roasts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to emails" ON emails
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to emails" ON emails
    FOR INSERT WITH CHECK (true);

-- Create a function to get roast statistics
CREATE OR REPLACE FUNCTION get_roast_stats()
RETURNS TABLE (
    total_roasts BIGINT,
    avg_score NUMERIC,
    total_emails BIGINT,
    top_hashtags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_roasts,
        ROUND(AVG(CAST(SPLIT_PART(savage_score, '/', 1) AS NUMERIC)), 2) as avg_score,
        (SELECT COUNT(*) FROM emails) as total_emails,
        ARRAY(
            SELECT DISTINCT unnest(hashtags_to_avoid) 
            FROM roasts 
            GROUP BY unnest(hashtags_to_avoid) 
            ORDER BY COUNT(*) DESC 
            LIMIT 5
        ) as top_hashtags
    FROM roasts;
END;
$$ LANGUAGE plpgsql; 