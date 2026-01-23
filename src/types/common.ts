/**
 * 通用类型定义
 */

/**
 * 通用响应包装
 */
export interface ApiResponse<T = any> {
  data: T
  message?: string
  code?: number
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 选项类型（用于下拉框等）
 */
export interface Option<T = string> {
  label: string
  value: T
  disabled?: boolean
}
