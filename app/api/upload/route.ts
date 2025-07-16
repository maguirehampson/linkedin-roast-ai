import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
// Removed: import getConfig from 'next/config';

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.log('Uploads directory already exists or could not be created');
    }

    // Save file locally
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    console.log('File uploaded successfully to:', filePath);

    // Return local file URL for testing
    const fileUrl = `/api/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      file_url: fileUrl,
      file_name: fileName
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 