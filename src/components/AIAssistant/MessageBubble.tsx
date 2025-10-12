import React, { useState } from 'react';
import { UserIcon, BotIcon, Copy as CopyIcon, Check as CheckIcon, Download as DownloadIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
  onExportMarkdown?: () => void;
}

/**
 * 消息气泡组件 - 展示用户和AI的消息
 */
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

  return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 md:mb-4 px-2`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start w-full max-w-[98%] md:max-w-[85%] gap-2 md:gap-3`}>
        {/* 头像 */}
        <div
          className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white'
              : 'bg-white dark:bg-gray-700 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-3px_-3px_6px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-600'
          }`}
        >
          {isUser ? (
            <UserIcon className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <BotIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* 消息内容 - Neumorphic风格 */}
        <div
          className={`px-4 md:px-5 py-3 md:py-4 rounded-2xl min-w-0 flex-1 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg'
              : 'relative pr-12 md:pr-14 lg:pr-16 xl:pr-20 pb-10 bg-white dark:bg-gray-700 shadow-[5px_5px_15px_rgba(0,0,0,0.08),-5px_-5px_15px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-600'
          }`}
          style={{ 
            overflow: 'hidden',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {/* 复制/导出（仅助手消息，右下角） */}
          {canCopy && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title={copied ? '已复制' : '复制内容'}
                aria-label={copied ? '已复制' : '复制内容'}
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </button>
              {onExportMarkdown && (
                <button
                  onClick={onExportMarkdown}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                  title="导出为 Markdown"
                  aria-label="导出为 Markdown"
                >
                  <DownloadIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          {isUser ? (
            // 用户消息：直接显示
            <p 
              className="text-sm leading-relaxed"
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {message.content}
            </p>
          ) : (
            // AI消息：Markdown渲染
            <div
              className={`prose prose-sm max-w-none ${
                message.content ? '' : 'text-gray-400 dark:text-gray-500 italic'
              }`}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                maxWidth: '100%'
              }}
            >
              {message.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 自定义样式
                    h1: ({ children }) => (
                      <h1 
                        className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 
                        className="text-base font-bold mb-2 text-gray-900 dark:text-gray-100"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 
                        className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p 
                        className="text-sm leading-relaxed mb-2 text-gray-700 dark:text-gray-300"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => <ul className="list-disc pl-4 md:pl-5 mb-2 space-y-1 text-gray-700 dark:text-gray-300 overflow-hidden">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 md:pl-5 mb-2 space-y-1 text-gray-700 dark:text-gray-300 overflow-hidden">{children}</ol>,
                    li: ({ children }) => (
                      <li 
                        className="text-sm text-gray-700 dark:text-gray-300"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-600 dark:text-gray-400">{children}</em>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code 
                          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-red-600 dark:text-red-400"
                          style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                        >
                          {children}
                        </code>
                      ) : (
                        <code 
                          className="block p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200"
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            overflow: 'hidden'
                          }}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote 
                        className="border-l-4 border-blue-400 dark:border-blue-500 pl-3 md:pl-4 py-2 my-2 bg-blue-50 dark:bg-blue-900/20 rounded-r text-gray-700 dark:text-gray-300"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflow: 'hidden' }}
                      >
                        {children}
                      </blockquote>
                    ),
                    // 表格样式
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="bg-white dark:bg-gray-700">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th 
                        className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td 
                        className="px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce animation-delay-200">●</span>
                  <span className="animate-bounce animation-delay-400">●</span>
                </span>
              )}
            </div>
          )}

          {/* 时间戳 */}
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100 dark:text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

