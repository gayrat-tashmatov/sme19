'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, Send, Sparkles, MessageSquare, ArrowRight, RefreshCw } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/cn';
import { findScenario, DEFAULT_QUICK_REPLIES, type AiScenario } from '@/lib/data/ai_scenarios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  scenario?: AiScenario; // assistant messages may have a matched scenario
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Здравствуйте! Я помогу разобраться с вопросами о запуске и развитии бизнеса в Узбекистане. Спросите что угодно или выберите один из частых вопросов ниже.',
};

export default function AIAssistant() {
  const { assistantOpen, toggleAssistant, closeAssistant } = useStore();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  function handleSend(text?: string) {
    const query = (text ?? input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Simulate thinking delay (feels more natural)
    setTimeout(() => {
      const scenario = findScenario(query);
      const assistantMsg: Message = scenario
        ? {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: '',
            scenario,
          }
        : {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content:
              'Точного ответа на этот вопрос у меня нет. Я охватываю ~30 типичных сценариев для МСБ. Попробуйте переформулировать или выберите один из частых вопросов ниже.',
          };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 600);
  }

  function handleQuickReply(text: string) {
    handleSend(text);
  }

  function handleReset() {
    setMessages([WELCOME_MESSAGE]);
  }

  return (
    <>
      {/* Floating launcher */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-40 flex items-center gap-3',
          assistantOpen && 'scale-90 opacity-0 pointer-events-none',
          'transition-all duration-200',
        )}
      >
        <div className="hidden md:flex items-center gap-2 bg-navy text-white pl-4 pr-4 py-2.5 rounded-full shadow-card-hover border border-gold/30">
          <Sparkles className="h-3.5 w-3.5 text-gold-light" />
          <span className="text-xs font-medium whitespace-nowrap">AI-помощник</span>
          <span className="text-[10px] text-white/50 font-mono">~30 сценариев</span>
        </div>

        <button
          onClick={toggleAssistant}
          aria-label="AI-помощник"
          className="relative h-16 w-16 rounded-full shadow-card-hover focus-ring bg-gold-gradient text-white flex items-center justify-center hover:scale-105 transition-transform duration-200"
        >
          <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />
          <span className="absolute inset-[-6px] rounded-full border border-gold/25" />
          <Bot className="h-7 w-7 relative z-10" />
          <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-success border-2 border-bg-white z-10" />
        </button>
      </div>

      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-48px)] md:w-[420px] h-[calc(100vh-48px)] md:h-[640px] max-h-[640px] bg-bg-white border border-ink-line rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-navy text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-gold-gradient flex items-center justify-center">
                  <Bot className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <div className="font-serif text-sm font-semibold">AI-помощник YaRP</div>
                  <div className="text-[10.5px] text-white/60 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> online · rule-based
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="h-8 w-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Начать сначала"
                  title="Начать сначала"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={closeAssistant}
                  className="h-8 w-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onQuickReply={handleQuickReply} />
              ))}
              {isThinking && (
                <div className="flex items-center gap-2 text-ink-muted text-sm">
                  <div className="h-7 w-7 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Quick replies — only show when starting fresh */}
              {messages.length === 1 && !isThinking && (
                <div className="pt-2">
                  <div className="text-[10.5px] uppercase tracking-wider text-ink-muted font-semibold mb-2">
                    Частые вопросы
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_QUICK_REPLIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickReply(q)}
                        className="px-3 py-1.5 rounded-full border border-ink-line bg-bg-white text-[12px] text-ink-muted hover:border-gold/40 hover:text-gold hover:bg-gold-soft/30 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-ink-line p-3 bg-bg-band/40 shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Спросите о регистрации, кредитах, налогах..."
                  rows={1}
                  className="flex-1 resize-none bg-bg-white border border-ink-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-colors max-h-24"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isThinking}
                  className="h-10 w-10 rounded-xl bg-gold-gradient text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform shrink-0"
                  aria-label="Отправить"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1.5 text-[10px] text-ink-muted text-center">
                Rule-based помощник · ~30 сценариев · для сложных вопросов обратитесь к оператору
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// Message bubble
// ════════════════════════════════════════════════════════════════════

function MessageBubble({ message, onQuickReply }: { message: Message; onQuickReply: (q: string) => void }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-gold text-white rounded-2xl rounded-tr-md px-3.5 py-2 text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-2">
      <div className="h-7 w-7 rounded-full bg-gold-gradient flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {message.scenario ? (
          <AssistantScenarioBubble scenario={message.scenario} onQuickReply={onQuickReply} />
        ) : (
          <div className="bg-bg-band/60 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm text-ink leading-relaxed">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}

function AssistantScenarioBubble({ scenario, onQuickReply }: { scenario: AiScenario; onQuickReply: (q: string) => void }) {
  return (
    <>
      <div className="bg-bg-band/60 rounded-2xl rounded-tl-md px-3.5 py-3 text-sm text-ink leading-relaxed space-y-2">
        <div className="font-serif font-semibold text-[14.5px] flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          {scenario.title}
        </div>
        {scenario.answer.map((p, i) => (
          <p key={i} className="text-[13px]">{p}</p>
        ))}
      </div>

      {scenario.links && scenario.links.length > 0 && (
        <div className="space-y-1">
          {scenario.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gold-soft/40 border border-gold/30 hover:bg-gold-soft/60 transition-colors text-sm group"
            >
              <span className="text-gold-dark font-medium flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                {link.label}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      )}

      {scenario.relatedQuickReplies && scenario.relatedQuickReplies.length > 0 && (
        <div className="pt-1">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">Связанные вопросы</div>
          <div className="flex flex-wrap gap-1">
            {scenario.relatedQuickReplies.map((q) => (
              <button
                key={q}
                onClick={() => onQuickReply(q)}
                className="px-2.5 py-1 rounded-full border border-ink-line bg-bg-white text-[11.5px] text-ink-muted hover:border-gold/40 hover:text-gold transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
