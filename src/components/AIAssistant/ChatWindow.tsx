import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, AlertCircle, ShieldCheck, CircleStop, Plus, History, Minimize2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickQuestions from './QuickQuestions';
import { useAIChat } from '../../hooks/useAIChat';
import type { Message } from '../../types/chat';

interface ChatWindowProps {
  onClose: () => void;
}

/**
 * 聊天窗口组件 - 主界面
 */
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

  // ESC 关闭对话框
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // 处理发送
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput('');
    
    // 重新聚焦输入框
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理快速提问
  const handleQuickQuestion = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  // 复制/导出整段聊天
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
      className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 flex flex-col w-full h-full md:w-[420px] md:h-[600px] md:rounded-3xl bg-white dark:bg-gray-800 shadow-[20px_20px_60px_rgba(0,0,0,0.15),-10px_-10px_40px_rgba(255,255,255,0.8)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.5),-10px_-10px_40px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="AI防骗助手"
    >
      {/* 头部 - 精简，仅图标 + 控件（更窄） */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.1),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-3px_-3px_8px_rgba(255,255,255,0.05)] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-md">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        {/* 操作按钮组 */}
        <div className="flex items-center gap-2">
          {/* 新建会话 */}
          <button
            onClick={() => { newSession(); setInput(''); }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.12),-1px_-1px_5px_rgba(255,255,255,0.95)] dark:hover:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-1px_-1px_5px_rgba(255,255,255,0.03)] transition-all duration-200 flex items-center justify-center group"
            title="新建会话"
            aria-label="新建会话"
          >
            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          {/* 历史列表（包含清空按钮） */}
          <div className="relative">
            <button
              onClick={() => setShowHistory(v => !v)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.12),-1px_-1px_5px_rgba(255,255,255,0.95)] dark:hover:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-1px_-1px_5px_rgba(255,255,255,0.03)] transition-all duration-200 flex items-center justify-center group"
              title="历史会话"
              aria-expanded={showHistory}
            >
              <History className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            {showHistory && (
              <div className="absolute right-0 mt-2 w-64 max-h-72 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400">历史对话</div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {sessions
                    .filter((s: any) => (s.messages?.length > 0) || (s.title && s.title.trim().length > 0) || (s.updatedAt && s.updatedAt > 0))
                    .map((s: any) => (
                    <li key={s.id}>
                      <div className={`flex items-center justify-between px-3 py-2 text-sm ${s.id === activeSessionId ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <button onClick={() => { switchSession(s.id); setShowHistory(false); setInput(''); }} className="flex-1 text-left">
                          <div className="truncate font-medium">{(s.title || '').trim()}</div>
                          {s.updatedAt ? (
                            <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(s.updatedAt).toLocaleString('zh-CN')}</div>
                          ) : null}
                        </button>
                        <button onClick={() => { if (window.confirm('确定删除该会话吗？删除后不可恢复。')) deleteSession(s.id); }} className="ml-2 text-xs text-red-600 dark:text-red-400 hover:underline">删除</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 最小化（隐藏窗口） */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.12),-1px_-1px_5px_rgba(255,255,255,0.95)] dark:hover:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-1px_-1px_5px_rgba(255,255,255,0.03)] transition-all duration-200 flex items-center justify-center group"
            title="最小化"
            aria-label="最小化"
          >
            <Minimize2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          
          {isLoading && (
            <button
              onClick={stopGenerating}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-700 dark:text-red-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.12),-1px_-1px_5px_rgba(255,255,255,0.95)] dark:hover:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-1px_-1px_5px_rgba(255,255,255,0.03)] active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] dark:active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6),inset_-2px_-2px_6px_rgba(255,255,255,0.05)] transition-all duration-200 flex items-center justify-center group"
              title="停止生成"
              aria-label="停止生成"
            >
              <CircleStop className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5 bg-gray-50 dark:bg-gray-900" aria-live="polite">
        {messages.length === 0 ? (
          // 欢迎界面
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center mb-4 shadow-[5px_5px_15px_rgba(0,0,0,0.1),-5px_-5px_15px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.02)]">
              <span className="text-4xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              你好！我是AI防骗助手
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              我可以帮你分析招聘信息、识别诈骗特征、提供防范建议。
              有任何求职防骗问题，随时问我！
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
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50 shadow-sm">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">{error}</p>
                  <button
                    onClick={retryLastMessage}
                    className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
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

      {/* 输入区域 */}
      <div className="p-4 pb-6 md:pb-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'AI正在思考...' : '输入你的问题...'}
            disabled={isLoading}
            rows={1}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl text-white shadow-[4px_4px_10px_rgba(59,130,246,0.3),-2px_-2px_8px_rgba(147,197,253,0.2)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(59,130,246,0.1)] transition-all duration-200 hover:shadow-[3px_3px_8px_rgba(59,130,246,0.4),-1px_-1px_6px_rgba(147,197,253,0.3)] dark:hover:shadow-[3px_3px_8px_rgba(0,0,0,0.5),-1px_-1px_6px_rgba(59,130,246,0.15)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <p className="hidden md:block text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;

