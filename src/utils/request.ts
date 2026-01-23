/**
 * 请求工具函数
 * 提供常用的请求处理工具
 */

/**
 * 构建查询字符串
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })
  return searchParams.toString()
}

/**
 * 检查响应是否成功
 */
export function isSuccessResponse(status: number): boolean {
  return status >= 200 && status < 300
}

/**
 * 格式化错误消息
 */
export function formatErrorMessage(error: any): string {
  if (error?.response?.data?.detail) {
    return error.response.data.detail
  }
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  if (error?.message) {
    return error.message
  }
  return '未知错误'
}
