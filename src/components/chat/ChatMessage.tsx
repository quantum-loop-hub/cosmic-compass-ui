import React from 'react';
import { Sparkles, User, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
  isLoadingTTS?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  role, 
  content, 
  isStreaming, 
  onSpeak,
  isSpeaking,
  isLoadingTTS 
}) => {
  return (
    <div className={`flex gap-2 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className={`w-4 h-4 text-primary ${isStreaming ? 'animate-pulse' : ''}`} />
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${
            role === 'user'
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-muted text-foreground rounded-bl-none'
          }`}
        >
          {content}
          {isStreaming && (
            <span className="inline-block w-1 h-4 ml-1 bg-primary animate-pulse" />
          )}
        </div>
        {/* TTS button for assistant messages */}
        {role === 'assistant' && !isStreaming && onSpeak && content && (
          <Button
            variant="ghost"
            size="sm"
            className="self-start h-6 px-2 text-xs text-muted-foreground hover:text-primary"
            onClick={() => onSpeak(content)}
            disabled={isLoadingTTS}
          >
            {isLoadingTTS ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Loading...
              </>
            ) : isSpeaking ? (
              <>
                <VolumeX className="w-3 h-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 mr-1" />
                🔊 Listen
              </>
            )}
          </Button>
        )}
      </div>
      {role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-accent" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
