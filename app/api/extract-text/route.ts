import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

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

    // Handle test mode vs production
    let dataBuffer: Buffer;
    
    if (process.env.TEST_MODE === 'true') {
      // Test mode: Return mock extracted text
      console.log('Test mode: Returning mock PDF text extraction');
      
      const mockText = `John Doe
Senior Software Engineer at TechCorp
San Francisco, CA | john.doe@email.com | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing scalable web applications. 
Passionate about clean code, team collaboration, and delivering high-quality solutions.

EXPERIENCE
Senior Software Engineer | TechCorp | 2021 - Present
• Led development of microservices architecture serving 1M+ users
• Improved application performance by 40% through optimization
• Mentored 3 junior developers and established code review processes

Software Engineer | StartupXYZ | 2019 - 2021  
• Built full-stack applications using React, Node.js, and PostgreSQL
• Collaborated with product team to deliver features on tight deadlines
• Implemented automated testing reducing bugs by 60%

SKILLS
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, AWS, Docker

EDUCATION
Bachelor of Science in Computer Science | University of California | 2019`;

      return NextResponse.json({
        success: true,
        text: mockText,
        pages: 1,
        info: { Title: 'Mock LinkedIn Profile' }
      });
    }

    // Production mode: Fetch file from Supabase Storage and extract text
    try {
      console.log('Production mode: Fetching file from URL:', fileUrl);
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      dataBuffer = Buffer.from(arrayBuffer);
      
      console.log('File fetched successfully. Size:', dataBuffer.length);
    } catch (error) {
      console.error('Failed to fetch file from URL:', error);
      return NextResponse.json(
        { error: 'Could not access uploaded file. Please try uploading again.' },
        { status: 404 }
      );
    }

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