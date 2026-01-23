/**
 * 常量定义
 */

// API相关常量
export const API_TIMEOUT = 30000 // 30秒
export const API_RETRY_COUNT = 3 // 重试次数

// 流式响应相关
export const STREAM_CHUNK_DELIMITER = '\n\n'
export const STREAM_DATA_PREFIX = 'data: '
export const STREAM_DONE_MARKER = '[DONE]'

// 分页相关
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// 文件上传相关
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// 消息相关
export const MAX_MESSAGE_LENGTH = 10000
export const MAX_MESSAGES_HISTORY = 100
