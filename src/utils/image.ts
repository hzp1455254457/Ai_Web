/**
 * 图片文件处理工具函数
 */

/**
 * 支持的图片格式
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]

/**
 * 最大文件大小（10MB）
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * 文件验证错误类型
 */
export interface FileValidationError {
  type: 'format' | 'size' | 'unknown'
  message: string
}

/**
 * 验证图片文件
 * @param file 文件对象
 * @returns 验证结果，如果通过返回null，否则返回错误信息
 */
export function validateImageFile(file: File): FileValidationError | null {
  // 验证文件类型
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      type: 'format',
      message: `不支持的图片格式。支持的格式：${SUPPORTED_IMAGE_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}`,
    }
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    return {
      type: 'size',
      message: `文件大小超过限制。最大大小：${formatFileSize(MAX_FILE_SIZE)}`,
    }
  }

  return null
}

/**
 * 将文件转换为Base64字符串
 * @param file 文件对象
 * @returns Promise<string> Base64字符串（包含data URL前缀）
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('文件读取失败：无法转换为Base64字符串'))
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 从Base64字符串中提取纯Base64数据（移除data URL前缀）
 * @param dataUrl Base64数据URL（如 "data:image/png;base64,iVBORw0KG..."）
 * @returns 纯Base64字符串
 */
export function extractBase64FromDataUrl(dataUrl: string): string {
  // 移除 "data:image/xxx;base64," 前缀
  const base64Index = dataUrl.indexOf(',')
  if (base64Index === -1) {
    return dataUrl
  }
  return dataUrl.substring(base64Index + 1)
}

/**
 * 格式化文件大小（从format.ts导入，避免循环依赖）
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 创建图片预览URL
 * @param file 文件对象
 * @returns Promise<string> 预览URL（Object URL）
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('无法创建图片预览'))
      }
    }

    reader.onerror = () => {
      reject(new Error('图片预览创建失败'))
    }

    reader.readAsDataURL(file)
  })
}
