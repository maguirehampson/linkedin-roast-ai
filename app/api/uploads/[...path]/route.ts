import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // This is a mock endpoint for test mode
  // In production, files are served directly from Supabase Storage
  
  if (process.env.TEST_MODE !== 'true') {
    return NextResponse.json(
      { error: 'File serving only available in test mode' },
      { status: 404 }
    );
  }

  const fileName = params.path.join('/');
  
  // Return a mock response for test mode
  return NextResponse.json({
    message: 'Test mode: File access simulated',
    fileName: fileName,
    note: 'In production, files are served from Supabase Storage'
  });
}