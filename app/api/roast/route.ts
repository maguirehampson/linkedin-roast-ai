import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ROASTBOT_SYSTEM_PROMPT } from '@/ai/systemPrompt';
import { RoastDB } from '@/lib/supabase-server';

async function fetchLinkedinProfileText(linkedinUrlOrId: string): Promise<string> {
  // Extract LinkedIn ID if a URL is provided
  let linkId = linkedinUrlOrId;
  const urlMatch = linkedinUrlOrId.match(/linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)/i);
  if (urlMatch) {
    linkId = urlMatch[1];
  }
  const apiKey = process.env.SCRAPINGDOG_API_KEY;
  if (!apiKey) throw new Error('SCRAPINGDOG_API_KEY environment variable is not set');
  const params = new URLSearchParams({
    api_key: apiKey,
    type: 'profile',
    linkId,
  });
  const apiRes = await fetch(`https://api.scrapingdog.com/linkedin/?${params.toString()}`);
  if (!apiRes.ok) {
    throw new Error('Failed to fetch LinkedIn profile from ScrapingDog');
  }
  const data = await apiRes.json();
  // Try to extract a reasonable text representation from the returned JSON
  if (Array.isArray(data) && data.length > 0) {
    const profile = data[0];
    // Concatenate relevant fields for the roast
    let text = '';
    if (profile.fullName) text += `Name: ${profile.fullName}\n`;
    if (profile.headline) text += `Headline: ${profile.headline}\n`;
    if (profile.about) text += `About: ${profile.about}\n`;
    if (profile.experience && Array.isArray(profile.experience)) {
      text += 'Experience:\n';
      for (const exp of profile.experience) {
        text += `- ${exp.position} at ${exp.company_name} (${exp.starts_at} - ${exp.ends_at})\n`;
        if (exp.summary) text += `  ${exp.summary}\n`;
      }
    }
    if (profile.articles && Array.isArray(profile.articles)) {
      text += 'Articles:\n';
      for (const art of profile.articles) {
        text += `- ${art.title} (${art.published_date})\n`;
      }
    }
    if (profile.activities && Array.isArray(profile.activities)) {
      text += 'Recent Activities:\n';
      for (const act of profile.activities) {
        text += `- ${act.title}\n`;
      }
    }
    if (profile.skills && Array.isArray(profile.skills)) {
      text += 'Skills: ' + profile.skills.join(', ') + '\n';
    }
    return text.trim();
  }
  throw new Error('Invalid response from ScrapingDog API');
}

// Initialize OpenAI client at runtime
const getOpenAIClient = () => {
  let apiKey: string | undefined = process.env.OPENAI_API_KEY;
  console.log('Checking OpenAI API key:', apiKey ? 'Present' : 'Missing');
  console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
  
  // Temporary fallback for testing
  if (!apiKey) {
    console.log('Trying to read from .env.local file directly...');
    try {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log('Raw .env.local content:', envContent);
        const match = envContent.match(/OPENAI_API_KEY=(.+)/);
        if (match) {
          apiKey = match[1].trim();
          console.log('Found API key in .env.local file:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
        } else {
          console.log('No OPENAI_API_KEY found in .env.local file');
        }
      } else {
        console.log('.env.local file does not exist');
      }
    } catch (error) {
      console.log('Could not read .env.local file:', error);
    }
  }
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  // At this point, apiKey is guaranteed to be a string
  return new OpenAI({ apiKey: apiKey as string });
};

