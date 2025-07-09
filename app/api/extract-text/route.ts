import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const { fileUrl } = await request.json();
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }

    // Download the file from Supabase Storage URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to download file from Supabase Storage');
    }

    const dataBuffer = await response.arrayBuffer();

    // Extract text from PDF
    const data = await pdf(Buffer.from(dataBuffer));
    
    // Clean up the extracted text
    const text = data.text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace multiple newlines with single space
      .trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: 'Could not extract meaningful text from the PDF' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      text: text,
      pages: data.numpages,
      info: data.info
    });

  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
} 