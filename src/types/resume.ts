/**
 * Resume相关类型定义
 * 与后端API模型保持一致
 */

// 个人信息
export interface PersonalInfo {
  name: string
  email: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  summary?: string
}

// 教育经历
export interface Education {
  school: string
  degree: string
  major: string
  start_date: string
  end_date?: string
  gpa?: string
  achievements?: string[]
}

// 工作经历
export interface WorkExperience {
  company: string
  position: string
  start_date: string
  end_date?: string
  location?: string
  responsibilities?: string[]
  achievements?: string[]
}

// 项目经历
export interface ProjectExperience {
  name: string
  role: string
  start_date?: string
  end_date?: string
  description: string
  technologies?: string[]
  achievements?: string[]
}

// 技能
export interface Skill {
  category: string
  items: string[]
  proficiency?: string
}

// 证书
export interface Certificate {
  name: string
  issuer: string
  date?: string
  credential_id?: string
  credential_url?: string
}

// 简历数据
export interface ResumeData {
  personal_info: PersonalInfo
  education: Education[]
  work_experience: WorkExperience[]
  project_experience: ProjectExperience[]
  skills: Skill[]
  certificates: Certificate[]
  languages?: Array<Record<string, string>>
  awards?: string[]
  publications?: string[]
  volunteer_experience?: Array<Record<string, any>>
}

// 优化建议
export interface OptimizationSuggestion {
  category: string
  priority: string
  description: string
  original_text?: string
  suggested_text?: string
}

// 优化结果
export interface OptimizationResult {
  optimized_resume: ResumeData
  suggestions: OptimizationSuggestion[]
  score?: number
  score_breakdown?: Record<string, number>
  optimization_level: string
  timestamp: string
}

// 模板信息
export interface TemplateInfo {
  id: string
  name: string
  description: string
  category: string
  preview_url?: string
  file_path: string
  supported_sections: string[]
}

// API请求/响应类型
export interface ParseResumeRequest {
  file_name: string
  file_format: string
}

export interface ParseResumeResponse {
  success: boolean
  message: string
  data?: ResumeData
  parse_time: number
}

export interface OptimizeResumeRequest {
  resume_data: ResumeData
  job_description?: string
  optimization_level?: string
}

export interface OptimizeResumeResponse {
  success: boolean
  message: string
  data?: OptimizationResult
  optimization_time: number
}

export interface GenerateResumeRequest {
  resume_data: ResumeData
  template_id: string
  output_format?: string
}

export interface GenerateResumeResponse {
  success: boolean
  message: string
  file_id?: string
  file_path?: string
  download_url?: string
  preview_url?: string
  generation_time: number
}

export interface ListTemplatesResponse {
  success: boolean
  message: string
  templates: TemplateInfo[]
}
