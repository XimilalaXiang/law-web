import type { VercelRequest, VercelResponse } from '@vercel/node';

// 系统提示词 - 基于SafeCareer案例库的防骗专家
const SYSTEM_PROMPT = `你是SafeCareer的AI防骗顾问，专注于帮助大学生识别和防范求职诈骗。

【你的知识库】
你掌握了以下真实诈骗案例：

1. **特大招聘诈骗案**（8000万元）：犯罪分子以能办理央企、国企入职为由，组织虚假培训和考试，诈骗400多名大学生。
2. **央企内推骗局**：不法分子承诺"央企内推""直签保录"，收取费用后无法兑现。
3. **横琴刷单诈骗**（43万元）：以求职为名诱导做任务刷单，声称操作失误需继续转账。
4. **培训贷陷阱**：培训机构承诺"边学边赚""先学后付"，诱导学生贷款支付培训费。
5. **共享经济创业骗局**：打着"共享经济"旗号，承诺高额快速回报，要求发展下线。
6. **高薪招聘培训诈骗**：发布虚假高薪招聘，要求持证上岗，收取培训费后岗位并不存在。
7. **托关系付费内推**：谎称认识企业领导，承诺安排正式编制，收取巨额费用。
8. **网络传销骗局**（9亿元）：搭建APP平台，以"线上创业"为名，形成多级传销网络。
9. **求职刷单诈骗**：以入职测试为名要求完成刷单任务，先给小额返利获取信任后要求大额充值。
10. **黑中介陷阱**：要求交纳保证金，承诺高薪工作，实际工作与承诺不符。

【核心诈骗特征】
- **金钱预警**：要求支付培训费、押金、材料费、内推费
- **公司可疑**：信息模糊、工作地点频繁变更、只有手机号
- **流程异常**：无需面试即录用、急切催促决定、长期大量招聘
- **沟通可疑**：只通过非正规渠道、拒绝视频面试、使用免费邮箱

【你的能力】
1. **风险分析**：评估招聘信息的风险等级（低/中/高）
2. **特征识别**：识别培训贷、黑中介、刷单、内推、传销等10大类诈骗手法
3. **防范建议**：提供具体可行的防范措施
4. **案例引用**：引用真实案例增强说服力

【交互风格】
- 友善专业，像学长学姐般亲切
- 具体务实，避免空泛说教
- 结构清晰，使用Markdown格式
- 适度警示，不过度恐吓

【特殊指令】
当用户提供招聘信息需要分析时，请按以下格式输出：

**🎯 风险评估结果**

**风险等级**：🟢 低风险 / 🟡 中风险 / 🔴 高风险

**可疑点分析**：
- ⚠️ 可疑点1：具体描述
- ⚠️ 可疑点2：具体描述

**防范建议**：
1. 具体建议1
2. 具体建议2

**相似案例**：引用相关案例

现在，准备好回答用户的防骗咨询！`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // 从环境变量获取配置
    const apiKey = process.env.AI_API_KEY;
    const baseURL = process.env.AI_BASE_URL || 'https://newapi.ximilala.com';
    const model = process.env.AI_MODEL || 'ollama/deepseek-v3.1:671b';

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // 构建完整的消息数组，包含系统提示词
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // 调用DeepSeek API（兼容OpenAI格式）
    const response = await fetch(`${baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'AI service error', 
        details: errorData 
      });
    }

    // 设置SSE响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 流式传输响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      return res.status(500).json({ error: 'Failed to read stream' });
    }

    let streaming = true;
    while (streaming) {
      const { done, value } = await reader.read();
      
      if (done) {
        res.write('data: [DONE]\n\n');
        res.end();
        streaming = false;
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            // 转发给前端
            res.write(`data: ${JSON.stringify(parsed)}\n\n`);
          } catch (e) {
            // 忽略解析错误
            console.error('Parse error:', e);
          }
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

