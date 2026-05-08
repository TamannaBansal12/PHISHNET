import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const backendUrl = `${baseUrl}/py-api/audio/analyze`;

    // Forward the exact FormData from the client to the FastAPI backend
    const formData = await request.formData();
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: formData, // fetch natively supports FormData, no need to set Content-Type header manually
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Backend error: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
