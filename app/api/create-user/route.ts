import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { clientName, contactType, contactInfo } = await request.json();

    if (!clientName || !contactType || !contactInfo) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Example: Generate a unique link
    const generatedLink = `http://localhost:3000/questionare/${encodeURIComponent(clientName)}-${Date.now()}`;

    return NextResponse.json({ link: generatedLink }, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}