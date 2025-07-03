<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useEmployeeStore } from '@/stores/employeeStore'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute();
const router = useRouter();


const employeeStore = useEmployeeStore()
const { employees, total, loading, error } = storeToRefs(employeeStore)

const page = ref(Number(route.query.page) || 1)
const searchQuery = ref(route.query.search || '')
const itemsPerPage = ref(12)

const getInitials = employeeStore.getEmployeeInitialsFromObject


function fetchWithQuery() {
  const search = route.query.search || ''
  console.log('Fetching employees with search:', search) // Добавляем лог для отладки
  employeeStore.fetchEmployees(page.value, 12, search)
}

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))

function clearFilters() {
  console.log('Clearing filters') // Добавляем лог для отладки
  searchQuery.value = ''
}

watch(employees, (val) => { console.log('Employees updated:', val) })

watch(page, (newPage) => {
  router.replace({ query: { ...route.query, page: newPage } })
  fetchWithQuery()
})

watch(
  () => route.query.page,
  (newPage) => {
    if (Number(newPage) !== page.value) {
      page.value = Number(newPage) || 1
      fetchWithQuery()
    }
  }
)

watch(
  () => route.query.search,
  () => {
    if (page.value !== 1) {
      page.value = 1
      router.replace({ query: { ...route.query, page: 1 } })
    }
    fetchWithQuery()
  }
)

// Добавляем watch для searchQuery
watch(searchQuery, (newSearch) => {
  router.replace({ query: { ...route.query, search: newSearch || undefined, page: 1 } })
  if (page.value !== 1) {
    page.value = 1
  }
  fetchWithQuery()
})

onMounted(() => {
  fetchWithQuery()
})
</script>

<template>
  <v-container>
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Сотрудники</h1>
        <p class="page-subtitle">Управляйте членами команды и их информацией</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Поиск сотрудников..." class="search-input" />
      </div>
      <v-btn v-if="searchQuery" variant="text" color="primary" @click="clearFilters">
        Очистить фильтры
      </v-btn>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-skeleton-loader type="card" :loading="true" :count="6" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-alert type="error" prominent border="start" :text="error" @click:close="fetchWithQuery" closable />
    </div>

    <!-- Employees Content -->
    <div v-else class="employees-container">
      <!-- Results Info -->
      <div class="results-info">
        <span class="results-count">
          {{ employees.length }} из {{ total }} сотрудников
        </span>
        <span class="page-info">
          Страница {{ page }} из {{ totalPages }}
        </span>
      </div>

      <!-- Empty State -->
      <div v-if="employees.length === 0" class="empty-state">
        <v-alert type="info" border="start" prominent
          text="Сотрудники не найдены. Попробуйте изменить поиск или критерии фильтрации" />
      </div>

      <!-- Employees Grid -->
      <div v-else class="employees-grid">
        <div v-for="employee in employees" :key="employee.id" class="employee-card">
          <div class="employee-avatar">
            <span>{{ getInitials(employee) }}</span>
          </div>

          <div class="employee-info">
            <h3 class="employee-name">{{ employee.firstName + " " + employee.lastName || 'Неизвестно' }}</h3>
          </div>

          <div class="employee-contact">
            <a v-if="employee.email" :href="`mailto:${employee.email}`" class="contact-link">
              <v-icon>mdi-email</v-icon>
              {{ employee.email }}
            </a>
            <span v-if="employee.phone" class="phone">{{ employee.phone }}</span>
          </div>

          <div class="employee-actions">
            <RouterLink :to="`/employees/${employee.id}`" class="btn-action" title="Просмотр деталей">
              <v-icon>mdi-eye</v-icon>
            </RouterLink>
            <RouterLink :to="`/documents?employeeId=${employee.id}`" class="btn-action" title="Просмотр документов">
              <v-icon>mdi-file-document</v-icon>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-pagination v-if="totalPages > 1" v-model="page" :length="totalPages" :total-visible="7" color="primary" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
}

.page-subtitle {
  color: var(--text-color-light);
  font-size: 16px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #3b52d9;
  transform: translateY(-1px);
}

/* Filters */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color-light);
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(72, 101, 255, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  min-width: 180px;
}

.btn-clear {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color-light);
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Loading Skeleton */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.skeleton-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 16px;
}

.skeleton-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--skeleton-bg);
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  flex: 1;
}

.skeleton-line {
  height: 16px;
  background: var(--skeleton-bg);
  border-radius: 4px;
  margin-bottom: 8px;
  animation: shimmer 1.5s infinite;
}

.skeleton-line-title {
  width: 60%;
  height: 20px;
}

.skeleton-line-subtitle {
  width: 40%;
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

/* Results Info */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: var(--text-color-light);
  font-size: 14px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 64px 32px;
}

.empty-state svg {
  color: var(--text-color-light);
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.empty-state p {
  color: var(--text-color-light);
}

/* Employees Grid */
.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.employee-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  position: relative;
}

.employee-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.employee-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 16px;
}

.employee-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.employee-position {
  font-size: 14px;
  color: var(--text-color-light);
  margin-bottom: 2px;
}

.employee-department {
  font-size: 13px;
  color: var(--text-color-light);
  margin-bottom: 16px;
}

.employee-contact {
  margin-bottom: 16px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 4px;
}

.contact-link:hover {
  text-decoration: underline;
}

.phone {
  font-size: 14px;
  color: var(--text-color-light);
}

.employee-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-color-light);
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-action:hover {
  background: var(--primary-color);
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-weight: 500;
  color: var(--text-color);
}

/* Responsive */
@media (max-width: 768px) {
  .employees-page {
    padding: 24px 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .employees-grid {
    grid-template-columns: 1fr;
  }

  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
}
</style>