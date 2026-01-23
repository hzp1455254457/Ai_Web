/**
 * 前端日志工具
 * 将日志输出到文件和控制台
 */

interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  data?: any
  source?: string
}

class FrontendLogger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private logToFile = true

  constructor() {
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined') {
      // 定期保存日志到文件
      setInterval(() => this.flushLogs(), 5000) // 每5秒保存一次
      
      // 页面卸载时保存日志
      window.addEventListener('beforeunload', () => {
        this.flushLogs()
      })
    }
  }

  private formatMessage(level: string, message: string, data?: any, source?: string): string {
    const timestamp = new Date().toISOString()
    const logEntry: LogEntry = {
      timestamp,
      level: level as any,
      message,
      data,
      source,
    }
    
    this.logs.push(logEntry)
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
    
    // 控制台输出
    const consoleMessage = `[${timestamp}] [${level.toUpperCase()}]${source ? ` [${source}]` : ''} ${message}`
    const consoleMethod = console[level as 'log' | 'info' | 'warn' | 'error'] || console.log
    if (data) {
      consoleMethod(consoleMessage, data)
    } else {
      consoleMethod(consoleMessage)
    }
    
    return JSON.stringify(logEntry)
  }

  private async flushLogs() {
    if (!this.logToFile || this.logs.length === 0) return
    
    try {
      const logsToSave = [...this.logs]
      this.logs = [] // 清空已保存的日志
      
      // 发送到后端保存（通过API）
      // 注意：使用完整路径，Vite代理会自动转发到后端
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'
      const response = await fetch(`${apiBaseUrl}/agent/logs/frontend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logsToSave }),
      }).catch(() => null) // 忽略错误，避免循环
      
      if (!response || !response.ok) {
        // 如果后端不可用，尝试使用localStorage作为备用
        const existingLogs = localStorage.getItem('frontend_logs') || '[]'
        const parsedLogs = JSON.parse(existingLogs)
        parsedLogs.push(...logsToSave)
        // 只保留最近1000条
        if (parsedLogs.length > 1000) {
          parsedLogs.splice(0, parsedLogs.length - 1000)
        }
        localStorage.setItem('frontend_logs', JSON.stringify(parsedLogs))
      }
    } catch (error) {
      // 静默失败，避免影响应用
      console.warn('Failed to save logs:', error)
    }
  }

  debug(message: string, data?: any, source?: string) {
    this.formatMessage('debug', message, data, source)
  }

  info(message: string, data?: any, source?: string) {
    this.formatMessage('info', message, data, source)
  }

  warn(message: string, data?: any, source?: string) {
    this.formatMessage('warn', message, data, source)
  }

  error(message: string, data?: any, source?: string) {
    this.formatMessage('error', message, data, source)
  }

  // 手动保存日志
  async save() {
    await this.flushLogs()
  }

  // 获取所有日志
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // 清空日志
  clear() {
    this.logs = []
  }
}

// 导出单例
export const logger = new FrontendLogger()
