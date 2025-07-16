import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { readFile } from 'fs/promises';
import { join } from 'path';
// Removed: import getConfig from 'next/config';

export async function POST(request: NextRequest) {
  // Removed: const { publicRuntimeConfig } = getConfig();
  // Remove the TEST_MODE check for extract-text
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

    // Extract filename from the URL
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      return NextResponse.json(
        { error: 'Invalid file URL' },
        { status: 400 }
      );
    }

    // Read file from local uploads directory
    const uploadsDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadsDir, fileName);
    
    console.log('Attempting to read file from:', filePath);
    
    let dataBuffer: Buffer;
    try {
      dataBuffer = await readFile(filePath);
    } catch (error) {
      console.error('Failed to read file:', error);
      return NextResponse.json(
        { error: 'File not found. Please upload again.' },
        { status: 404 }
      );
    }

    console.log('File read successfully. Size:', dataBuffer.length);

    // Extract text from PDF
    const data = await pdf(dataBuffer);
    
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
    
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
} 