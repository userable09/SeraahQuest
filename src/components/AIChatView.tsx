import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bot, 
  Send, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  Heart, 
  RefreshCw,
  Cpu,
  Quote
} from 'lucide-react';
import { ChatMessage } from '../types';
import { getStoredChatHistory, saveChatHistory } from '../lib/storage';

interface AIChatViewProps {
  onSaveReflectionNote?: (noteText: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Explain the significance of the Treaty of Hudaybiyyah",
  "What was the Hilf al-Fudul (League of the Virtuous)?",
  "Summarize the events of the Battle of Badr in 4 key points",
  "How did Prophet Muhammad ﷺ treat prisoners of war?",
  "Tell me about Khadijah (RA) and her support during early Revelation",
  "What lessons can we learn from the Prophet's ﷺ Farewell Sermon?"
];

// Helper component to render rich, structured Markdown responses using react-markdown
const FormattedResponse: React.FC<{ text: string; isStreaming?: boolean }> = ({ text, isStreaming }) => {
  if (!text) return null;

  return (
    <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-100 leading-relaxed max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-bold text-amber-300 pt-3 pb-1 border-b border-amber-500/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-emerald-300 pt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>{children}</span>
            </h4>
          ),
          p: ({ children }) => (
            <p className="leading-relaxed text-slate-200 my-1.5">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <div className="my-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900/80 border-l-4 border-amber-400 text-amber-100 shadow-sm relative">
              <Quote className="w-4 h-4 text-amber-400/50 absolute top-2 right-2 pointer-events-none" />
              <div className="italic font-serif leading-relaxed text-xs sm:text-sm">
                {children}
              </div>
            </div>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2.5 pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 my-2.5 pl-2 list-decimal list-inside text-amber-300 font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-200 font-normal leading-relaxed">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-amber-300">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-emerald-200">{children}</em>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono text-xs border border-emerald-500/30">
              {children}
            </code>
          )
        }}
      >
        {text}
      </ReactMarkdown>

      {/* Streaming cursor */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 rounded-sm animate-pulse align-middle" />
      )}
    </div>
  );
};

