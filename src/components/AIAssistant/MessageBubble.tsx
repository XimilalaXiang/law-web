import React, { useState } from 'react';
import { UserIcon, BotIcon, Copy as CopyIcon, Check as CheckIcon, Download as DownloadIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
  onExportMarkdown?: () => void;
}

// 信息气泡 - 深色科技风格
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onExportMarkdown }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const canCopy = !isUser && !!message.content && message.content.trim().length > 0;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const rowClass = isUser
    ? 'grid grid-cols-[1fr,auto] items-start w-full gap-2 md:gap-3'
    : 'grid grid-cols-[auto,1fr] items-start w-full gap-2 md:gap-3';

  return (
    <div className={`mb-3 md:mb-4 px-2 w-full`}>
      <div className={rowClass}>
        {/* 头像 */}
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-[var(--primary)] to-[#EBB800] text-black shadow-[0_4px_12px_rgba(255,199,0,0.25)]'
              : 'bg-white/10 border border-white/10 text-[var(--primary)]'
          }`}
        >
          {isUser ? (
            <UserIcon className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <BotIcon className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </div>

        {/* 内容卡片 */}
        <div
          className={`px-4 md:px-5 py-3 md:py-4 rounded-2xl min-w-0 w-full ${
            isUser
              ? 'bg-gradient-to-br from-[var(--primary)] to-[#EBB800] text-black shadow-[0_4px_15px_rgba(255,199,0,0.2)]'
              : 'relative pr-12 sm:pr-10 md:pr-10 lg:pr-12 xl:pr-14 pb-10 bg-white/5 border border-white/10 md:self-stretch'
          }`}
          style={{
            overflow: 'hidden',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {/* 复制/导出按钮（仅 AI 回复显示） */}
          {canCopy && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-[var(--primary)]/20 text-white/60 hover:text-[var(--primary)] transition-colors"
                title={copied ? '已复制' : '复制文本'}
                aria-label={copied ? '已复制' : '复制文本'}
              >
                {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <CopyIcon className="h-4 w-4" />}
              </button>
              {onExportMarkdown && (
                <button
                  onClick={onExportMarkdown}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-[var(--primary)]/20 text-white/60 hover:text-[var(--primary)] transition-colors"
                  title="导出为 Markdown"
                  aria-label="导出为 Markdown"
                >
                  <DownloadIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {isUser ? (
            // 用户消息：纯文本
            <p
              className="text-sm leading-relaxed font-medium"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              {message.content}
            </p>
          ) : (
            // AI 消息：Markdown 渲染
            <div
              className={`prose prose-sm prose-invert max-w-none ${message.content ? '' : 'text-white/40 italic'}`}
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word', wordWrap: 'break-word', maxWidth: '100%' }}
            >
              {message.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2 text-white" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2 text-white" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mb-1 text-white" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed mb-2 text-white/80" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => <ul className="list-disc pl-4 md:pl-5 mb-2 space-y-1 text-white/80 overflow-hidden">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 md:pl-5 mb-2 space-y-1 text-white/80 overflow-hidden">{children}</ol>,
                    li: ({ children }) => (
                      <li className="text-sm text-white/80" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-[var(--primary)]">{children}</strong>,
                    em: ({ children }) => <em className="italic text-white/60">{children}</em>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="px-1.5 py-0.5 bg-[var(--primary)]/20 rounded text-xs font-mono text-[var(--primary)]" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                          {children}
                        </code>
                      ) : (
                        <code className="block p-3 bg-black/40 rounded-lg text-xs font-mono text-white/90 border border-white/10" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', overflow: 'hidden' }}>
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[var(--primary)] pl-3 md:pl-4 py-2 my-2 bg-[var(--primary)]/10 rounded-r text-white/80" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflow: 'hidden' }}>
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="min-w-full border-collapse border border-white/20 text-sm">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-white/10">{children}</thead>,
                    tbody: ({ children }) => <tbody className="bg-white/5">{children}</tbody>,
                    tr: ({ children }) => <tr className="border-b border-white/10">{children}</tr>,
                    th: ({ children }) => (
                      <th className="px-3 py-2 text-left font-semibold text-white border border-white/20" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-white/80 border border-white/20" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span className="inline-flex items-center gap-1 text-[var(--primary)]">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>·</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>·</span>
                </span>
              )}
            </div>
          )}

          {/* 时间戳 */}
          <div className={`text-xs mt-2 ${isUser ? 'text-black/60' : 'text-white/40'}`}>
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
