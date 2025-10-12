# 🤖 AI防骗助手 - 部署和配置指南

## 📋 功能概览

SafeCareer AI防骗助手是一个专注于求职防骗领域的智能助手，具备以下能力：

- ✅ **智能对话**：自然语言交互，解答防骗疑问
- ✅ **风险评估**：分析招聘信息真伪，识别诈骗特征
- ✅ **案例引用**：基于13个真实案例提供建议
- ✅ **流式响应**：打字机效果，实时展示AI回复
- ✅ **对话历史**：本地存储，保护隐私
- ✅ **快速提问**：预设常见问题模板

---

## 🚀 快速部署

### 1. 在Vercel配置环境变量

在Vercel项目后台的 **Settings** → **Environment Variables** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `AI_API_KEY` | `sk-tpU6wpoVjQqQbPP4L56IB5G6SKE1ZiehCjpvsmovzGbuJSI2` | API密钥（已提供） |
| `AI_BASE_URL` | `https://newapi.ximilala.com` | API基础URL |
| `AI_MODEL` | `ollama/deepseek-v3.1:671b` | 使用的模型 |

> ⚠️ **安全提示**：这些变量只在服务端使用，不会暴露给前端！

### 2. 部署到Vercel

```bash
# 方式1：通过Git推送
git add .
git commit -m "feat: 添加AI防骗助手"
git push

# 方式2：使用Vercel CLI
vercel --prod
```

部署完成后，AI助手会自动在所有页面右下角显示悬浮按钮。

---

## 🏗️ 项目架构

```
├── api/
│   └── chat.ts                 # Vercel Serverless API端点
├── src/
│   ├── components/
│   │   └── AIAssistant/
│   │       ├── index.tsx       # 主组件入口
│   │       ├── ChatWindow.tsx  # 聊天窗口
│   │       ├── MessageBubble.tsx  # 消息气泡
│   │       ├── FloatingButton.tsx # 悬浮按钮
│   │       └── QuickQuestions.tsx # 快速提问
│   ├── hooks/
│   │   └── useAIChat.ts        # 聊天逻辑Hook
│   ├── utils/
│   │   └── aiService.ts        # API调用封装
│   └── types/
│       └── chat.ts             # TypeScript类型定义
```

---

## 🔧 核心技术实现

### 1. Vercel Serverless API

**api/chat.ts** 作为代理层：
- ✅ 隐藏API Key，保护安全
- ✅ 处理流式响应（SSE）
- ✅ 注入专业系统提示词
- ✅ 错误处理和重试机制

### 2. 流式响应处理

使用Server-Sent Events (SSE)实现打字机效果：

```typescript
// 前端：监听SSE流
const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  onChunk(chunk); // 实时更新UI
}
```

### 3. 系统提示词

基于**案例.md**中的13个真实诈骗案例，设计了专业的系统提示词：

- 📚 **知识库**：8000万特大招聘诈骗、培训贷、黑中介、刷单等案例
- 🎯 **能力定义**：风险分析、特征识别、防范建议、案例引用
- 💬 **交互风格**：友善专业、具体务实、结构清晰

### 4. 本地存储

使用localStorage保存对话历史：
- 刷新页面不丢失对话
- 用户可随时清空历史
- 完全本地化，保护隐私

---

## 🎨 UI/UX设计

### Neumorphic设计风格

延续SafeCareer整体设计，采用新拟态风格：

```css
/* 外凸效果 */
shadow: [5px_5px_15px_rgba(0,0,0,0.08), -5px_-5px_15px_rgba(255,255,255,0.8)]

/* 内凹效果 */
shadow: [inset_3px_3px_6px_rgba(0,0,0,0.05), inset_-3px_-3px_6px_rgba(255,255,255,0.7)]
```

### 响应式适配

- 桌面端：420x600px 聊天窗口
- 移动端：自动适配屏幕宽度
- 触摸优化：增大点击区域

---

## 🧪 测试清单

### 功能测试

- [ ] 悬浮按钮正常显示和点击
- [ ] 聊天窗口正常打开/关闭
- [ ] 发送消息并接收AI回复
- [ ] 流式响应打字效果
- [ ] Markdown格式渲染
- [ ] 快速提问按钮工作
- [ ] 清空历史功能
- [ ] 重试功能
- [ ] 对话历史持久化

### 性能测试

- [ ] API响应速度 < 2秒
- [ ] 流式响应流畅无卡顿
- [ ] 长对话列表滚动流畅
- [ ] 内存占用正常

### 兼容性测试

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] 移动端浏览器

---

## 🐛 常见问题

### Q1: AI助手不显示？

**检查步骤**：
1. 确认Vercel环境变量已配置
2. 检查浏览器控制台是否有错误
3. 确认API端点 `/api/chat` 可访问

### Q2: API返回401错误？

**原因**：API Key配置错误

**解决**：
1. 检查Vercel环境变量 `AI_API_KEY` 是否正确
2. 重新部署项目：`vercel --prod`

### Q3: 消息发送后没有响应？

**检查步骤**：
1. 打开浏览器开发者工具 → Network
2. 查看 `/api/chat` 请求状态
3. 检查响应内容是否有错误信息

### Q4: 如何更换AI模型？

修改Vercel环境变量 `AI_MODEL` 的值，例如：
- `ollama/deepseek-v3.1:671b` （当前）
- `gpt-4o-mini` （如果API支持）

---

## 📈 未来优化方向

### 短期（1周内）
- [ ] 添加更多快速提问模板
- [ ] 优化系统提示词
- [ ] 添加"正在输入"动画
- [ ] 支持图片上传（截图识别）

### 中期（1个月内）
- [ ] 风险评估可视化（评分卡）
- [ ] 案例关联跳转
- [ ] 多轮对话上下文优化
- [ ] 用户反馈收集

### 长期（3个月内）
- [ ] 云端对话历史同步
- [ ] 个性化推荐
- [ ] 多语言支持
- [ ] 语音输入/输出

---

## 💡 开发者贴士

### 修改系统提示词

编辑 `api/chat.ts` 中的 `SYSTEM_PROMPT` 常量：

```typescript
const SYSTEM_PROMPT = `你是SafeCareer的AI防骗顾问...`;
```

### 调整流式响应速度

修改API请求参数：

```typescript
temperature: 0.7,  // 降低可使回复更稳定
max_tokens: 2000,  // 控制回复长度
```

### 自定义快速提问

编辑 `src/components/AIAssistant/QuickQuestions.tsx`：

```typescript
const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: 'custom',
    label: '自定义问题',
    prompt: '具体问题内容',
    icon: 'help',
  },
];
```

---

## 📞 技术支持

如有问题，请查看：
- 🔗 [React Markdown文档](https://github.com/remarkjs/react-markdown)
- 🔗 [Vercel Serverless Functions](https://vercel.com/docs/functions)
- 🔗 [OpenAI API兼容格式](https://platform.openai.com/docs/api-reference)

---

**祝你使用愉快！🎉**

