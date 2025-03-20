import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { join } from 'path';

// Initialize Google Cloud Storage with key file
const storage = new Storage({
  keyFilename: join(process.cwd(), 'gcs-key.json'),
});

const bucketName = 'zkhauto_bucket';
const bucket = storage.bucket(bucketName);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create buffer from file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename with sanitization
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `cars/${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Create a blob in the bucket
    const blob = bucket.file(fileName);

    // Create a write stream
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.type,
      },
      resumable: false // Recommended for small files
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        console.error('Upload error:', error);
        resolve(NextResponse.json(
          { error: 'Failed to upload image: ' + error.message },
          { status: 500 }
        ));
      });

      blobStream.on('finish', async () => {
        // Generate public URL without setting ACLs
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        resolve(NextResponse.json({
          success: true,
          message: 'Upload successful',
          url: publicUrl
        }));
      });

      blobStream.end(buffer);
    });

  } catch (error) {
    console.error('Error in upload handler:', error);
    
    // Handle specific Google Cloud Storage errors
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Failed to connect to Google Cloud Storage. Please check your credentials.' },
        { status: 503 }
      );
    }
    
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { error: 'Bucket not found. Please check your bucket configuration.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
} 