export const AIChatView: React.FC<AIChatViewProps> = ({ onSaveReflectionNote }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('llama-3.3-70b');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = getStoredChatHistory();
    if (history && history.length > 0) {
      // Clean up old model references if any exist in history
      const cleanedHistory = history.map((m) => {
        if (m.text.includes('Groq') || m.modelUsed?.includes('Groq')) {
          return {
            ...m,
            modelUsed: 'Seerah AI Assistant',
            text: m.text.replace(/Groq Llama 3\.3 70B, Mixtral, and DeepSeek R1/g, 'authentic Islamic sources and AI intelligence')
          };
        }
        return m;
      });
      setMessages(cleanedHistory);
    } else {
      // Welcome message
      const welcomeMsg: ChatMessage = {
        id: 'msg_welcome',
        sender: 'assistant',
        modelUsed: 'Seerah AI Scholar',
        text: `Assalamu 'Alaikum! I am your **AI Seerah Assistant**, dedicated to helping you study the noble biography, character, battles, treaties, and teachings of Prophet Muhammad ﷺ with authentic historical references.

I draw upon classical biography texts (*Ar-Raheeq Al-Makhtum*, *Sirat Ibn Hisham*, *Fiqh-us-Seerah*) and primary Hadith collections (*Sahih al-Bukhari*, *Sahih Muslim*).

**How can I assist your Seerah study today?** Select a suggested question below or type your query!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
      saveChatHistory([welcomeMsg]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || isStreaming) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsStreaming(true);

    const botMsgId = 'msg_' + (Date.now() + 1);
    const botMsg: ChatMessage = {
      id: botMsgId,
      sender: 'assistant',
      modelUsed: 'Seerah AI Scholar',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...updatedMessages, botMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI chat stream');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let detectedModel = 'Seerah AI Scholar';
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the incomplete last line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.replace('data: ', '').trim();
              if (dataStr === '[DONE]') break;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                }
                if (parsed.modelUsed && !parsed.modelUsed.includes('Groq')) {
                  detectedModel = parsed.modelUsed;
                }

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsgId
                      ? { ...m, text: accumulatedText, modelUsed: detectedModel }
                      : m
                  )
                );
              } catch (e) {
                // Ignore parsing errors for incomplete lines
              }
            }
          }
        }

        // Process any remaining buffered text
        if (buffer.trim().startsWith('data: ')) {
          const dataStr = buffer.trim().replace('data: ', '').trim();
          if (dataStr !== '[DONE]') {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) accumulatedText += parsed.text;
            } catch (e) {
              // ignore
            }
          }
        }
      } else {
        const json = await response.json();
        accumulatedText = json.text || 'No response returned.';
      }

      const finalMessages = updatedMessages.concat({
        ...botMsg,
        text: accumulatedText,
        modelUsed: 'Seerah AI Scholar'
      });

      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (err) {
      console.error('Chat error:', err);
      const errorMsgText = "I encountered an error generating the AI response. Please verify your internet connection and try again.";
      const finalErrMessages = updatedMessages.concat({
        ...botMsg,
        text: errorMsgText,
        modelUsed: 'Seerah AI Assistant'
      });
      setMessages(finalErrMessages);
      saveChatHistory(finalErrMessages);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all chat history?')) {
      const resetMsg: ChatMessage = {
        id: 'msg_welcome_' + Date.now(),
        sender: 'assistant',
        modelUsed: 'Seerah AI Scholar',
        text: `Assalamu 'Alaikum! I am your **AI Seerah Assistant**. Ask me any question about the life and teachings of Prophet Muhammad ﷺ!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([resetMsg]);
      saveChatHistory([resetMsg]);
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeakText = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && speakingIndex === index) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeakingIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingIndex(null);
      };
      setIsSpeaking(true);
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[520px] max-w-5xl mx-auto bg-slate-950/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {/* Header & Mode Selector */}
      <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Seerah Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                ONLINE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Interactive Seerah guidance grounded in authentic Islamic sources
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom Mode Selector */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-slate-100 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="llama-3.3-70b" className="bg-slate-900 text-slate-100">Seerah AI Scholar (Fast)</option>
              <option value="mixtral-8x7b" className="bg-slate-900 text-slate-100">Seerah AI Scholar (Detailed)</option>
              <option value="deepseek-r1" className="bg-slate-900 text-slate-100">Seerah AI Scholar (Deep Reasoning)</option>
            </select>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-white/5 border border-white/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-emerald-500/20">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const isLastMessage = idx === messages.length - 1;

          return (
            <div
              key={msg.id || idx}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 text-sm font-bold shadow-xs mt-1">
                  ﷺ
                </div>
              )}

              <div className={`max-w-3xl space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Sender badge */}
                <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'You' : 'Seerah AI Assistant'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Content Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl leading-relaxed backdrop-blur-md transition-all ${
                    isUser
                      ? 'bg-emerald-600/25 text-emerald-100 border border-emerald-500/30 rounded-tr-none shadow-xs font-medium'
                      : 'bg-white/[0.04] text-slate-100 border border-white/10 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-emerald-100">
                      {msg.text}
                    </div>
                  ) : (
                    <FormattedResponse 
                      text={msg.text} 
                      isStreaming={isStreaming && isLastMessage} 
                    />
                  )}

                  {/* Actions for assistant message */}
                  {!isUser && msg.text && (
                    <div className="pt-3 border-t border-white/10 mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopyText(msg.text, idx)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[11px]">{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSpeakText(msg.text, idx)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Read aloud"
                        >
                          {isSpeaking && speakingIndex === idx ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[11px]">
                            {isSpeaking && speakingIndex === idx ? 'Stop Voice' : 'Listen'}
                          </span>
                        </button>
                      </div>

                      {onSaveReflectionNote && (
                        <button
                          onClick={() => onSaveReflectionNote(msg.text)}
                          className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
                          <span className="text-[11px]">Save to Daily Reflections</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/10 text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs mt-1">
                  You
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Grid */}
      {messages.length <= 3 && (
        <div className="p-3 bg-slate-950/80 backdrop-blur-xl border-t border-white/10">
          <p className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Seerah Topics:</span>
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isStreaming}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 text-slate-300 hover:text-emerald-300 text-xs whitespace-nowrap hover:border-emerald-500/40 transition-all shrink-0 backdrop-blur-md"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about Seerah, Hadith, Battles, or Prophetic character..."
            disabled={isStreaming}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500/50 backdrop-blur-md transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center shrink-0"
            title="Send Query"
          >
            {isStreaming ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

    </div>
  );
};
