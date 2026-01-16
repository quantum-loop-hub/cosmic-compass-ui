import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Clock, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_DURATION_MS = 2 * 60 * 1000; // 2 minutes

const AstroChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(CHAT_DURATION_MS);
  const [chatStartTime, setChatStartTime] = useState<number | null>(null);
  const [hasExpired, setHasExpired] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOpenChat = () => {
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
      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: 'नमस्कार! 🙏 I am Astro Gautam. With 14 years of experience in Vedic Astrology and Jyotish Shastra, I\'m here to guide you. How may I help you today? You can ask about your zodiac sign, planetary influences, or any life concerns.'
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || hasExpired) return;

    const userMessage: Message = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('astro-chat', {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      const assistantMessage = data.choices?.[0]?.message?.content || 'I apologize, I could not process your request. Please try again.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Unable to get response. Please try again.');
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
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-card border border-primary/30 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
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
            <div className="flex items-center gap-2">
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

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
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
          </ScrollArea>

          {/* Expired State */}
          {hasExpired && (
            <div className="p-4 bg-secondary/50 border-t border-primary/30">
              <p className="text-sm text-center text-foreground mb-3">
                ⏰ Your free chat time has ended. For a detailed personal consultation with Astro Gautam, please book a session.
              </p>
              <Button 
                onClick={handleBookConsultation}
                className="w-full btn-cosmic"
              >
                Book Consultation
              </Button>
            </div>
          )}

          {/* Input */}
          {!hasExpired && (
            <div className="p-4 border-t border-primary/30 bg-card">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your zodiac, career, love..."
                  className="flex-1 bg-muted border-primary/20 focus:border-primary"
                  disabled={isLoading}
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
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AstroChatWidget;
