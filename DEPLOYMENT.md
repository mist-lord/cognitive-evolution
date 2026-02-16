# 部署指南 (Deployment Guide)

本指南将协助您将 **认知五层测评系统 (Nono Banana Evolution)** 发布到互联网，让中国和全球的用户都能访问。

由于本项目是纯静态网页（HTML/CSS/JS），部署非常简单且成本极低。

---

## 准备工作

1.  **代码整理**：确保所有代码都在 `Cognitive-Test` 文件夹中。
2.  **GitHub 账号**：拥有一个 GitHub 账号（用于存储代码）。

---

## 方案 A：全球极速部署 (推荐 Vercel)

适合：面向全球用户，或希望最快速度上线体验。国内访问速度尚可，但偶尔不稳定。

### 步骤
1.  **上传代码到 GitHub**
    -   在 GitHub 创建一个新仓库（例如 `cognitive-evolution`）。
    -   将本地代码上传到该仓库。
2.  **注册/登录 Vercel**
    -   访问 [vercel.com](https://vercel.com/)。
    -   使用 GitHub 账号直接登录。
3.  **新建项目**
    -   点击 "Add New..." -> "Project"。
    -   在列表中找到你刚才创建的 GitHub 仓库，点击 "Import"。
4.  **配置与部署**
    -   **Framework Preset**: 选择 `Other` (因为我们是纯静态 HTML)。
    -   **Root Directory**: 如果代码都在根目录，保持默认 `./` 即可。
    -   点击 **Deploy**。
5.  **完成**
    -   Vercel 会自动分配一个域名（例如 `cognitive-evolution.vercel.app`）。
    -   你可以将这个链接分享给朋友，立刻就能访问！

---

## 方案 B：中国区优化部署 (腾讯云/阿里云)

适合：主要面向中国大陆用户，追求极致访问速度，且需要在微信内流畅分享。

### 选项 1：腾讯云 Webify (最简单)
1.  访问 [腾讯云 Webify](https://cloud.tencent.com/product/webify)。
2.  点击"新建应用" -> "从代码仓库导入"。
3.  授权绑定 GitHub，选择你的仓库。
4.  部署完成后，腾讯云会提供一个测试域名。
5.  *(进阶)*：绑定你自己的已备案域名（如 `test.yourdomain.com`），以防止微信拦截。

### 选项 2：对象存储 OSS/COS 静态托管
1.  **购买/开通**：阿里云 OSS 或 腾讯云 COS。
2.  **上传**：下载 OSS Browser 或使用控制台，将所有文件（`index.html`, `assets/`, `styles.css` 等）上传到 Bucket 根目录。
3.  **开启静态网站托管**：在 Bucket 设置中找到"静态网站托管"，将默认首页设置为 `index.html`。
4.  **绑定域名**：绑定已备案的自定义域名并开启 CDN 加速。

---

## 方案 C：Gitee Pages (国内免费)

适合：没有服务器预算，但希望国内访问比 GitHub Pages 快。

1.  注册 [Gitee (码云)](https://gitee.com/)。
2.  新建仓库，将代码上传。
3.  进入仓库页面 -> "服务" -> "Gitee Pages"。
4.  点击"启动"即可获得类似 `https://yourname.gitee.io/project` 的链接。
    *   *注意：Gitee Pages 现已需要实名认证，且有时会暂停服务，建议作为备选。*

---

## 特别注意：微信分享

要在微信中分享时显示自定义标题和图片（而不是只有链接），您需要：
1.  拥有一个**已备案的域名**。
2.  拥有一个**认证的微信公众号**。
3.  在后端实现微信 JSSDK 的签名接口（这需要服务器支持）。

*目前的纯静态版本在微信中分享，会显示网页标题，但可能不会显示自定义的小图标。如果需要完美体验，建议后续升级为 Next.js 或接入后端服务。*
