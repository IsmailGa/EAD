<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useDocumentStore } from '@/stores/documentStore'
// Удаляем импорты кастомных компонентов

const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const documentStore = useDocumentStore()

// реактивные состояния
const loading = ref(true)
const documentsLoading = ref(false)
const error = ref(null)
const documentsError = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// вычисляемые свойства
const employee = computed(() => employeeStore.employee)
const employeeFullName = computed(() => employeeStore.getEmployeeFullName)
const employeeInitials = computed(() => employeeStore.getEmployeeInitials)
const isEmployeeActive = computed(() => employeeStore.isEmployeeActive)

const documents = computed(() => documentStore.documents || [])
const totalDocuments = computed(() => documentStore.total || 0)
const totalPages = computed(() => Math.ceil(totalDocuments.value / itemsPerPage.value))

const employeeId = computed(() => route.params.id)

// методы
const fetchEmployee = async () => {
  try {
    loading.value = true
    error.value = null
    await employeeStore.fetchEmployee(employeeId.value)
  } catch (err) {
    error.value = err.message || 'Failed to fetch employee'
    console.error('Error fetching employee:', err)
  } finally {
    loading.value = false
  }
}

const fetchDocuments = async (page = 1) => {
  try {
    documentsLoading.value = true
    documentsError.value = null
    await documentStore.fetchDocuments(page, itemsPerPage.value, employeeId.value)
    currentPage.value = page
  } catch (err) {
    documentsError.value = err.message || 'Failed to fetch documents'
    console.error('Error fetching documents:', err)
  } finally {
    documentsLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  return new Date(dateString).toLocaleDateString('ru-Ru', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDocumentIcon = (type) => {
  const icons = {
    invoice: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    'power-of-attorney': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    pdf: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    excel: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    image: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 1 2 2h14a2 2 0 0 0 2-2z'
  }
  return icons[type] || icons.pdf
}

const getDocumentTypeName = (type) => {
  const typeNames = {
    'invoice': 'INVOICE',
    'power-of-attorney': 'POWER OF ATTORNEY',
    'pdf': 'PDF',
    'doc': 'DOCUMENT',
    'excel': 'SPREADSHEET',
    'image': 'IMAGE'
  }
  return typeNames[type] || type?.toUpperCase() || 'DOCUMENT'
}

const viewDocument = (document) => {
  if (!document.id) {
    return
  }
  router.push(`/documents/${document.id}`)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchDocuments(page)
  }
}

const goBack = () => {
  employeeStore.clearEmployee()
  router.push('/employees')
}

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchEmployee()
    fetchDocuments()
  }
})

// Lifecycle
onMounted(() => {
  fetchEmployee()
  fetchDocuments()
})
</script>

