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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const detectLanguage = (text: string): string => {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? 'hi-IN' : 'en-US';
  };

  const speak = useCallback(async (text: string) => {
    if (!text || text.trim().length === 0) return;

    if (!window.speechSynthesis) {
      const msg = 'Speech synthesis not supported in this browser';
      onError?.(msg);
      toast.error(msg);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    setIsLoading(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = detectLanguage(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utteranceRef.current = utterance;

    utterance.onstart = () => {
      setIsLoading(false);
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (e.error === 'canceled') return;
      setIsSpeaking(false);
      setIsLoading(false);
      utteranceRef.current = null;
      const errorMsg = 'Failed to speak text';
      onError?.(errorMsg);
      toast.error(errorMsg);
    };

    window.speechSynthesis.speak(utterance);
  }, [onStart, onEnd, onError]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsLoading(false);
    utteranceRef.current = null;
    onEnd?.();
  }, [onEnd]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
  };
};