export async function POST(request: NextRequest) {
  try {
    console.log('Roast API called');
    const { goals, profileText, contextText, linkedinUrl, linkedinId } = await request.json();

    let effectiveProfileText = profileText;
    if (!effectiveProfileText && (linkedinUrl || linkedinId)) {
      // Fetch from ScrapingDog
      const idOrUrl = linkedinId || linkedinUrl;
      if (!idOrUrl) {
        return NextResponse.json(
          { error: 'LinkedIn URL or ID is required if no profileText is provided' },
          { status: 400 }
        );
      }
      try {
        effectiveProfileText = await fetchLinkedinProfileText(idOrUrl);
      } catch (err) {
        console.error('Error fetching LinkedIn profile:', err);
        return NextResponse.json(
          { error: 'Failed to fetch LinkedIn profile: ' + (err instanceof Error ? err.message : String(err)) },
          { status: 500 }
        );
      }
    }

    console.log('Request data:', { goals: goals?.substring(0, 50), profileText: effectiveProfileText?.substring(0, 50) });

    // Validate input
    if (!goals || !effectiveProfileText) {
      console.error('Missing required fields:', { goals: !!goals, profileText: !!effectiveProfileText });
      return NextResponse.json(
        { error: 'Goals and profile text are required' },
        { status: 400 }
      );
    }

    // Get OpenAI client
    console.log('Initializing OpenAI client...');
    const openai = getOpenAIClient();
    console.log('OpenAI client initialized successfully');

    const userPrompt = `User's Goals: "${goals}"

LinkedIn Profile Text: "${effectiveProfileText}"

${contextText ? `Additional Context: "${contextText}"` : ''}

Analyze the LinkedIn profile text in the context of the user's goals. Apply the RoastBot Supreme methodology to deliver a savage but constructive roast.

Remember to return ONLY valid JSON with the exact structure specified in the system prompt.`;

    console.log('Calling OpenAI API...');
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: ROASTBOT_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
      temperature: 0.8, // Add some creativity to the roasts
    });

    console.log('OpenAI API response received');
    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      console.error('No response text from OpenAI');
      throw new Error('No response from OpenAI');
    }

    console.log('Parsing OpenAI response...');
    // Parse the JSON response
    let roastData;
    try {
      roastData = JSON.parse(responseText);
      console.log('JSON parsed successfully');
    } catch (error) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    const requiredFields = [
      'roast',
      'savage_score',
      'score_breakdown',
      'brutal_feedback',
      'constructive_path_forward',
      'hashtags_to_avoid',
      'top_skills_to_highlight',
      'vibe_tags',
      'share_quote',
      'meme_caption',
      'diagnostics'
    ];
    
    console.log('Validating response fields...');
    for (const field of requiredFields) {
      if (!(field in roastData)) {
        console.error(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Type checks for arrays and diagnostics
    if (!Array.isArray(roastData.hashtags_to_avoid)) throw new Error('hashtags_to_avoid must be an array');
    if (!Array.isArray(roastData.top_skills_to_highlight)) throw new Error('top_skills_to_highlight must be an array');
    if (!Array.isArray(roastData.vibe_tags)) throw new Error('vibe_tags must be an array');
    if (!Array.isArray(roastData.diagnostics)) throw new Error('diagnostics must be an array');
    
    // Validate score_breakdown structure
    if (roastData.score_breakdown) {
      const scoreCategories = ['clarity', 'specificity', 'authenticity', 'professionalism', 'impact'];
      for (const category of scoreCategories) {
        if (!(category in roastData.score_breakdown)) {
          throw new Error(`Missing score category: ${category}`);
        }
        const score = roastData.score_breakdown[category];
        if (typeof score !== 'number' || score < 0 || score > 20) {
          throw new Error(`Invalid score for ${category}: must be number between 0-20`);
        }
      }
    }

    console.log('All validations passed, storing in database...');
    
    // Generate session ID
    const sessionId = Math.random().toString(36).substring(2, 11);
    
    // Store in database (skip in test mode)
    let storedRoast = null;
    if (process.env.TEST_MODE !== 'true') {
      try {
        storedRoast = await RoastDB.create({
          goals_text: goals,
          profile_text: effectiveProfileText,
          context_text: contextText || undefined,
          roast_text: roastData.roast,
          savage_score: `${roastData.savage_score}/100`,
          brutal_feedback: roastData.brutal_feedback,
          constructive_path_forward: roastData.constructive_path_forward,
          hashtags_to_avoid: roastData.hashtags_to_avoid,
          top_skills_to_highlight: roastData.top_skills_to_highlight,
          session_id: sessionId,
          profile_pdf_url: undefined, // Will be set by frontend if needed
          context_file_url: undefined, // Will be set by frontend if needed
          vibe_tags: roastData.vibe_tags,
          share_quote: roastData.share_quote,
          meme_caption: roastData.meme_caption,
          diagnostics: roastData.diagnostics,
          roast_output: roastData // Store full AI response as JSONB
        });
        console.log('Roast stored in database successfully');
      } catch (dbError) {
        console.error('Database storage failed:', dbError);
        // Continue without failing the request - return the roast even if DB fails
      }
    }

    return NextResponse.json({
      ...roastData,
      id: storedRoast?.id || sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in roast API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate roast: ${errorMessage}` },
      { status: 500 }
    );
  }
} 