<template>
  <div class="employee-profile">
    <div class="container">
      <!-- Навигация назад -->
      <div class="nav-section">
        <v-btn variant="text" color="primary" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          Назад к сотрудникам
        </v-btn>
      </div>

      <!-- Скелетон загрузки профиля -->
      <div v-if="loading" class="loading-container">
        <v-skeleton-loader type="card" :loading="true" :count="1" />
      </div>

      <!-- Ошибка загрузки -->
      <div v-else-if="error" class="error-container">
        <v-alert type="error" prominent border="start" :text="error" @click:close="fetchEmployee" closable />
      </div>

      <!-- Профиль сотрудника -->
      <div v-else-if="employee" class="profile-content">
        <!-- Header сотрудника -->
        <div class="employee-header">
          <div class="employee-avatar-large" :class="{ 'inactive': !isEmployeeActive }">
            <span>{{ employeeInitials }}</span>
          </div>

          <div class="employee-main-info">
            <div class="employee-name-section">
              <h1 class="employee-name">{{ employeeFullName }}</h1>
              <span v-if="!isEmployeeActive" class="status-badge inactive">Inactive</span>
              <span v-else class="status-badge active">Active</span>
            </div>

            <div class="employee-details">
              <div class="detail-item">
                <v-icon size="16">mdi-account</v-icon>
                <span>ID: {{ employee.id }}</span>
              </div>
              <!-- Можно добавить другие детали -->
            </div>
          </div>
        </div>

        <!-- Секция документов сотрудника -->
        <div class="documents-section">
          <div class="section-header">
            <h2 class="section-title">
              <v-icon>mdi-file-document</v-icon>
              Документы
            </h2>
          </div>
          <!-- Скелетон документов -->
          <div v-if="documentsLoading" class="documents-skeleton">
            <v-skeleton-loader type="card" :loading="true" :count="3" />
          </div>
          <!-- Ошибка документов -->
          <div v-else-if="documentsError" class="documents-error">
            <v-alert type="error" prominent border="start" :text="documentsError" @click:close="fetchDocuments"
              closable />
          </div>
          <!-- Список документов -->
          <div v-else class="documents-content">
            <div v-if="totalDocuments > 0" class="documents-info">
              <span class="documents-count">{{ totalDocuments }} документ{{ totalDocuments > 1 ? 'ы' : '' }}
                нашлось</span>
              <span v-if="totalPages > 1" class="page-info">Страница {{ currentPage }} из {{ totalPages }}</span>
            </div>
            <!-- Пустое состояние -->
            <div v-if="documents.length === 0" class="documents-empty">
              <v-alert type="info" border="start" prominent
                text="Документы не найдены. У этого сотрудника ещё нет документов." />
            </div>
            <!-- Сетка документов -->
            <div v-if="documents.length > 0" class="documents-grid">
              <div v-for="document in documents" :key="document.id" class="document-card">
                <div class="document-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path :d="getDocumentIcon(document.type)" />
                    <polyline v-if="!['image', 'power-of-attorney'].includes(document.type)" points="14,2 14,8 20,8" />
                  </svg>
                </div>
                <div class="document-info">
                  <h3 class="document-title">{{ document.number || document.title || document.name || 'Безымянный документ' }}</h3>
                  <p class="document-type">{{ getDocumentTypeName(document.type) }}</p>
                  <p class="document-date">{{ formatDate(document.date || document.createdAt || document.uploadDate) }}
                  </p>
                  <p v-if="document.description" class="document-description">{{ document.description }}</p>
                  <p v-if="document.attorneyFullName" class="document-attorney">Доверенный: {{ document.attorneyFullName
                  }}</p>
                  <p v-if="document.invoiceType" class="document-invoice-type">Тип: {{ document.invoiceType }}</p>
                </div>
                <div class="document-actions">
                  <v-btn icon variant="text" color="primary" @click="viewDocument(document)"
                    :title="'Просмотр документа'">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
            <!-- Пагинация -->
            <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" @input="goToPage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-profile {
  width: 100%;
  padding-top: 30px;
}

/* Navigation */
.nav-section {
  margin-bottom: 32px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color-light);
  transition: all 0.2s ease;
}

.back-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: rgba(72, 101, 255, 0.06);
}

/* Loading Skeleton */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.profile-skeleton {
  width: 100%;
  max-width: 800px;
}

.skeleton-header {
  display: flex;
  gap: 24px;
  align-items: center;
  background: var(--bg-secondary);
  padding: 32px;
  border-radius: 12px;
}

.skeleton-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--skeleton-bg);
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-info {
  flex: 1;
}

.skeleton-line {
  height: 16px;
  background: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 12px;
  animation: shimmer 1.5s infinite;
}

.skeleton-line-title {
  width: 60%;
  height: 24px;
}

.skeleton-line-subtitle {
  width: 40%;
  height: 18px;
}

.skeleton-line-text {
  width: 80%;
}

@keyframes shimmer {
  0% {
    background: var(--skeleton-bg-start);
  }

  50% {
    background: var(--skeleton-bg-end);
  }

  100% {
    background: var(--skeleton-bg-start);
  }
}

/* Error State */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-card {
  text-align: center;
  padding: 48px;
  background: var(--bg-secondary);
  border-radius: 12px;
  max-width: 400px;
}

.error-card svg {
  color: #ef4444;
  margin-bottom: 16px;
}

.error-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.error-card p {
  color: var(--text-color-light);
  margin-bottom: 24px;
}

.btn-retry {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-retry:hover {
  background: #3b52d9;
}

/* Employee Header */
.employee-header {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.employee-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 32px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(72, 101, 255, 0.3);
  transition: all 0.2s ease;
}

.employee-avatar-large.inactive {
  background: #6b7280;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.employee-main-info {
  flex: 1;
}

.employee-name-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.employee-name {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fef2f2;
  color: #991b1b;
}

.employee-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color-light);
}

