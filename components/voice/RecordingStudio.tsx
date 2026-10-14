'use client';

import * as React from 'react';
import { Mic, Square, RotateCcw, UploadCloud, AlertCircle } from 'lucide-react';
import { RecordingScript } from './RecordingScript';
import { VolumeMeter } from './VolumeMeter';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RecordingStudioProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel?: () => void;
}

export function RecordingStudio({ onRecordingComplete, onCancel }: RecordingStudioProps) {
  const {
    isRecording,
    audioLevel,
    duration,
    error,
    hasPermission,
    requestPermission,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const [minimumNotice, setMinimumNotice] = React.useState<string | null>(null);

  // Format MM:SS
  const minutes = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (duration % 60).toString().padStart(2, '0');

  // Timer color changes: 0-30s: #8899B4, 30-60s: #F59E0B, 60s+: #10B981
  const timerColor =
    duration < 30 ? '#8899B4' : duration < 60 ? '#F59E0B' : '#10B981';

  // Toggle or start mic
  const handleMicClick = async () => {
    setMinimumNotice(null);

    if (!isRecording) {
      await startRecording();
    } else {
      if (duration < 30) {
        setMinimumNotice(
          `Please record for at least 30 seconds (current: ${duration}s) to ensure high-fidelity voice cloning.`
        );
        return;
      }
      try {
        const blob = await stopRecording();
        onRecordingComplete(blob);
      } catch (err) {
        console.error('Stop recording failed:', err);
      }
    }
  };

  const handleStopAndUpload = async () => {
    try {
      const blob = await stopRecording();
      onRecordingComplete(blob);
    } catch (err) {
      console.error('Stop and upload failed:', err);
    }
  };

  const handleRerecord = () => {
    setMinimumNotice(null);
    resetRecording();
  };

  // If microphone permission is explicitly denied
  if (hasPermission === false || (error && !isRecording && duration === 0)) {
    return (
      <div className="w-full max-w-[540px] mx-auto p-6 sm:p-8 rounded-2xl bg-[#0D1117] border border-[#1E293B] text-center my-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
        </div>
        <h2 className="text-xl font-bold text-[#F0F4FF] mb-2">Microphone Access Required</h2>
        <p className="text-sm text-[#8899B4] mb-6 leading-relaxed">
          {error ||
            'Vocalis AI needs permission to record your microphone in order to clone your voice model.'}
        </p>

        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 text-left text-xs text-[#8899B4] mb-6 space-y-2">
          <p className="font-semibold text-[#F0F4FF]">How to enable microphone:</p>
          <p>1. Look for the camera/microphone icon in your browser address bar.</p>
          <p>2. Select &quot;Always allow&quot; for this site.</p>
          <p>3. Click the &quot;Try Again&quot; button below.</p>
        </div>

        <div className="flex gap-3 justify-center">
          {onCancel && (
            <Button variant="ghost" size="md" onClick={onCancel}>
              Go Back
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={async () => {
              const ok = await requestPermission();
              if (ok) {
                await startRecording();
              }
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[640px] mx-auto flex flex-col items-center">
      {/* Header with Step Indicator & Timer */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#1E293B] mb-5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              isRecording ? 'bg-red-500 animate-ping' : 'bg-indigo-500'
            )}
          />
          <span className="text-sm font-semibold text-[#F0F4FF]">
            Recording Voice Sample
          </span>
        </div>

        {/* Large Timer with Dynamic Color */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-2xl font-bold tracking-wider transition-colors duration-300"
            style={{ color: timerColor }}
          >
            {minutes}:{seconds}
          </span>
          <span className="text-xs text-[#4B6080] font-mono">
            {duration < 30 ? '(min 30s)' : duration < 60 ? '(optimal 60s)' : '(ready)'}
          </span>
        </div>
      </div>

      {/* Script Card (Top Section) */}
      <div className="w-full mb-6">
        <RecordingScript duration={duration} isRecording={isRecording} />
      </div>

      {/* Notice alert if user tries stopping before 30s */}
      {minimumNotice && (
        <div className="w-full mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{minimumNotice}</span>
        </div>
      )}

      {/* Big Mic Button with 3 Concentric Rings */}
      <div className="relative flex items-center justify-center my-4 w-[130px] h-[130px]">
        {/* Outer ring 1 (120px) */}
        <div
          className={cn(
            'absolute w-[120px] h-[120px] rounded-full transition-all duration-300 pointer-events-none',
            isRecording ? 'bg-[rgba(239,68,68,0.08)]' : 'bg-[rgba(99,102,241,0.08)]'
          )}
        />

        {/* Outer ring 2 (96px) */}
        <div
          className={cn(
            'absolute w-[96px] h-[96px] rounded-full transition-all duration-300 pointer-events-none',
            isRecording
              ? 'bg-[rgba(239,68,68,0.15)] animate-[pulse_2s_infinite]'
              : 'bg-[rgba(99,102,241,0.15)]'
          )}
        />

        {/* Outer ring 3 (72px) */}
        <div
          className={cn(
            'absolute w-[72px] h-[72px] rounded-full transition-all duration-300 pointer-events-none',
            isRecording
              ? 'bg-[rgba(239,68,68,0.25)] animate-[pulse_2.5s_infinite_0.3s]'
              : 'bg-[rgba(99,102,241,0.25)]'
          )}
        />

        {/* Inner button (56px circle) */}
        <button
          type="button"
          onClick={handleMicClick}
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
          className={cn(
            'relative z-10 w-[56px] h-[56px] rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-lg active:scale-95 select-none',
            isRecording
              ? 'bg-[#EF4444] shadow-[0_0_32px_rgba(239,68,68,0.4)]'
              : 'bg-[#6366F1] hover:bg-[#4F46E5] shadow-[0_0_20px_rgba(99,102,241,0.35)]'
          )}
        >
          {isRecording ? (
            <Square className="w-5 h-5 fill-current" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
      </div>

      <p className="text-xs text-[#8899B4] mt-1 mb-2 font-medium">
        {isRecording
          ? 'Recording in progress... Speak clearly at a steady pace.'
          : 'Tap mic button to start recording your voice sample.'}
      </p>

      {/* Volume Meter */}
      <VolumeMeter audioLevel={audioLevel} isRecording={isRecording} />

      {/* Bottom Controls Row */}
      <div className="w-full flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[#1E293B]">
        <button
          type="button"
          onClick={handleRerecord}
          disabled={!isRecording && duration === 0}
          className="h-[44px] px-4 rounded-[10px] border border-[#2D3F56] text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-all flex items-center gap-2 text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Re-record</span>
        </button>

        {/* Stop & Upload button: only shown after 30s minimum */}
        {duration >= 30 ? (
          <button
            type="button"
            onClick={handleStopAndUpload}
            className="h-[44px] px-5 rounded-[10px] bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 text-sm font-semibold cursor-pointer active:scale-95 animate-fadeIn select-none"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Stop &amp; Upload Voice</span>
          </button>
        ) : (
          <span className="text-xs text-[#4B6080]">
            {isRecording
              ? `Recording ${30 - duration}s more to unlock upload`
              : 'Minimum 30s recording required'}
          </span>
        )}
      </div>
    </div>
  );
}
