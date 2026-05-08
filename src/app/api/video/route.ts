import { NextRequest, NextResponse } from 'next/server';

// Disable Next.js body parsing — we stream the raw request directly to the backend
export const config = {
  api: {
    bodyParser: false,
  },
};

// Increase route segment timeout for large video uploads (Vercel: max 300s on Pro)
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const backendUrl = `${baseUrl}/py-api/video/analyze`;

    // Stream the multipart body directly to the backend — no in-memory buffering
    const contentType = request.headers.get('content-type') || '';

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        // Forward the multipart boundary so the backend can parse it correctly
        'content-type': contentType,
      },
      body: request.body,
      // Required to actually stream the body rather than buffering it
      duplex: 'half',
    } as RequestInit & { duplex: string });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Backend error: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[video/route] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
