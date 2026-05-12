# 部署 / 备案 / CDN 切换 全流程

## 当前架构

```
用户  →  language-developer.vercel.app  →  Vercel Edge Function  →  DeepSeek API
                                                ↓
                                       Upstash Redis（限流）
```

## 目标架构（备案下来后）

```
中国用户         →  xianyingqi.com  →  腾讯云 EdgeOne CDN  ┐
海外用户         →  xianyingqi.com  →  Vercel 直连           ├→ Vercel  →  DeepSeek
（DNSPod 智能解析）                                          ┘
```

---

## 1. 域名采购（今天，1 小时）

1. 注册腾讯云账号，实名（按提示传身份证）
2. 打开 https://dnspod.cloud.tencent.com/domain
3. 注册：
   - `xianyingqi.com`（首选，全拼显影器，国际通用）
   - `xianyingqi.cn`（防抢注 + 备案主域，便宜）
4. 买完两个域名都做**域名信息认证**（按提示填实名）—— 1-3 天通过

---

## 2. ICP 备案启动（今天，30 分钟操作 + 10-20 天审核）

**前置**：域名实名认证已通过。

1. 在腾讯云控制台开通**最便宜的大陆地域轻量应用服务器**（约 60 元/年，用于走备案通道，并不真跑服务）
2. 进入 https://console.cloud.tencent.com/beian
3. 新增备案：
   - 主体信息：你的身份证 + 国内手机
   - 网站信息：
     - 网站名称：**语言显影器**
     - 域名：`xianyingqi.cn`（先备 .cn，.com 可以一起或后续追加）
     - 网站内容：选「**博客 / 个人作品展示**」
     - 网站描述：「**一个帮助用户观察自己语言结构的工具型网站，提供分析和改写建议。**」
4. 上传材料：
   - 身份证正反面
   - 手持身份证照
   - 域名证书（实名通过后自动有）
5. 完成腾讯云端「**幕布拍照**」（现在改为电子化人脸识别）
6. 等通信管理局审核：10-20 个工作日

**关键避坑**：
- 网站名称**不要**含「AI / 智能 / 心理 / 治疗 / 咨询 / 诊断」
- 网站描述**不要**含敏感词、不要写"心理咨询""治疗""疗愈"
- 不要选「**论坛 / 社交 / UGC**」分类
- 用「**工具型**」「**博客**」「**个人作品**」这几个最安全

---

## 3. Vercel 侧预备（现在就做完）

### 3.1 添加自定义域名到 Vercel 项目

1. Vercel Dashboard → 项目 → **Settings → Domains**
2. 输入 `xianyingqi.com` → Add
3. Vercel 提示要加的 DNS 记录（先记下来，备案没通过前不解析）
4. 同样添加 `xianyingqi.cn`、`www.xianyingqi.com`

### 3.2 设置环境变量

在 **Settings → Environment Variables**：

| Key | Value | 备注 |
|---|---|---|
| `VITE_SITE_DOMAIN` | `xianyingqi.com` | 分享卡片底部展示用 |
| `VITE_ICP_NUMBER` | （备案号下来后填） | 留空就不显示 |
| `RATE_PER_IP_LIMIT` | `30` | 已设 |
| `RATE_GLOBAL_LIMIT` | `800` | 已设 |
| `DEEPSEEK_API_KEY` | sk-... | 已设 |

---

## 4. 备案下来后切换 CDN（30 分钟）

### 4.1 DNS 解析（DNSPod）

1. DNSPod 控制台 → 解析 `xianyingqi.com`
2. 加 CNAME：`@` → `<EdgeOne 给的目标域名>`
3. 用 **境内** 线路标签精确分流

### 4.2 配置 EdgeOne 反向代理

1. 腾讯云 EdgeOne 控制台 → 站点接入 `xianyingqi.com`
2. **源站配置**：
   - 类型：域名
   - 源站：`language-developer.vercel.app`
   - HTTPS 回源
3. **缓存配置**：
   - HTML：不缓存（保持动态）
   - 静态资源（/assets/*）：缓存 1 天
   - API（/api/*）：不缓存
4. **加速区域**：中国大陆 + 全球
5. 部署

### 4.3 在 Vercel 上加备案号

**Settings → Environment Variables → VITE_ICP_NUMBER** = `京ICP备XXXXXXXX号`（或你拿到的实际备案号）

→ Redeploy

### 4.4 主域名切换

完成验证后，把所有公开链接都更新到 `xianyingqi.com`：
- README
- 小红书发布素材
- Vercel project default domain

---

## 5. 常见问题

**Q：备案期间 Vercel 域名还能用吗？**
A：能。`language-developer.vercel.app` 一直在线。

**Q：DeepSeek API 调用会被国内 CDN 影响吗？**
A：不会。API 调用是 Vercel Edge Function 在国外发出的，国内 CDN 只代理前端流量。

**Q：备案号显示在哪？**
A：填了 `VITE_ICP_NUMBER` 后自动出现在页面 footer（免责声明下方），点击跳转 beian.miit.gov.cn。

**Q：如果备案被驳回？**
A：常见原因是网站名称含敏感词。改名（如「文字镜」「言语观察」）重新提交即可。