.detail-item svg {
  color: var(--primary-color);
  flex-shrink: 0;
}

/* Documents Section */
/* Базовые стили для секции документов */
.documents-section {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.section-title svg {
  color: var(--primary-color);
}

/* Documents Grid */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.document-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.document-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.document-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.document-info {
  flex: 1;
  min-width: 0;
}

.document-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-type {
  font-size: 14px;
  color: var(--text-color-light);
  margin-bottom: 4px;
}

.document-date {
  font-size: 13px;
  color: var(--text-color-light);
  margin-bottom: 4px;
}

.document-description {
  font-size: 13px;
  color: var(--text-color-light);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-attorney,
.document-invoice-type {
  font-size: 13px;
  color: var(--text-color-light);
  margin-bottom: 4px;
}

.document-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color-light);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-action:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: rgba(72, 101, 255, 0.06);
}

.btn-action-danger:hover {
  color: #ef4444;
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.06);
}

/* Documents Info */
.documents-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: var(--text-color-light);
  font-size: 14px;
}

/* АДАПТИВНЫЕ СТИЛИ */

/* Планшеты и средние экраны */
@media (max-width: 1024px) {
  .documents-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 14px;
  }

  .document-card {
    padding: 16px;
  }

  .section-title {
    font-size: 22px;
  }
}

/* Маленькие планшеты */
@media (max-width: 768px) {

  .employee-header {
    display: flex;
    flex-direction: column;
  }

  .employee-name-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .employee-name {
    font-size: 42px;
  }

  .documents-section {
    padding: 24px 20px;
    border-radius: 12px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 20px;
    gap: 10px;
  }

  .documents-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .document-card {
    padding: 16px;
    gap: 12px;
  }

  .document-icon {
    width: 40px;
    height: 40px;
  }

  .document-title {
    font-size: 15px;
    /* Позволяем переносить на несколько строк на мобильных */
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
    line-height: 1.3;
  }

  .documents-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
  }

  .documents-pagination {
    gap: 12px;
  }

  .pagination-btn {
    width: 36px;
    height: 36px;
  }
}

/* Мобильные устройства */
@media (max-width: 480px) {
  .documents-section {
    padding: 20px 16px;
    border-radius: 8px;
    margin: 0 -16px;
    /* Расширяем на всю ширину экрана */
  }

  .section-title {
    font-size: 18px;
    gap: 8px;
  }

  .section-title svg {
    width: 20px;
    height: 20px;
  }

  .documents-grid {
    gap: 10px;
  }

  .document-card {
    padding: 12px;
    gap: 10px;
    border-radius: 8px;
  }

  .document-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .document-icon svg {
    width: 18px;
    height: 18px;
  }

  .document-title {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .document-type,
  .document-date,
  .document-description,
  .document-attorney,
  .document-invoice-type {
    font-size: 12px;
    margin-bottom: 2px;
  }

  .document-actions {
    gap: 6px;
    flex-direction: column;
  }

  .btn-action {
    width: 28px;
    height: 28px;
  }

  .btn-action svg {
    width: 14px;
    height: 14px;
  }

  .documents-info {
    font-size: 12px;
  }

  .pagination-btn {
    width: 32px;
    height: 32px;
  }

  .pagination-btn svg {
    width: 14px;
    height: 14px;
  }

  .pagination-info {
    font-size: 13px;
  }

  /* Состояния загрузки и ошибок на мобильных */
  .documents-error {
    padding: 24px 16px;
  }

  .documents-error svg {
    width: 24px;
    height: 24px;
  }

  .empty-documents {
    padding: 32px 16px;
  }

  .empty-documents svg {
    width: 36px;
    height: 36px;
  }

  .empty-documents h3 {
    font-size: 16px;
  }

  .empty-documents p {
    font-size: 14px;
  }
}

/* Очень маленькие экраны */
@media (max-width: 360px) {
  .documents-section {
    padding: 16px 12px;
  }

  .document-card {
    padding: 10px;
  }

  .document-actions {
    gap: 4px;
  }

  .btn-action {
    width: 24px;
    height: 24px;
  }

  .btn-action svg {
    width: 12px;
    height: 12px;
  }
}
</style>