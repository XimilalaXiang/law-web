import type { VercelRequest, VercelResponse } from '@vercel/node';

// Basic in-memory rate limiting per runtime instance
type RateInfo = { count: number; resetAt: number };
const rateMap = new Map<string, RateInfo>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQ = 20; // per window per IP

// 新增：中文 UTF-8 正常显示的系统提示词（替代上面已乱码版本）
const SAFECAREER_SYSTEM_PROMPT = `你是 SafeCareer 的 AI 反诈助手，专注帮助大学生识别和防范求职诈骗。

目标：
- 对用户给出的招聘信息/聊天记录/链接摘要进行风险识别与解释。
- 用通俗、可执行的建议，帮助用户立即自保与维权。

输出要求（使用 Markdown）：
1. 风险等级：低/中/高（用表情或加粗突出）
2. 主要风险信号：列出具体可验证的信号点（3-8 条）
3. 处置建议：分步骤、具体可执行（1-6 步）
4. 防骗要点：简短要点，便于二次复盘
5. 如用户已受骗：给出报警与取证清单模板

常见风险清单（供识别参考）：
- 先收费/培训费/服装费/押金/以贷代培
- "高薪简单不需经验"、"当天上岗"且流程异常
- 仅提供手机/社交账号，无正规官网/固话/营业执照
- 要求转账到个人账户/虚拟币/第三方平台
- 以“系统错误”“刷单返利”为由反复加码

风格：
- 专业、同理心、避免法律承诺用语
- 结构清晰，必要时引用条目化列表
- 不编造事实，无法确认时给出核验方法

当用户贴出招聘信息时，请抽取：公司名、岗位、地点、薪资、流程、费用要求、联系人/渠道，并基于此进行评估。
现在开始回答用户问题。`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 预检请求快速返回，避免 405
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = (req.body || {});

    // Validate payload
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request body: messages[] required' });
    }
    if (messages.length > 50) {
      return res.status(400).json({ error: 'Too many messages' });
    }
    const totalLength = messages.reduce((acc: number, m: unknown) => {
      if (m && typeof m === 'object' && 'content' in m && typeof (m as { content: unknown }).content === 'string') {
        return acc + (m as { content: string }).content.length;
      }
      return acc;
    }, 0);
    if (totalLength > 8000) {
      return res.status(400).json({ error: 'Content too long' });
    }

    // Rate limiting
    const ipHeader = (req.headers['x-forwarded-for'] as string | undefined) || '';
    const socket = req.socket as { remoteAddress?: string } | undefined;
    const ip = ipHeader.split(',')[0]?.trim() || socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const current = rateMap.get(ip);
    if (!current || now > current.resetAt) {
      rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      current.count += 1;
      if (current.count > MAX_REQ) {
        return res.status(429).json({ error: 'Too many requests', retry_after_ms: Math.max(0, current.resetAt - now) });
      }
    }

    // 从环境变量获取配置
    const apiKey = process.env.AI_API_KEY;
    const authScheme = (process.env.AI_AUTH_SCHEME || 'Bearer').trim();
    const rawBaseURL = process.env.AI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';
    const model = process.env.AI_MODEL || 'glm-4.6';

    // 兼容 SiliconFlow 等供应商：若用户只填根域名（如 https://siliconflow.cn），自动规范化为 API 域名
    const normalizeBase = (url: string): string => {
      try {
        const u = new URL(url);
        const host = u.host.toLowerCase();
        if (host === 'siliconflow.cn' || host === 'www.siliconflow.cn' || host === 'cloud.siliconflow.cn') {
          return 'https://api.siliconflow.cn';
        }
        return `${u.protocol}//${u.host}`.replace(/\/$/, '');
      } catch {
        // 允许直接写域名
        if (/siliconflow\.cn$/i.test(url)) return 'https://api.siliconflow.cn';
        return url.replace(/\/$/, '');
      }
    };

    // 构造聊天补全端点（默认使用 /chat/completions，避免自动拼接 /v1）
    const buildChatURL = (base: string): string => {
      const b = base.replace(/\/+$/, '');
      if (/\/chat\/completions$/i.test(b)) return b;
      return `${b}/chat/completions`;
    };

    const baseURL = normalizeBase(rawBaseURL);
    const chatURL = buildChatURL(baseURL);

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // 构建完整的消息数组，包含系统提示词
    const fullMessages = [
      { role: 'system', content: SAFECAREER_SYSTEM_PROMPT },
      ...messages
    ];

    // 调用DeepSeek API（兼容OpenAI格式）
    const response = await fetch(chatURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authScheme} ${apiKey}`,
        // 同时声明可接受 SSE 或 JSON，兼容不同提供商
        'Accept': 'text/event-stream, application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: fullMessages,
        stream: true, // 启用流式响应
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      let details: unknown = null;
      let textFallback = '';
      try { details = await response.json(); } catch {
        try { textFallback = await response.text(); details = textFallback; } catch { details = null; }
      }
      console.error('API Error:', { status: response.status, details: details || textFallback });
      return res.status(response.status).json({ error: 'AI service error', details });
    }

    // 设置SSE响应头（无论上游是否SSE，我们都用SSE向前端回写）
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 流式传输响应：优先按SSE解析；若最终未解析到任何SSE片段，则把累计文本当JSON或纯文本回退
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) {
      try {
        const text = await response.text();
        const tryJson = () => {
          try {
            const json = JSON.parse(text);
            return (
              json?.choices?.[0]?.message?.content ||
              json?.choices?.[0]?.delta?.content ||
              json?.choices?.[0]?.text ||
              json?.output_text ||
              (Array.isArray(json?.data) ? json.data[0]?.content : '') ||
              ''
            ) as string;
          } catch {
            return '';
          }
        };
        const content = tryJson() || text;
        if (content && content.length > 0) {
          const chunkSize = 400;
          for (let i = 0; i < content.length; i += chunkSize) {
            const part = content.slice(i, i + chunkSize);
            const sseObj = { choices: [{ delta: { content: part } }] };
            res.write(`data: ${JSON.stringify(sseObj)}\n\n`);
          }
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }
        return res.status(502).json({ error: 'Invalid upstream response (empty body)' });
      } catch (e) {
        console.error('Upstream no reader & no text:', e);
        return res.status(502).json({ error: 'Invalid upstream response (non-readable body)' });
      }
    }

    let streaming = true;
    let forwardedAny = false;
    // 累计完整上游响应，用于回退
    let accum = '';
    // SSE 行缓冲（仅保留未结束的最后一行）
    let sseBuffer = '';
    while (streaming) {
      const { done, value } = await reader.read();
      
      if (done) {
        // 如果完全没有解析到 SSE 片段，则尝试把累计文本按 JSON 或纯文本回写
        if (!forwardedAny) {
          const text = accum.trim();
          if (text.length > 0) {
            // 先尝试把整段当 JSON 解析
            let content = '';
            try {
              const json = JSON.parse(text);
              content = (
                json?.choices?.[0]?.message?.content ||
                json?.choices?.[0]?.delta?.content ||
                json?.choices?.[0]?.text ||
                json?.output_text ||
                (Array.isArray(json?.data) ? json.data[0]?.content : '') ||
                ''
              ) as string;
            } catch {
              // 如果是纯文本，直接回写
              content = text;
            }
            if (content && content.length > 0) {
              const chunkSize = 400;
              for (let i = 0; i < content.length; i += chunkSize) {
                const part = content.slice(i, i + chunkSize);
                const sseObj = { choices: [{ delta: { content: part } }] };
                res.write(`data: ${JSON.stringify(sseObj)}\n\n`);
              }
            }
          }
        }

        res.write('data: [DONE]\n\n');
        res.end();
        streaming = false;
        break;
      }

      const chunk = decoder.decode(value);
      accum += chunk;
      sseBuffer += chunk;

      // 按行消费（逐个提取以避免重复处理）
      // 逐行消费，直到没有完整的换行
      for (;;) {
        const idx = sseBuffer.indexOf('\n');
        if (idx === -1) break;
        const line = sseBuffer.slice(0, idx);
        sseBuffer = sseBuffer.slice(idx + 1);
        // 跳过空行和非data行
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;
        
        // 使用正则表达式提取data后的内容
        const data = trimmedLine.replace(/^data:\s*/, '');
        
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n');
          forwardedAny = true;
          continue;
        }

        try {
          const parsed = JSON.parse(data);
          
          // 严格只使用增量 delta.content，避免上游 message.content 或 output_text 导致重复
          const choice = Array.isArray(parsed?.choices) ? parsed.choices[0] : undefined;
          const deltaContent = choice && typeof choice.delta?.content === 'string' ? choice.delta.content : '';
          
          if (deltaContent) {
            const sseObj = { choices: [{ delta: { content: deltaContent } }] };
            res.write(`data: ${JSON.stringify(sseObj)}\n\n`);
            forwardedAny = true;
          }
        } catch (e) {
          console.error('SSE JSON parse error:', e);
          // 解析失败，不做任何处理
        }
      }
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // 如果响应还未发送，返回错误
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
