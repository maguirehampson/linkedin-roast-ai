import { NextRequest, NextResponse } from 'next/server';
import { SupabaseStorage } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or Word documents only.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Attempting to upload file:', fileName, 'Size:', buffer.length, 'Type:', file.type);

    // Upload to Supabase Storage
    const fileUrl = await SupabaseStorage.uploadFile(buffer, fileName, file.type);
    
    console.log('File uploaded successfully:', fileUrl);

    return NextResponse.json({
      success: true,
      file_url: fileUrl,
      file_name: fileName
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Supabase client not initialized')) {
        return NextResponse.json(
          { error: 'Storage service not configured. Please check environment variables.' },
          { status: 500 }
        );
      }
      if (error.message.includes('Failed to upload file to Supabase Storage')) {
        return NextResponse.json(
          { error: 'Failed to upload file to storage. Please try again.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 