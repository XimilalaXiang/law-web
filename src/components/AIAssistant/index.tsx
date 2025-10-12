import React, { useState } from 'react';
import FloatingButton from './FloatingButton';
import ChatWindow from './ChatWindow';

/**
 * AI助手主组件 - 统一管理悬浮按钮和聊天窗口
 */
const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <FloatingButton onClick={() => setIsOpen(true)} />
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <ChatWindow onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default AIAssistant;

