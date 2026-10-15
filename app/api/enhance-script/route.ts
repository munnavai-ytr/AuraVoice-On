import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { script, category, tone } = await req.json();

    if (!script?.trim()) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert voice-over script writer. Enhance the following script for ${category || 'general'} content with a ${tone || 'engaging'} tone.

Rules:
- Keep the same message and meaning
- Add natural pauses using "..." where appropriate  
- Make it more engaging and conversational
- Add emotion cues in [brackets] like [excited], [pause], [whisper] where it improves delivery
- Keep it the same length or slightly shorter
- Return ONLY the enhanced script, nothing else

Original Script:
${script}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const enhanced = response.text?.trim();
    if (!enhanced) throw new Error('Empty response from Gemini');

    return NextResponse.json({ enhanced });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Enhancement failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
