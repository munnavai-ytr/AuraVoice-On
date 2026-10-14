import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const apiKey =
      req.headers.get('xi-api-key') || process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { detail: 'No ElevenLabs API key found.' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${id}`, {
      headers: {
        'xi-api-key': apiKey,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching voice info';
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const apiKey =
      req.headers.get('xi-api-key') || process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { detail: 'No ElevenLabs API key found.' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${id}`, {
      method: 'DELETE',
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (response.status === 204 || response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting voice';
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
