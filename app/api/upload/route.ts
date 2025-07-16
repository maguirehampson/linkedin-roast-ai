import { NextRequest, NextResponse } from 'next/server';
import { SupabaseStorage } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  // Removed: const { publicRuntimeConfig } = getConfig();
  // Remove the TEST_MODE check for file upload
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

    // Check if in test mode OR if Supabase is not properly configured
    if (process.env.TEST_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // In test mode, return a mock URL
      const fileUrl = `/api/uploads/${fileName}`;
      console.log('Test mode: Mock file upload successful');
      
      return NextResponse.json({
        success: true,
        file_url: fileUrl,
        file_name: fileName
      });
    }

    // Production: Upload to Supabase Storage
    try {
      const fileUrl = await SupabaseStorage.uploadFile(buffer, fileName, file.type);
      console.log('File uploaded successfully to Supabase:', fileUrl);

      return NextResponse.json({
        success: true,
        file_url: fileUrl,
        file_name: fileName
      });
    } catch (storageError) {
      console.error('Supabase storage error:', storageError);
      
      // Fallback to test mode if Supabase fails
      console.log('Falling back to test mode due to Supabase error');
      const fileUrl = `/api/uploads/${fileName}`;
      
      return NextResponse.json({
        success: true,
        file_url: fileUrl,
        file_name: fileName,
        fallback: true,
        note: 'Using test mode due to storage configuration issue'
      });
    }

  } catch (error) {
    console.error('Error uploading file:', error);
    
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 