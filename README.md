# 日语学习助手

一个专注于五十音图和单词默写练习的简单高效日语学习工具。

## 功能特点

- 五十音图默写练习
- 自定义单词表上传和默写
- 多种排版格式选择

## 部署到GitHub Pages

本项目已配置为可直接部署到GitHub Pages，无需安装额外插件。

### 部署步骤

1. Fork本仓库
2. 在仓库设置中启用GitHub Pages，选择gh-pages分支
3. 将代码推送到main分支，GitHub Actions将自动构建并部署

### 配置说明

部署前请修改以下文件中的配置：

1. package.json中的"homepage"字段
2. vite.config.ts中的base配置
3. src/main.tsx中的BrowserRouter basename
4. 404.html中的重定向路径

将上述文件中的"/your-repo-name"替换为你的GitHub仓库名称。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```