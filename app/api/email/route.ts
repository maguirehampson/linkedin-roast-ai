import { NextRequest, NextResponse } from 'next/server';
import { EmailDB } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, roast_result_id, wants_upgrade } = await request.json();

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Store the email in Supabase using service role key
    const storedEmail = await EmailDB.create({
      email: email.toLowerCase().trim(),
      roast_result_id,
      wants_upgrade: wants_upgrade || false
    });

    return NextResponse.json({
      success: true,
      id: storedEmail.id
    });

  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
} 