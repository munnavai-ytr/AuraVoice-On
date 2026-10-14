import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const apiKey =
      req.headers.get('xi-api-key') || process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          detail:
            'No ElevenLabs API key found. Please provide an ElevenLabs API key in settings or server configuration.',
        },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error during clone';
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
