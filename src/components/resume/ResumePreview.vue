<template>
  <div class="resume-preview">
    <h3>简历预览</h3>
    
    <div v-if="resumeData" class="resume-preview__content">
      <!-- 个人信息 -->
      <div class="preview-section">
        <h4>{{ resumeData.personal_info.name }}</h4>
        <div class="preview-info">
          <span v-if="resumeData.personal_info.email">📧 {{ resumeData.personal_info.email }}</span>
          <span v-if="resumeData.personal_info.phone">📞 {{ resumeData.personal_info.phone }}</span>
          <span v-if="resumeData.personal_info.location">📍 {{ resumeData.personal_info.location }}</span>
        </div>
        <p v-if="resumeData.personal_info.summary" class="preview-summary">
          {{ resumeData.personal_info.summary }}
        </p>
      </div>

      <!-- 教育经历 -->
      <div v-if="resumeData.education.length > 0" class="preview-section">
        <h4>教育经历</h4>
        <div 
          v-for="(edu, index) in resumeData.education" 
          :key="index"
          class="preview-item"
        >
          <div class="preview-item__header">
            <strong>{{ edu.school }}</strong>
            <span class="preview-item__date">{{ edu.start_date }} - {{ edu.end_date || '至今' }}</span>
          </div>
          <p>{{ edu.degree }} · {{ edu.major }}</p>
          <p v-if="edu.gpa">GPA: {{ edu.gpa }}</p>
        </div>
      </div>

      <!-- 工作经历 -->
      <div v-if="resumeData.work_experience.length > 0" class="preview-section">
        <h4>工作经历</h4>
        <div 
          v-for="(work, index) in resumeData.work_experience" 
          :key="index"
          class="preview-item"
        >
          <div class="preview-item__header">
            <strong>{{ work.company }} · {{ work.position }}</strong>
            <span class="preview-item__date">{{ work.start_date }} - {{ work.end_date || '至今' }}</span>
          </div>
          <ul v-if="work.responsibilities && work.responsibilities.length > 0" class="preview-list">
            <li v-for="(resp, i) in work.responsibilities" :key="i">{{ resp }}</li>
          </ul>
        </div>
      </div>

      <!-- 项目经历 -->
      <div v-if="resumeData.project_experience.length > 0" class="preview-section">
        <h4>项目经历</h4>
        <div 
          v-for="(project, index) in resumeData.project_experience" 
          :key="index"
          class="preview-item"
        >
          <div class="preview-item__header">
            <strong>{{ project.name }}</strong>
            <span v-if="project.role" class="preview-item__role">{{ project.role }}</span>
          </div>
          <p>{{ project.description }}</p>
          <div v-if="project.technologies && project.technologies.length > 0" class="preview-tags">
            <span 
              v-for="(tech, i) in project.technologies" 
              :key="i"
              class="preview-tag"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <!-- 技能 -->
      <div v-if="resumeData.skills.length > 0" class="preview-section">
        <h4>技能</h4>
        <div 
          v-for="(skill, index) in resumeData.skills" 
          :key="index"
          class="preview-item"
        >
          <strong>{{ skill.category }}：</strong>
          <span>{{ skill.items.join('、') }}</span>
        </div>
      </div>
    </div>

    <div v-else class="resume-preview__empty">
      暂无简历数据
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resumeData: ResumeData | null
}>()
</script>

<style scoped>
.resume-preview h3 {
  margin-bottom: 16px;
  color: var(--text-primary, #333);
  font-size: 16px;
}

.resume-preview__content {
  max-height: 600px;
  overflow-y: auto;
  padding: 16px;
  background: var(--bg-secondary, #f9f9f9);
  border-radius: 4px;
}

.preview-section {
  margin-bottom: 24px;
}

.preview-section h4 {
  font-size: 18px;
  color: var(--text-primary, #333);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
}

.preview-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-secondary, #666);
}

.preview-summary {
  font-size: 14px;
  color: var(--text-primary, #333);
  line-height: 1.6;
  margin-top: 8px;
}

.preview-item {
  margin-bottom: 16px;
}

.preview-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.preview-item__date {
  font-size: 12px;
  color: var(--text-secondary, #666);
}

.preview-item__role {
  font-size: 12px;
  color: var(--text-secondary, #666);
  font-style: italic;
}

.preview-list {
  margin: 8px 0 0 20px;
  padding: 0;
}

.preview-list li {
  font-size: 13px;
  color: var(--text-primary, #333);
  margin-bottom: 4px;
  line-height: 1.5;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.preview-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--bg-primary, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 3px;
  color: var(--text-secondary, #666);
}

.resume-preview__empty {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary, #666);
}
</style>
