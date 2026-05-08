import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Determine the backend URL based on environment.
    // In production (Vercel), it maps to the same host under /py-api/
    // In development, you might be running uvicorn locally on port 8000
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const backendUrl = `${baseUrl}/py-api/email/analyze`;

    // Fast-path internal fetch if deployed together or explicit external fetch
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: body.content,
        is_eml_file: body.is_eml_file || false
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Backend error: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
