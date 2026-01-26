import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseTextToSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const { onStart, onEnd, onError } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const detectLanguage = (text: string): 'hi' | 'en' => {
    // Simple detection: check for Devanagari script
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? 'hi' : 'en';
  };

  const speak = useCallback(async (text: string) => {
    if (!text || text.trim().length === 0) return;

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsLoading(true);
    const language = detectLanguage(text);

    try {
      const response = await fetch(
        `https://enlxxeyzthcphnettkeu.supabase.co/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, language }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        onStart?.();
      };

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        onEnd?.();
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        const errorMsg = 'Failed to play audio';
        onError?.(errorMsg);
        toast.error(errorMsg);
      };

      setIsLoading(false);
      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsLoading(false);
      setIsSpeaking(false);
      const errorMsg = error instanceof Error ? error.message : 'Text-to-speech failed';
      onError?.(errorMsg);
      toast.error(errorMsg);
    }
  }, [onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
      onEnd?.();
    }
  }, [onEnd]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
  };
};
