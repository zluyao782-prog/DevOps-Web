# DevOps Web

基于 Vue 3 + Vite + Element Plus 的 DevOps 管理平台。

## 功能模块

- 仪表盘：系统概览与统计
- 产品管理：产品的增删改查
- 版本管理：按产品管理版本
- 制品仓库：仓库配置管理
- 制品类别：制品类型管理
- CI/CD：GitHub Actions 工作流触发
- 用户管理：用户与权限管理

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境配置
cp .env.example .env
# 编辑 .env 填入实际配置

# 启动开发服务器
npm run dev

# 构建生产包
npm run build
```

## 技术栈

- Vue 3 (Composition API)
- Vite 5
- Element Plus
- Pinia
- Vue Router 4
- Axios
