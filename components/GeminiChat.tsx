import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { streamGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface GeminiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      text: '',
      isStreaming: true
    };
    setMessages(prev => [...prev, modelMsg]);

    try {
      let currentText = '';
      await streamGeminiResponse(userMsg.text, (chunk) => {
        currentText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: currentText } : msg
        ));
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg
      ));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[350px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 text-white animate-in fade-in slide-in-from-top-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium">Gemini Assistant</span>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 max-h-[300px] overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-200'
              }`}
            >
              {msg.text}
              {msg.isStreaming && <span className="inline-block w-1.5 h-3 ml-1 bg-white/50 animate-pulse align-middle" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-2 border border-white/10 focus-within:border-white/30 transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/30"
            placeholder="Ask anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="text-blue-400 disabled:text-white/20 hover:text-blue-300 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;