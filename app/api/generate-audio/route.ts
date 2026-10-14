import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      voiceId,
      script,
      stability = 0.35,
      similarity = 0.75,
      style = 0.0,
      modelId = 'eleven_turbo_v2_5',
    } = body;

    if (!voiceId) {
      return NextResponse.json(
        { message: 'A voice ID is required to generate audio.' },
        { status: 400 }
      );
    }

    if (!script || typeof script !== 'string' || !script.trim()) {
      return NextResponse.json(
        { message: 'Script text cannot be empty.' },
        { status: 400 }
      );
    }

    // Try to get authenticated user and custom API key from Supabase
    let apiKey: string | null = null;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('custom_api_key')
          .eq('id', user.id)
          .single();

        if (profile?.custom_api_key) {
          apiKey = profile.custom_api_key;
        }
      }
    } catch {
      // Supabase lookup optional fallback
    }

    // Fall back to server environment variable
    if (!apiKey) {
      apiKey = process.env.ELEVENLABS_API_KEY || null;
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            'No ElevenLabs API key found. Please add your ElevenLabs API key in Settings.',
          code: 'no_api_key',
        },
        { status: 400 }
      );
    }

    // Call ElevenLabs streaming text-to-speech
    const elResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: script.trim(),
          model_id: modelId,
          voice_settings: {
            stability: Number(stability),
            similarity_boost: Number(similarity),
            style: Number(style),
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elResponse.ok) {
      let errorMessage = 'ElevenLabs generation failed.';
      let errorCode = 'unknown';

      try {
        const errJson = (await elResponse.json()) as {
          detail?: { status?: string; message?: string } | string;
          message?: string;
        };

        if (typeof errJson.detail === 'string') {
          errorMessage = errJson.detail;
        } else if (errJson.detail?.message) {
          errorMessage = errJson.detail.message;
          errorCode = errJson.detail.status || 'el_error';
        } else if (errJson.message) {
          errorMessage = errJson.message;
        }

        if (errorMessage.toLowerCase().includes('quota') || elResponse.status === 401) {
          errorCode = 'quota_exceeded';
        } else if (errorMessage.toLowerCase().includes('voice') && elResponse.status === 404) {
          errorCode = 'voice_not_found';
        } else if (errorMessage.toLowerCase().includes('key') || elResponse.status === 403) {
          errorCode = 'invalid_api_key';
        }
      } catch {
        errorMessage = `ElevenLabs error (${elResponse.status}): ${elResponse.statusText}`;
      }

      return NextResponse.json(
        { message: errorMessage, code: errorCode },
        { status: elResponse.status }
      );
    }

    if (!elResponse.body) {
      return NextResponse.json(
        { message: 'Empty audio stream returned from ElevenLabs.' },
        { status: 502 }
      );
    }

    // Return the audio stream directly to the client
    return new Response(elResponse.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Internal audio generation error';
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
