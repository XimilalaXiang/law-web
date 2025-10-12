import type { Message, StreamChunk } from '../types/chat';

/**
 * 发送消息到AI助手API并处理流式响应
 */
export async function sendMessageStream(
  messages: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    // @ts-expect-error - Vite环境变量在运行时可用
    const apiUrl = import.meta.env?.VITE_AI_API_URL || '/api/chat';

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
      signal,
    });

    if (!response.ok) {
      // Try to surface backend details for better diagnosis
      let message = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        message = data?.error || data?.message || message;
        if (data?.details) {
          const d = data.details;
          const detailsMsg = d?.error || d?.message || (typeof d === 'string' ? d : '');
          if (detailsMsg) message = `${message} - ${detailsMsg}`;
        }
      } catch {
        try {
          const text = await response.text();
          if (text) message = `${message} - ${text}`;
        } catch {
          // 忽略文本解析错误
        }
      }
      throw new Error(message);
    }

    // 处理SSE流式响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to read response stream');
    }

    let buffer = '';
    let streaming = true;

    while (streaming) {
      const { done, value } = await reader.read();

      if (done) {
        streaming = false;
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // 保留不完整的行
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // 跳过空行
        if (trimmedLine === '') continue;
        
        // 只处理data:开头的行
        if (!trimmedLine.startsWith('data:')) continue;
        
        // 提取data后的内容，兼容 "data: " 和 "data:" 两种格式
        const data = trimmedLine.replace(/^data:\s*/, '');
        
        // 检查是否结束
        if (data === '[DONE]') {
          streaming = false;
          onComplete();
          return;
        }

        try {
          const chunk: StreamChunk = JSON.parse(data);
          // 严格只使用增量 delta.content，避免 message.content / output_text 导致重复
          const firstChoice = Array.isArray(chunk.choices) ? chunk.choices[0] : undefined;
          const deltaContent = firstChoice && typeof firstChoice.delta?.content === 'string'
            ? (firstChoice.delta.content as string)
            : '';
          
          if (deltaContent) {
            onChunk(deltaContent);
          }
        } catch (e) {
          console.error('SSE解析失败:', { line: trimmedLine, error: e });
          // JSON解析失败时不传递任何内容，避免传递原始数据
        }
      }
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // Aborted by user: treat as graceful stop
      onComplete();
      return;
    }
    console.error('AI Service Error:', error);
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}

