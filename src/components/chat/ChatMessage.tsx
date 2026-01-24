import React from 'react';
import { Sparkles, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isStreaming }) => {
  return (
    <div className={`flex gap-2 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className={`w-4 h-4 text-primary ${isStreaming ? 'animate-pulse' : ''}`} />
        </div>
      )}
      <div
        className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
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
      {role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-accent" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;