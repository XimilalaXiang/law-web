# 🔐 环境变量配置指南

## Vercel 环境变量配置（必需）

在 Vercel 项目设置中添加以下环境变量：

### 步骤

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `AI_API_KEY` | `sk-tpU6wpoVjQqQbPP4L56IB5G6SKE1ZiehCjpvsmovzGbuJSI2` | Production, Preview, Development |
| `AI_BASE_URL` | `https://newapi.ximilala.com` | Production, Preview, Development |
| `AI_MODEL` | `ollama/deepseek-v3.1:671b` | Production, Preview, Development |

### 截图示例

```
Variable name: AI_API_KEY
Value: sk-tpU6wpoVjQqQbPP4L56IB5G6SKE1ZiehCjpvsmovzGbuJSI2
Environments: ☑ Production ☑ Preview ☑ Development
```

### 验证配置

配置完成后，重新部署项目：

```bash
git push  # 或
vercel --prod
```

---

## 本地开发配置（可选）

如果需要在本地测试AI助手功能，可以创建 `.env.local` 文件：

```bash
# .env.local（不要提交到Git）
AI_API_KEY=sk-tpU6wpoVjQqQbPP4L56IB5G6SKE1ZiehCjpvsmovzGbuJSI2
AI_BASE_URL=https://newapi.ximilala.com
AI_MODEL=ollama/deepseek-v3.1:671b
```

然后启动开发服务器：

```bash
pnpm dev
```

---

## 🔒 安全提示

- ✅ **API Key 只在服务端使用**，永远不会暴露给前端
- ✅ **使用 Vercel Serverless Functions** 作为代理层
- ✅ **不要将 .env.local 提交到 Git**（已在 .gitignore 中配置）
- ⚠️ **定期更换 API Key** 以提高安全性

---

## 📝 注意事项

1. 环境变量修改后需要**重新部署**才能生效
2. Preview 部署也会使用这些环境变量
3. 如果AI助手无法使用，首先检查环境变量是否正确配置

