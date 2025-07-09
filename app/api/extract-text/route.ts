import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const { fileUrl } = await request.json();
    
    console.log('Extract text request received with fileUrl:', fileUrl);
    
    if (!fileUrl) {
      console.error('No fileUrl provided in request');
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }

    // Download the file from Supabase Storage URL
    console.log('Attempting to download file from:', fileUrl);
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      console.error('Failed to download file. Status:', response.status, 'StatusText:', response.statusText);
      throw new Error(`Failed to download file from Supabase Storage. Status: ${response.status}`);
    }

    const dataBuffer = await response.arrayBuffer();
    console.log('File downloaded successfully. Size:', dataBuffer.byteLength);

    // Extract text from PDF
    const data = await pdf(Buffer.from(dataBuffer));
    
    // Clean up the extracted text
    const text = data.text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace multiple newlines with single space
      .trim();

    console.log('Text extracted successfully. Length:', text.length, 'Pages:', data.numpages);

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
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to download file')) {
        return NextResponse.json(
          { error: 'Failed to download file from storage. Please try uploading again.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
} 