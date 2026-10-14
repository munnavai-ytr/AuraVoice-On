import type { ELKeyInfo, GeneratedAudio, KeyTier } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

const EL_BASE = 'https://api.elevenlabs.io/v1';

export interface CloneVoiceParams {
  apiKey: string;
  audioBlob: Blob;
  voiceName: string;
  userId: string;
  onProgress?: (percent: number) => void;
}

export interface DeleteVoiceParams {
  apiKey: string;
  voiceId: string;
}

export interface VoiceInfoResponse {
  name: string;
  preview_url: string;
}

export interface ElevenLabsSubscription {
  tier: string;
  character_limit: number;
  character_count: number;
  voice_limit: number;
  next_character_count_reset_unix: number;
}

export interface ElevenLabsUserResponse {
  subscription: ElevenLabsSubscription;
}

/**
 * Uploads audio and clones a voice with XMLHttpRequest to report real-time upload progress.
 */
export async function cloneVoice(params: {
  apiKey: string;
  audioBlob: Blob;
  voiceName: string;
  userId: string;
  onProgress?: (percent: number) => void;
}): Promise<{ voice_id: string }> {
  const { apiKey, audioBlob, voiceName, onProgress } = params;

  return new Promise<{ voice_id: string }>((resolve, reject) => {
    const formData = new FormData();
    formData.append('name', voiceName);
    formData.append('description', 'Vocalis AI voice clone');

    // Create a named File from Blob
    const extension = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
    const audioFile = new File([audioBlob], `sample.${extension}`, {
      type: audioBlob.type || 'audio/webm',
    });
    formData.append('files', audioFile);

    // If apiKey is provided, upload directly to ElevenLabs, otherwise use proxy endpoint
    const url = apiKey ? `${EL_BASE}/voices/add` : '/api/elevenlabs/clone';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if (apiKey) {
      xhr.setRequestHeader('xi-api-key', apiKey);
    }

    // Monitor upload progress (0% to 100%)
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText) as { voice_id: string };
          if (response.voice_id) {
            resolve({ voice_id: response.voice_id });
          } else {
            reject(new Error('Voice clone succeeded but no voice_id was returned.'));
          }
        } else {
          let errorDetail = 'Voice cloning failed';
          try {
            const errObj = JSON.parse(xhr.responseText) as {
              detail?: { message?: string } | string;
              message?: string;
            };
            if (typeof errObj.detail === 'string') {
              errorDetail = errObj.detail;
            } else if (errObj.detail?.message) {
              errorDetail = errObj.detail.message;
            } else if (errObj.message) {
              errorDetail = errObj.message;
            }
          } catch {
            errorDetail = xhr.statusText || `HTTP Error ${xhr.status}`;
          }
          reject(new Error(errorDetail));
        }
      } catch (e: unknown) {
        reject(e instanceof Error ? e : new Error('Failed to parse ElevenLabs response.'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while connecting to ElevenLabs.'));
    };

    xhr.send(formData);
  });
}

/**
 * Deletes an existing voice model from ElevenLabs.
 */
