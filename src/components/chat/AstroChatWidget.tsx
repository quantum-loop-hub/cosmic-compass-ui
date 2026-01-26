import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Clock, Sparkles, History, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useChatHistory, ChatMessage as ChatMessageType } from '@/hooks/useChatHistory';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import ChatMessage from './ChatMessage';
import ChatHistory from './ChatHistory';

const CHAT_DURATION_MS = 2 * 60 * 1000; // 2 minutes

const WELCOME_MESSAGE: ChatMessageType = {
  role: 'assistant',
  content: '🙏 नमस्कार! मैं एस्ट्रो गौतम हूं।\n\nI am Astro Gautam, your Vedic Astrology guide with 14+ years of experience. आप मुझसे हिंदी या English में कुछ भी पूछ सकते हैं।\n\n**आप पूछ सकते हैं / You can ask about:**\n• राशिफल / Horoscope\n• कुंडली विश्लेषण / Kundli Analysis\n• विवाह मिलान / Marriage Compatibility\n• करियर मार्गदर्शन / Career Guidance\n• रत्न सुझाव / Gemstone Recommendations\n• उपाय / Remedies\n\nआपका क्या प्रश्न है? How may I help you today?'
};

const AstroChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(CHAT_DURATION_MS);
  const [chatStartTime, setChatStartTime] = useState<number | null>(null);
  const [hasExpired, setHasExpired] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    isLoadingHistory,
    loadConversation,
    createConversation,
    saveMessage,
    startNewConversation,
    deleteConversation,
  } = useChatHistory(user?.id);

  // Voice input hook
  const { isListening, isSupported: isVoiceSupported, interimTranscript, toggleListening } = useVoiceInput({
    language: 'hi-IN',
    onResult: (transcript) => {
      setInputValue(prev => prev + transcript);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Text-to-speech hook
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);
  const { speak, stop, isSpeaking, isLoading: isLoadingTTS } = useTextToSpeech({
    onEnd: () => setCurrentSpeakingIndex(null),
  });

  const handleSpeak = useCallback((text: string, index: number) => {
    if (isSpeaking && currentSpeakingIndex === index) {
      stop();
      setCurrentSpeakingIndex(null);
    } else {
      setCurrentSpeakingIndex(index);
      speak(text);
    }
  }, [isSpeaking, currentSpeakingIndex, speak, stop]);

  // Timer effect
  useEffect(() => {
    if (chatStartTime && isOpen && !hasExpired) {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - chatStartTime;
        const remaining = Math.max(0, CHAT_DURATION_MS - elapsed);
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setHasExpired(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [chatStartTime, isOpen, hasExpired]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, streamingContent]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOpenChat = async () => {
    if (!user) {
      toast.error('कृपया पहले लॉगिन करें / Please login first', {
        action: {
          label: 'Login',
          onClick: () => navigate('/auth'),
        },
      });
      return;
    }
    
    setIsOpen(true);
    if (!chatStartTime) {
      setChatStartTime(Date.now());
      // Create a new conversation if none exists
      if (!currentConversationId) {
        await createConversation();
        setMessages([WELCOME_MESSAGE]);
      }
    }
  };

  const handleStreamResponse = useCallback(async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                setStreamingContent(fullContent);
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream reading error:', error);
    }

    return fullContent;
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || hasExpired) return;

    const userMessage: ChatMessageType = { role: 'user', content: inputValue.trim() };
    
    // Ensure we have a conversation
    let convId = currentConversationId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) {
        toast.error('Failed to create conversation');
        return;
      }
    }

    setMessages(prev => [...prev, userMessage]);
    await saveMessage(userMessage);
    setInputValue('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch(
        `https://enlxxeyzthcphnettkeu.supabase.co/functions/v1/astro-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ 
            messages: [...messages.filter(m => m !== WELCOME_MESSAGE), userMessage],
            stream: true 
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.code === 'RATE_LIMITED') {
          toast.error('कृपया कुछ देर बाद प्रयास करें / Please try again in a moment');
          return;
        }
        
        if (errorData.code === 'PAYMENT_REQUIRED') {
          toast.error('सेवा अस्थायी रूप से अनुपलब्ध है / Service temporarily unavailable');
          return;
        }
        
        throw new Error('Failed to get response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const fullContent = await handleStreamResponse(reader);

      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: fullContent || 'क्षमा करें, मैं आपके प्रश्न का उत्तर नहीं दे पाया। / Sorry, I could not process your request.'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
      setStreamingContent('');

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('उत्तर प्राप्त करने में असमर्थ / Unable to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBookConsultation = () => {
    setIsOpen(false);
    navigate('/consultation');
  };

  const handleNewConversation = async () => {
    startNewConversation();
    await createConversation();
    setMessages([WELCOME_MESSAGE]);
    setShowHistory(false);
  };

  const handleSelectConversation = async (id: string) => {
    await loadConversation(id);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center glow-gold"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-card border border-primary/30 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary to-secondary/80 p-4 flex items-center justify-between border-b border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Astro Gautam</h3>
                <p className="text-xs text-muted-foreground">Vedic Astrologer • 14 Years Exp.</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowHistory(!showHistory)}
                title="Chat History"
              >
                <History className="w-4 h-4 text-muted-foreground" />
              </Button>
              {!hasExpired && (
                <div className="flex items-center gap-1 text-xs bg-background/50 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-primary" />
                  <span className={timeRemaining < 30000 ? 'text-destructive' : 'text-foreground'}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-background/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <ChatHistory
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={deleteConversation}
              onClose={() => setShowHistory(false)}
            />
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    role={message.role} 
                    content={message.content}
                    onSpeak={message.role === 'assistant' ? (text) => handleSpeak(text, index) : undefined}
                    isSpeaking={isSpeaking && currentSpeakingIndex === index}
                    isLoadingTTS={isLoadingTTS && currentSpeakingIndex === index}
                  />
                ))}
                
                {/* Streaming message */}
                {streamingContent && (
                  <ChatMessage role="assistant" content={streamingContent} isStreaming />
                )}
                
                {/* Loading indicator */}
                {isLoading && !streamingContent && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Expired State */}
          {hasExpired && (
            <div className="p-4 bg-secondary/50 border-t border-primary/30">
              <p className="text-sm text-center text-foreground mb-3">
                ⏰ आपका मुफ्त चैट समय समाप्त हो गया है।<br/>
                Your free chat time has ended.
              </p>
              <p className="text-xs text-center text-muted-foreground mb-3">
                एस्ट्रो गौतम जी के साथ विस्तृत परामर्श के लिए बुक करें।<br/>
                Book a detailed consultation with Astro Gautam.
              </p>
              <Button 
                onClick={handleBookConsultation}
                className="w-full btn-cosmic"
              >
                परामर्श बुक करें / Book Consultation
              </Button>
            </div>
          )}

          {/* Input */}
          {!hasExpired && (
            <div className="p-4 border-t border-primary/30 bg-card">
              <div className="flex gap-2">
                {isVoiceSupported && (
                  <Button
                    onClick={toggleListening}
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className={isListening ? "animate-pulse" : ""}
                    title={isListening ? "Stop recording" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}
                <Input
                  value={inputValue + (interimTranscript ? ` ${interimTranscript}` : '')}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="राशि, करियर, प्रेम के बारे में पूछें..."
                  className="flex-1 bg-muted border-primary/20 focus:border-primary"
                  disabled={isLoading || isListening}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {isListening ? '🎤 सुन रहा हूँ... / Listening...' : 'हिंदी या English में पूछें • 🎤 Voice supported'}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AstroChatWidget;