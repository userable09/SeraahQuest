import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  Heart, 
  ArrowDown, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { ChatMessage } from '../types';
import { getStoredChatHistory, saveChatHistory } from '../lib/storage';

interface AIChatViewProps {
  onSaveReflectionNote?: (noteText: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Explain the significance of the Treaty of Hudaybiyyah",
  "What was the Hilf al-Fudul (League of the Virtuous)?",
  "Summarize the events of the Battle of Badr in 4 bullet points",
  "How did Prophet Muhammad ﷺ treat prisoners of war?",
  "Tell me about Khadijah (RA) and her support during early Revelation",
  "What lessons can we learn from the Prophet's ﷺ Farewell Sermon?"
];

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
      setMessages(history);
    } else {
      // Welcome message
      const welcomeMsg: ChatMessage = {
        id: 'msg_welcome',
        sender: 'assistant',
        modelUsed: 'Groq (Llama 3.3 70B)',
        text: `Assalamu 'Alaikum! I am your **AI Seerah Assistant**, powered by **Groq Llama 3.3 70B**, **Mixtral**, and **DeepSeek R1**.

I am here to help you study the life, noble character, battles, treaties, and teachings of Prophet Muhammad ﷺ with authentic historical references.

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
      modelUsed: selectedModel,
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
      let detectedModel = selectedModel;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') break;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                }
                if (parsed.modelUsed) {
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
                // Raw fallback
                if (dataStr && !dataStr.startsWith('{')) {
                  accumulatedText += dataStr;
                }
              }
            }
          }
        }
      } else {
        const json = await response.json();
        accumulatedText = json.text || 'No response returned.';
        detectedModel = json.modelUsed || selectedModel;
      }

      const finalMessages = updatedMessages.concat({
        ...botMsg,
        text: accumulatedText,
        modelUsed: detectedModel
      });

      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (err) {
      console.error('Chat error:', err);
      const errorMsgText = "I encountered an error connecting to the AI model. Please verify your network connection or try again.";
      const finalErrMessages = updatedMessages.concat({
        ...botMsg,
        text: errorMsgText
      });
      setMessages(finalErrMessages);
      saveChatHistory(finalErrMessages);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([]);
      saveChatHistory([]);
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
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
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
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] max-w-5xl mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden">
      
      {/* Header & Model Selector */}
      <div className="p-4 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>AI Seerah Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-extrabold uppercase">
                GROQ
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Interactive Seerah tutoring with classical references
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-slate-100 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="llama-3.3-70b" className="bg-slate-900 text-slate-100">Llama 3.3 70B (Recommended)</option>
              <option value="mixtral-8x7b" className="bg-slate-900 text-slate-100">Mixtral 8x7B</option>
              <option value="deepseek-r1" className="bg-slate-900 text-slate-100">DeepSeek R1</option>
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

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id || idx}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs mt-1">
                  ﷺ
                </div>
              )}

              <div className={`max-w-3xl space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Sender badge */}
                <div className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>{isUser ? 'You' : msg.modelUsed || 'AI Assistant'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md ${
                    isUser
                      ? 'bg-emerald-600/25 text-emerald-100 border border-emerald-500/30 rounded-tr-none shadow-xs font-medium'
                      : 'bg-white/5 text-slate-100 border border-white/10 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {msg.text || (isStreaming && idx === messages.length - 1 ? 'Generating response...' : '')}
                  </div>

                  {/* Actions for assistant message */}
                  {!isUser && msg.text && (
                    <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyText(msg.text, idx)}
                          className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSpeakText(msg.text, idx)}
                          className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                          title="Read aloud"
                        >
                          {isSpeaking && speakingIndex === idx ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[11px]">{isSpeaking && speakingIndex === idx ? 'Stop' : 'Listen'}</span>
                        </button>
                      </div>

                      {onSaveReflectionNote && (
                        <button
                          onClick={() => onSaveReflectionNote(msg.text)}
                          className="flex items-center gap-1 text-amber-400 hover:underline transition-all"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-[11px]">Save as Reflection</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs mt-1">
                  You
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length <= 2 && (
        <div className="p-3 bg-slate-950/60 backdrop-blur-xl border-t border-white/10">
          <p className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Suggested Questions:</span>
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isStreaming}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs whitespace-nowrap hover:border-emerald-500/40 hover:text-emerald-400 transition-all shrink-0 backdrop-blur-md"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xl border-t border-white/10">
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
            placeholder="Ask anything about Seerah, Hadith, or classical events..."
            disabled={isStreaming}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500/50 backdrop-blur-md transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center shrink-0"
          >
            {isStreaming ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>

    </div>
  );
};
