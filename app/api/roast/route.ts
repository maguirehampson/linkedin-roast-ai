import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ROASTBOT_SYSTEM_PROMPT } from '@/ai/systemPrompt';

// Initialize OpenAI client at runtime
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
};

export async function POST(request: NextRequest) {
  try {
    const { goals, profileText, contextText } = await request.json();

    // Validate input
    if (!goals || !profileText) {
      return NextResponse.json(
        { error: 'Goals and profile text are required' },
        { status: 400 }
      );
    }

    // Get OpenAI client
    const openai = getOpenAIClient();

    const userPrompt = `User's Goals: "${goals}"

LinkedIn Profile Text: "${profileText}"

${contextText ? `Additional Context: "${contextText}"` : ''}

Analyze the LinkedIn profile text in the context of the user's goals. Apply the RoastBot Supreme methodology to deliver a savage but constructive roast.

Remember to return ONLY valid JSON with the exact structure specified in the system prompt.`;

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

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let roastData;
    try {
      roastData = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    const requiredFields = [
      'roast',
      'savage_score',
      'brutal_feedback',
      'constructive_path_forward',
      'hashtags_to_avoid',
      'top_skills_to_highlight',
      'vibe_tags',
      'share_quote',
      'meme_caption',
      'diagnostics'
    ];
    for (const field of requiredFields) {
      if (!(field in roastData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    // Type checks for arrays and diagnostics
    if (!Array.isArray(roastData.hashtags_to_avoid)) throw new Error('hashtags_to_avoid must be an array');
    if (!Array.isArray(roastData.top_skills_to_highlight)) throw new Error('top_skills_to_highlight must be an array');
    if (!Array.isArray(roastData.vibe_tags)) throw new Error('vibe_tags must be an array');
    if (!Array.isArray(roastData.diagnostics)) throw new Error('diagnostics must be an array');

    // Return the roast data without storing in database
    return NextResponse.json({
      ...roastData,
      id: Math.random().toString(36).substr(2, 9), // Generate a simple ID for testing
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in roast API:', error);
    return NextResponse.json(
      { error: 'Failed to generate roast. Please try again.' },
      { status: 500 }
    );
  }
} 