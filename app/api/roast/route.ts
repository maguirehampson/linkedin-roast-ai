import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ROASTBOT_SYSTEM_PROMPT } from '@/ai/systemPrompt';

// Initialize OpenAI client at runtime
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('Checking OpenAI API key:', apiKey ? 'Present' : 'Missing');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
};

export async function POST(request: NextRequest) {
  try {
    console.log('Roast API called');
    const { goals, profileText, contextText } = await request.json();

    console.log('Request data:', { goals: goals?.substring(0, 50), profileText: profileText?.substring(0, 50) });

    // Validate input
    if (!goals || !profileText) {
      console.error('Missing required fields:', { goals: !!goals, profileText: !!profileText });
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

LinkedIn Profile Text: "${profileText}"

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

    console.log('All validations passed, returning response');
    // Return the roast data without storing in database
    return NextResponse.json({
      ...roastData,
      id: Math.random().toString(36).substr(2, 9), // Generate a simple ID for testing
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