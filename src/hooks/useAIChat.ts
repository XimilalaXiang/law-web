import { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessageStream } from '../utils/aiService';
import type { Message, ChatState, ChatStore, ChatSession } from '../types/chat';

const LEGACY_KEY = 'safecareer_chat_history';
const SESSIONS_KEY = 'safecareer_chat_sessions';
const ACTIVE_KEY = 'safecareer_active_session';

// AI 聊天 Hook - 多会话管理 + 流式生成
export function useAIChat() {
  const [store, setStore] = useState<ChatStore>({ sessions: [], activeId: null });
  const [state, setState] = useState<ChatState>({ messages: [], isLoading: false, error: null });
  const abortRef = useRef<AbortController | null>(null);

  // 初始化/迁移
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(SESSIONS_KEY);
      const savedActive = localStorage.getItem(ACTIVE_KEY);
      if (savedSessions) {
        const sessions: ChatSession[] = JSON.parse(savedSessions);
        const activeId = savedActive || (sessions[0]?.id ?? null);
        setStore({ sessions, activeId });
        const active = sessions.find(s => s.id === activeId);
        setState(prev => ({ ...prev, messages: active ? active.messages : [] }));
      } else {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const messages: Message[] = JSON.parse(legacy);
          const s: ChatSession = { id: `s-${Date.now()}`, title: '迁移的会话', createdAt: Date.now(), updatedAt: Date.now(), messages };
          const next: ChatStore = { sessions: [s], activeId: s.id };
          setStore(next);
          setState(prev => ({ ...prev, messages }));
          localStorage.setItem(SESSIONS_KEY, JSON.stringify(next.sessions));
          localStorage.setItem(ACTIVE_KEY, next.activeId || '');
          localStorage.removeItem(LEGACY_KEY);
        } else {
          const s: ChatSession = { id: `s-${Date.now()}`, title: '新会话', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
          const next: ChatStore = { sessions: [s], activeId: s.id };
          setStore(next);
          setState(prev => ({ ...prev, messages: [] }));
          localStorage.setItem(SESSIONS_KEY, JSON.stringify(next.sessions));
          localStorage.setItem(ACTIVE_KEY, next.activeId || '');
        }
      }
    } catch (e) {
      console.error('Failed to initialize sessions:', e);
    }
  }, []);

  const persistStore = useCallback((next: ChatStore) => {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(next.sessions));
      localStorage.setItem(ACTIVE_KEY, next.activeId || '');
    } catch (e) {
      console.error('Failed to persist store:', e);
    }
  }, []);

  const getActiveSession = useCallback((): ChatSession => {
    let active = store.sessions.find(s => s.id === store.activeId);
    if (!active) {
      const s: ChatSession = { id: `s-${Date.now()}`, title: '新会话', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
      const next: ChatStore = { sessions: [s, ...store.sessions], activeId: s.id };
      setStore(next);
      persistStore(next);
      active = s;
    }
    return active;
  }, [store.sessions, store.activeId, persistStore]);

  // 发送消息到当前会话
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', content: content.trim(), timestamp: Date.now() };
    const assistantMessage: Message = { id: `assistant-${Date.now()}`, role: 'assistant', content: '', timestamp: Date.now() };

    const active = getActiveSession();
    const nextSessions = store.sessions.map(s => s.id === active.id ? {
      ...s,
      messages: [...s.messages, userMessage, assistantMessage],
      updatedAt: Date.now(),
      title: ((!(s.title && s.title.trim()) || s.title.trim() === '新会话') && userMessage.content)
        ? userMessage.content.slice(0, 12)
        : (s.title || ''),
    } : s);
    const nextStore: ChatStore = { sessions: nextSessions, activeId: active.id };
    setStore(nextStore);
    const activeMsgs = nextSessions.find(s => s.id === active.id)!.messages;
    setState(prev => ({ ...prev, messages: activeMsgs, isLoading: true, error: null }));
    persistStore(nextStore);

    // 流式
    const controller = new AbortController();
    abortRef.current = controller;
    await sendMessageStream(
      [...active.messages, userMessage],
      (chunk: string) => {
        setStore(prevStore => {
          const s = prevStore.sessions.map(session => {
            if (session.id !== prevStore.activeId) return session;
            const msgs = [...session.messages];
            const last = msgs[msgs.length - 1];
            if (last && last.role === 'assistant') { last.content += chunk; }
            return { ...session, messages: msgs, updatedAt: Date.now() };
          });
          const updated: ChatStore = { sessions: s, activeId: prevStore.activeId };
          persistStore(updated);
          const activeMsgs2 = s.find(ss => ss.id === prevStore.activeId)?.messages || [];
          setState(prev => ({ ...prev, messages: activeMsgs2 }));
          return updated;
        });
      },
      () => {
        abortRef.current = null;
        setState(prev => ({ ...prev, isLoading: false }));
      },
      (error: Error) => {
        abortRef.current = null;
        setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      },
      controller.signal
    );
  }, [store.sessions, store.activeId, state.isLoading, getActiveSession, persistStore]);

  // 清空当前会话
  const clearHistory = useCallback(() => {
    const active = getActiveSession();
    const nextSessions = store.sessions.map(s => s.id === active.id ? { ...s, messages: [], title: '', updatedAt: 0 } : s);
    const next: ChatStore = { sessions: nextSessions, activeId: active.id };
    setStore(next);
    setState(prev => ({ ...prev, messages: [], error: null, isLoading: false }));
    persistStore(next);
  }, [store.sessions, getActiveSession, persistStore]);

  // 清空指定会话（保留在列表）
  const clearSession = useCallback((id: string) => {
    const target = store.sessions.find(s => s.id === id);
    if (!target) return;
    const nextSessions = store.sessions.map(s => s.id === id ? { ...s, messages: [], title: '', updatedAt: 0 } : s);
    const next: ChatStore = { sessions: nextSessions, activeId: store.activeId };
    setStore(next);
    if (store.activeId === id) setState(prev => ({ ...prev, messages: [] }));
    persistStore(next);
  }, [store.sessions, store.activeId, persistStore]);

  // 删除指定会话（从列表移除）
  const deleteSession = useCallback((id: string) => {
    const filtered = store.sessions.filter(s => s.id !== id);
    if (filtered.length === 0) {
      // 全删后无会话，生成一个空会话作为当前
      const s: ChatSession = { id: `s-${Date.now()}`, title: '', createdAt: Date.now(), updatedAt: 0, messages: [] };
      const next: ChatStore = { sessions: [s], activeId: s.id };
      setStore(next);
      setState(prev => ({ ...prev, messages: [] }));
      persistStore(next);
      return;
    }
    const isDeletingActive = store.activeId === id;
    const nextActiveId = isDeletingActive ? filtered[0].id : store.activeId;
    const next: ChatStore = { sessions: filtered, activeId: nextActiveId };
    setStore(next);
    if (isDeletingActive) {
      const active = filtered.find(s => s.id === nextActiveId);
      setState(prev => ({ ...prev, messages: active ? active.messages : [] }));
    }
    persistStore(next);
  }, [store.sessions, store.activeId, persistStore]);

  // 重试最后一条用户消息
  const retryLastMessage = useCallback(() => {
    const active = getActiveSession();
    const messages = active.messages;
    if (messages.length < 2) return;
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') { lastUserMessageIndex = i; break; }
    }
    if (lastUserMessageIndex === -1) return;
    const lastUserMessage = messages[lastUserMessageIndex];
    const newMessages = messages.slice(0, lastUserMessageIndex);
    const nextSessions = store.sessions.map(s => s.id === active.id ? { ...s, messages: newMessages } : s);
    const next: ChatStore = { sessions: nextSessions, activeId: active.id };
    setStore(next);
    setState(prev => ({ ...prev, messages: newMessages, error: null }));
    persistStore(next);
    sendMessage(lastUserMessage.content);
  }, [store.sessions, getActiveSession, sendMessage, persistStore]);

  // 停止当前生成
  const stopGenerating = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  // 新会话
  const newSession = useCallback(() => {
    const s: ChatSession = { id: `s-${Date.now()}`, title: '新会话', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
    const next: ChatStore = { sessions: [s, ...store.sessions], activeId: s.id };
    setStore(next);
    setState(prev => ({ ...prev, messages: [], error: null }));
    persistStore(next);
  }, [store.sessions, persistStore]);

  // 切换会话
  const switchSession = useCallback((id: string) => {
    const target = store.sessions.find(s => s.id === id);
    if (!target) return;
    const next: ChatStore = { sessions: store.sessions, activeId: id };
    setStore(next);
    setState(prev => ({ ...prev, messages: target.messages }));
    persistStore(next);
  }, [store.sessions, persistStore]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearHistory,
    retryLastMessage,
    stopGenerating,
    // 会话支持
    sessions: store.sessions,
    activeSessionId: store.activeId,
    newSession,
    switchSession,
    clearSession,
    deleteSession,
  };
}

