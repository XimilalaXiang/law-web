import React from 'react';
import { UserIcon, BotIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

/**
 * 消息气泡组件 - 展示用户和AI的消息
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[85%] gap-3`}>
        {/* 头像 */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'bg-white shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.8)] border border-gray-100'
          }`}
        >
          {isUser ? (
            <UserIcon className="h-5 w-5" />
          ) : (
            <BotIcon className="h-5 w-5 text-blue-600" />
          )}
        </div>

        {/* 消息内容 - Neumorphic风格 */}
        <div
          className={`px-5 py-4 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-white shadow-[5px_5px_15px_rgba(0,0,0,0.08),-5px_-5px_15px_rgba(255,255,255,0.8)] border border-gray-100'
          }`}
        >
          {isUser ? (
            // 用户消息：直接显示
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          ) : (
            // AI消息：Markdown渲染
            <div
              className={`prose prose-sm max-w-none ${
                message.content ? '' : 'text-gray-400 italic'
              }`}
            >
              {message.content ? (
                <ReactMarkdown
                  components={{
                    // 自定义样式
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-gray-900">{children}</h3>,
                    p: ({ children }) => <p className="text-sm leading-relaxed mb-2 text-gray-700">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-gray-700">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-gray-700">{children}</ol>,
                    li: ({ children }) => <li className="text-sm text-gray-700">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-red-600">
                          {children}
                        </code>
                      ) : (
                        <code className="block p-3 bg-gray-100 rounded-lg text-xs font-mono overflow-x-auto text-gray-800">
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-400 pl-4 py-2 my-2 bg-blue-50 rounded-r text-gray-700">
                        {children}
                      </blockquote>
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
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
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

