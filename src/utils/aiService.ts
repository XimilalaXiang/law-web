import type { Message, StreamChunk } from '../types/chat';

/**
 * 发送消息到AI助手API并处理流式响应
 */
export async function sendMessageStream(
  messages: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const apiUrl = import.meta.env.VITE_AI_API_URL || '/api/chat';

    // 只发送role和content，不包含id和timestamp
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: apiMessages
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    // 处理SSE流式响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to read response stream');
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // 保留不完整的行
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const chunk: StreamChunk = JSON.parse(data);
            const content = chunk.choices?.[0]?.delta?.content;
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.warn('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}

