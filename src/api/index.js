// 重新导出所有 API 模块，保持向后兼容
export * from './auth'
export * from './user'
export * from './product'
export * from './version'
export * from './repository'
export * from './cicd'
export * from './system'

// 注意：建议新开发的组件直接从对应的模块导入，例如 import { login } from '@/api/auth'
