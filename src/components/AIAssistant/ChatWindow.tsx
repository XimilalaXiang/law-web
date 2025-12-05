import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, AlertCircle, ShieldCheck, CircleStop, Plus, History, Minimize2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickQuestions from './QuickQuestions';
import { useAIChat } from '../../hooks/useAIChat';
import type { Message } from '../../types/chat';

interface ChatWindowProps {
  onClose: () => void;
}

// 聊天对话框 - 深色科技风格
const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, error, sendMessage, retryLastMessage, stopGenerating, sessions, activeSessionId, newSession, switchSession, clearSession, deleteSession } = useAIChat() as any;
  const [showHistory, setShowHistory] = useState(false);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ESC 关闭
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // 发送
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // 输入框快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  // 导出为 Markdown
  const buildMarkdown = () => {
    const header = `# SafeCareer 对话记录\n\n`;
    const body = messages.map((m: any) => `## ${m.role === 'user' ? '用户' : '助手'}\n\n${m.content || ''}\n`).join('\n');
    return header + body;
  };
  const exportMarkdown = () => {
    const md = buildMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `safecareer-chat-${ts}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 flex flex-col w-full h-full md:w-[460px] lg:w-[520px] md:h-[600px] md:rounded-2xl bg-[#0a0a0a] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-[var(--border)] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="AI反诈助手"
    >
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0f0f0f] to-[#141414] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          {/* Logo 图标 */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[#EBB800] flex items-center justify-center shadow-[0_4px_15px_rgba(255,199,0,0.3)]">
            <ShieldCheck className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI 反诈助手</h3>
            <p className="text-xs text-white/40">随时为你守护</p>
          </div>
        </div>

        {/* 控制按钮组 */}
        <div className="flex items-center gap-2">
          {/* 新会话 */}
          <button
            onClick={() => { newSession(); setInput(''); }}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--primary)]/50 transition-all duration-200 flex items-center justify-center group"
            title="新会话"
            aria-label="新会话"
          >
            <Plus className="h-4 w-4 text-white/60 group-hover:text-[var(--primary)]" />
          </button>

          {/* 历史列表 */}
          <div className="relative">
            <button
              onClick={() => setShowHistory(v => !v)}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--primary)]/50 transition-all duration-200 flex items-center justify-center group"
              title="会话历史"
              aria-expanded={showHistory}
            >
              <History className="h-4 w-4 text-white/60 group-hover:text-[var(--primary)]" />
            </button>
            {showHistory && (
              <div className="absolute right-0 mt-2 w-64 max-h-72 overflow-y-auto bg-[#0f0f0f] border border-[var(--border)] rounded-xl shadow-2xl z-50">
                <div className="p-3 text-xs text-white/40 border-b border-[var(--border)]">历史对话</div>
                <ul className="divide-y divide-[var(--border)]">
                  {sessions
                    .filter((s: any) => (s.messages?.length > 0) || (s.title && s.title.trim().length > 0) || (s.updatedAt && s.updatedAt > 0))
                    .map((s: any) => (
                    <li key={s.id}>
                      <div className={`flex items-center justify-between px-3 py-2 text-sm ${s.id === activeSessionId ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-white/70 hover:bg-white/5'}`}>
                        <button onClick={() => { switchSession(s.id); setShowHistory(false); setInput(''); }} className="flex-1 text-left">
                          <div className="truncate font-medium">{(s.title || '').trim() || '新对话'}</div>
                          {s.updatedAt ? (
                            <div className="text-xs text-white/40">{new Date(s.updatedAt).toLocaleString('zh-CN')}</div>
                          ) : null}
                        </button>
                        <button onClick={() => { if (window.confirm('确认删除该会话？删除后不可恢复！')) deleteSession(s.id); }} className="ml-2 text-xs text-red-400 hover:text-red-300">删除</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 最小化 */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--primary)]/50 transition-all duration-200 flex items-center justify-center group"
            title="最小化"
            aria-label="最小化"
          >
            <Minimize2 className="h-4 w-4 text-white/60 group-hover:text-[var(--primary)]" />
          </button>

          {isLoading && (
            <button
              onClick={stopGenerating}
              className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center"
              title="停止生成"
              aria-label="停止生成"
            >
              <CircleStop className="h-4 w-4 text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#050505]" aria-live="polite">
        {messages.length === 0 ? (
          // 欢迎界面
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            {/* 主图标 */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[#EBB800] flex items-center justify-center shadow-[0_8px_30px_rgba(255,199,0,0.3)]">
                <span className="text-4xl">🛡️</span>
              </div>
              {/* 状态指示灯 */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#050505] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">你好，我是 AI 反诈助手</h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed max-w-xs">
              我可以帮你分析招聘信息、识别风险，并提供应对建议。
              遇到任何求职诈骗相关问题，随时问我。
            </p>
            
            {/* 快速提问 */}
            <QuickQuestions onSelect={handleQuickQuestion} disabled={isLoading} />
          </div>
        ) : (
          // 消息列表
          <>
            {messages.map((message: Message) => (
              <MessageBubble key={message.id} message={message} onExportMarkdown={exportMarkdown} />
            ))}

            {/* 错误提示 */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-300 mb-2">{error}</p>
                  <button onClick={retryLastMessage} className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium">
                    <RefreshCw className="h-3 w-3" />
                    重试
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入区 */}
      <div className="p-4 bg-[#0a0a0a] border-t border-[var(--border)]">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'AI 正在思考...' : '请输入消息...'}
            disabled={isLoading}
            rows={1}
            className="flex-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)]/50 resize-none text-sm text-white placeholder-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-[var(--primary)] to-[#EBB800] rounded-xl text-black shadow-[0_4px_15px_rgba(255,199,0,0.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(255,199,0,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        <p className="hidden md:block text-xs text-white/30 mt-2 text-center">按 Enter 发送，Shift + Enter 换行</p>
      </div>
    </div>
  );
};

export default ChatWindow;
