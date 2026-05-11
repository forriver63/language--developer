# 语言显影器 / Language Developer

把一句让你卡住的话，拆出其中的推导链、隐藏前提、绑定关系，并给出四层重构。

**不是**心理咨询、宗教或道德判断工具——只是帮你看见语言结构。

## 本地开发

1. 拷贝环境变量
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local，填入 DEEPSEEK_API_KEY
   ```
2. 安装并启动
   ```bash
   npm install
   npm run dev
   ```
3. 打开 http://localhost:5173/

## 部署到 Vercel

### 方式一：GitHub + Vercel Dashboard（推荐）

1. 推到 GitHub：
   ```bash
   git add .
   git commit -m "init"
   git remote add origin git@github.com:<your-name>/<repo>.git
   git push -u origin main
   ```
2. 打开 https://vercel.com/new → Import 你的仓库
3. 框架自动识别为 Vite（已配 `vercel.json`），点 **Deploy**
4. 部署完进入 Project → **Settings → Environment Variables**，添加：
   - Key：`DEEPSEEK_API_KEY`
   - Value：你的 DeepSeek key
   - Environments：Production / Preview / Development 都勾上
5. 点 **Deployments → Redeploy** 让环境变量生效

### 方式二：Vercel CLI

```bash
npm i -g vercel
vercel link        # 关联项目
vercel env add DEEPSEEK_API_KEY production
vercel --prod      # 部署
```

## 架构

- 前端：Vite + React + TS + Tailwind（纯静态）
- 后端：单个 Edge Function `api/develop.ts`，调用 DeepSeek `deepseek-chat`（JSON 模式）
- 数据：v1 不存储任何用户文本

## 国内访问

Vercel 大部分时间在国内可访问。如果要做大规模国内传播，可以：
1. 申请备案域名 → 迁移到腾讯云 EdgeOne Pages（国内 CDN + Functions）
2. 或者保留 Vercel，再加 Cloudflare 镜像备份

## 隐私

- DeepSeek key 只存在服务端环境变量，永远不会到浏览器
- 用户输入经过 Vercel Edge Function 转发到 DeepSeek，**不被持久化**
- 没有数据库、没有日志、没有用户追踪
