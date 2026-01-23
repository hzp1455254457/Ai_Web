/**
 * Store类型定义
 */

/**
 * Store状态基础接口
 */
export interface StoreState {
  loading: boolean
  error: string | null
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
}