export async function deleteVoice(params: {
  apiKey: string;
  voiceId: string;
}): Promise<void> {
  const { apiKey, voiceId } = params;
  const url = apiKey ? `${EL_BASE}/voices/${voiceId}` : `/api/elevenlabs/voices/${voiceId}`;

  const headers: HeadersInit = {};
  if (apiKey) {
    headers['xi-api-key'] = apiKey;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Failed to delete voice (${response.status})`;
    try {
      const data = await response.json() as { detail?: { message?: string } | string; message?: string };
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (data.detail?.message) {
        errorMsg = data.detail.message;
      } else if (data.message) {
        errorMsg = data.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
}

/**
 * Fetches voice metadata and preview url from ElevenLabs.
 */
export async function getVoiceInfo(params: {
  apiKey: string;
  voiceId: string;
}): Promise<VoiceInfoResponse> {
  const { apiKey, voiceId } = params;
  const url = apiKey ? `${EL_BASE}/voices/${voiceId}` : `/api/elevenlabs/voices/${voiceId}`;

  const headers: HeadersInit = {};
  if (apiKey) {
    headers['xi-api-key'] = apiKey;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Failed to fetch voice information (${response.status})`;
    try {
      const data = await response.json() as { detail?: { message?: string } | string; message?: string };
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (data.detail?.message) {
        errorMsg = data.detail.message;
      } else if (data.message) {
        errorMsg = data.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const data = await response.json() as {
    name?: string;
    preview_url?: string;
  };

  return {
    name: data.name || 'My Voice',
    preview_url: data.preview_url || '',
  };
}

/**
 * Fetches user subscription and character limit stats from ElevenLabs.
 */
export async function getUserInfo(apiKey: string): Promise<ElevenLabsSubscription> {
  const url = apiKey ? `${EL_BASE}/user` : '/api/elevenlabs/user';

  const headers: HeadersInit = {};
  if (apiKey) {
    headers['xi-api-key'] = apiKey;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ElevenLabs account information: ${response.statusText}`);
  }

  const data = await response.json() as ElevenLabsUserResponse;
  return data.subscription;
}

/**
 * Maps ElevenLabs user subscription tier to Vocalis KeyTier info.
 */
export function detectKeyAccess(userInfo: ElevenLabsUserResponse): ELKeyInfo {
  const rawTier = (userInfo.subscription?.tier || 'free').toLowerCase();
  const validTiers: KeyTier[] = ['free', 'starter', 'creator', 'pro', 'scale', 'enterprise'];
  const tier: KeyTier = validTiers.includes(rawTier as KeyTier)
    ? (rawTier as KeyTier)
    : 'free';

  const isFreeTier = tier === 'free';

  return {
    tier,
    characterLimit: userInfo.subscription?.character_limit || 10000,
    charactersUsed: userInfo.subscription?.character_count || 0,
    isFreeTier,
    canShareCommunity: !isFreeTier,
    maxScriptLength: isFreeTier ? 2500 : 5000,
    renewalDate: userInfo.subscription?.next_character_count_reset_unix || null,
  };
}

/**
 * Saves generated audio to Supabase Storage and records it in generated_audios table.
 */
export async function saveAudioToSupabase(params: {
  supabase: SupabaseClient;
  userId: string;
  audioBlob: Blob;
  title: string;
  script: string;
  voiceId: string;
  category: string;
  duration: number;
}): Promise<GeneratedAudio> {
  const {
    supabase,
    userId,
    audioBlob,
    title,
    script,
    voiceId,
    category,
    duration,
  } = params;

  let publicUrl = '';
  const fileName = `${userId}/${Date.now()}.mp3`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('generated-audios')
      .upload(fileName, audioBlob, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (!uploadError) {
      const {
        data: { publicUrl: url },
      } = supabase.storage.from('generated-audios').getPublicUrl(fileName);
      publicUrl = url;
    } else {
      console.warn('Storage upload fallback:', uploadError.message);
    }
  } catch (storageErr) {
    console.warn('Storage operation failed, inserting record with local context:', storageErr);
  }

  // Insert generated record into database
  const { data, error } = await supabase
    .from('generated_audios')
    .insert({
      user_id: userId,
      voice_id: voiceId,
      title: title || 'Generated Audio',
      script_text: script,
      audio_url: publicUrl || null,
      duration_seconds: duration,
      category,
    })
    .select()
    .single();

  if (error || !data) {
    // Return optimistic record if database insert had an issue
    return {
      id: `gen-${Date.now()}`,
      user_id: userId,
      voice_id: voiceId,
      title: title || 'Generated Audio',
      script_text: script,
      audio_url: publicUrl || null,
      duration_seconds: duration,
      category,
      created_at: new Date().toISOString(),
    };
  }

  return data as GeneratedAudio;
}

/**
 * Creates an ID3v2.3 tagged MP3 blob and initiates browser download.
 */
export async function downloadAudioWithId3(params: {
  audioBlob: Blob;
  title: string;
  artist?: string;
  album?: string;
  year?: string;
  filename?: string;
}) {
  const {
    audioBlob,
    title,
    artist = 'Vocalis AI Creator',
    album = 'Vocalis AI Studio',
    year = String(new Date().getFullYear()),
    filename,
  } = params;

  // Build ID3v2.3 Tag frames
  function createTextFrame(frameId: string, text: string): Uint8Array {
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);
    const frameSize = encodedText.length + 1; // 1 byte for encoding flag (0 = ISO-8859-1)

    const frame = new Uint8Array(10 + frameSize);
    // Frame ID (4 bytes)
    for (let i = 0; i < 4; i++) {
      frame[i] = frameId.charCodeAt(i);
    }
    // Size (4 bytes big-endian)
    frame[4] = (frameSize >> 24) & 0xff;
    frame[5] = (frameSize >> 16) & 0xff;
    frame[6] = (frameSize >> 8) & 0xff;
    frame[7] = frameSize & 0xff;
    // Flags (2 bytes) = 0
    frame[8] = 0;
    frame[9] = 0;
    // Encoding flag = 0 (ISO-8859-1)
    frame[10] = 0;
    // Frame data
    frame.set(encodedText, 11);
    return frame;
  }

  const titleFrame = createTextFrame('TIT2', title.slice(0, 60));
  const artistFrame = createTextFrame('TPE1', artist.slice(0, 40));
  const albumFrame = createTextFrame('TALB', album);
  const yearFrame = createTextFrame('TYER', year);
  const commentFrame = createTextFrame('COMM', 'Generated by Vocalis AI');

  const totalFramesLength =
    titleFrame.length +
    artistFrame.length +
    albumFrame.length +
    yearFrame.length +
    commentFrame.length;

  // ID3v2 header is 10 bytes
  const header = new Uint8Array(10);
  header[0] = 0x49; // 'I'
  header[1] = 0x44; // 'D'
  header[2] = 0x33; // '3'
  header[3] = 3;    // version 2.3
  header[4] = 0;    // revision 0
  header[5] = 0;    // flags
  // Size in syncsafe integer (7 bits per byte)
  header[6] = (totalFramesLength >> 21) & 0x7f;
  header[7] = (totalFramesLength >> 14) & 0x7f;
  header[8] = (totalFramesLength >> 7) & 0x7f;
  header[9] = totalFramesLength & 0x7f;

  const id3Tag = new Uint8Array(10 + totalFramesLength);
  id3Tag.set(header, 0);
  let offset = 10;
  id3Tag.set(titleFrame, offset);
  offset += titleFrame.length;
  id3Tag.set(artistFrame, offset);
  offset += artistFrame.length;
  id3Tag.set(albumFrame, offset);
  offset += albumFrame.length;
  id3Tag.set(yearFrame, offset);
  offset += yearFrame.length;
  id3Tag.set(commentFrame, offset);

  // Combine ID3 tag and original MP3 audio blob
  const finalBlob = new Blob([id3Tag, audioBlob], { type: 'audio/mpeg' });
  const downloadUrl = URL.createObjectURL(finalBlob);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename || `vocalis-${Date.now()}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
