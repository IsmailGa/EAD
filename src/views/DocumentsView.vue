<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const documentStore = useDocumentStore()
const router = useRouter()
const route = useRoute()

// реактивные состояния
const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref(route.query.search || '')
const pageSize = ref(10)
const employeeId = ref(route.params?.employeeId || route.query?.employeeId || null)

// вычисляемые свойства
const documents = computed(() => documentStore.documents || [])
const totalDocuments = computed(() => documentStore.total || 0)
const totalPages = computed(() => Math.ceil(totalDocuments.value / pageSize.value))
const documentsLoading = computed(() => documentStore.loading)
const documentsError = computed(() => documentStore.error)

// методы
const fetchWithQuery = () => {
    const search = route.query.search || ''
    const employeeIdToUse = route.query.employeeId || route.params?.employeeId || null
    documentStore.fetchDocuments(currentPage.value, pageSize.value, employeeIdToUse, search)
}

const clearFilters = () => {
    searchQuery.value = ''
}

const clearEmployeeFilter = () => {
    // Удаляем employeeId из URL
    const query = { ...route.query }
    delete query.employeeId
    router.replace({ query })
}

const getDocumentIcon = (type) => {
    const icons = {
        'passport': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
        'contract': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
        'invoice': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
        'certificate': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
        'image': 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 1 2 2h14a2 2 0 0 0 2-2z',
        'power-of-attorney': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
        'default': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'
    }
    return icons[type] || icons.default
}

const getDocumentTypeName = (type) => {
    const typeNames = {
        'passport': 'Паспорт',
        'contract': 'Договор',
        'invoice': 'Счёт',
        'certificate': 'Сертификат',
        'image': 'Изображение',
        'power-of-attorney': 'Доверенность',
        'default': 'Документ'
    }
    return typeNames[type] || typeNames.default
}

const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана'

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } catch (error) {
        return 'Некорректная дата'
    }
}

const viewDocument = (document) => {
    !document?.id ? null : router.push(`/documents/${document.id}`)
}

watch(currentPage, (newPage) => {
    router.replace({ query: { ...route.query, page: newPage } })
    fetchWithQuery()
})

watch(
    () => route.query.page,
    (newPage) => {
        if (Number(newPage) !== currentPage.value) {
            currentPage.value = Number(newPage) || 1
            fetchWithQuery()
        }
    }
)

watch(
    () => route.query.search,
    () => {
        if (currentPage.value !== 1) {
            currentPage.value = 1
            router.replace({ query: { ...route.query, page: 1 } })
        }
        fetchWithQuery()
    }
)

// Добавляем watch для searchQuery
watch(searchQuery, (newSearch) => {
    router.replace({ query: { ...route.query, search: newSearch || undefined, page: 1 } })
    if (currentPage.value !== 1) {
        currentPage.value = 1
    }
    fetchWithQuery()
})

// Следим за изменениями employeeId в query параметрах
watch(() => route.query.employeeId, (newEmployeeId) => {
    employeeId.value = newEmployeeId
    currentPage.value = 1
    fetchWithQuery()
})

// Следим за изменениями employeeId в params
watch(() => route.params?.employeeId, (newEmployeeId) => {
    employeeId.value = newEmployeeId
    currentPage.value = 1
    fetchWithQuery()
})

// Lifecycle
onMounted(() => {
    fetchWithQuery()
})
</script>

<template>
    <v-container>
        <!-- Header -->
        <div class="section-header">
            <h2 class="page-title">
                {{ employeeId ? `Документы сотрудника (ID: ${employeeId})` : 'Документы' }}
            </h2>
        </div>

        <!-- Filters -->
        <div class="filters-section">
            <div class="search-box">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input v-model="searchQuery" type="text" placeholder="Найти документы..." class="search-input" />
            </div>
            <v-btn v-if="searchQuery" variant="text" color="primary" @click="clearFilters">
                Очистить поиск
            </v-btn>
            <v-btn v-if="employeeId" variant="text" color="secondary" @click="clearEmployeeFilter">
                Очистить фильтр
            </v-btn>
        </div>

        <!-- Documents Loading -->
        <div v-if="documentsLoading" class="documents-skeleton">
            <v-skeleton-loader type="card" :loading="true" :count="3" />
        </div>

        <!-- Documents Error -->
        <div v-else-if="documentsError" class="documents-error">
            <v-alert type="error" prominent border="start" :text="documentsError" @click:close="fetchWithQuery"
                closable />
        </div>

        <!-- Documents List -->
        <div v-else class="documents-content">
            <!-- Documents Info -->
            <div v-if="totalDocuments > 0" class="documents-info">
                <span class="documents-count">
                    {{ totalDocuments }} документ{{ totalDocuments > 1 ? 'ов' : '' }} нашлось
                </span>
                <span v-if="totalPages > 1" class="page-info">
                    Страница {{ currentPage }} из {{ totalPages }}
                </span>
            </div>

            <!-- Empty Documents -->
            <div v-if="documents.length === 0" class="documents-empty">
                <v-alert type="info" border="start" prominent
                    text="Документы не найдены. Попробуйте изменить поиск или фильтр." />
            </div>

            <!-- Documents Grid -->
            <div v-if="documents.length > 0" class="documents-grid">
                <div v-for="document in documents" :key="document.id" class="document-card">
                    <div class="document-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path :d="getDocumentIcon(document.type)" />
                            <polyline v-if="!['image', 'power-of-attorney'].includes(document.type)"
                                points="14,2 14,8 20,8" />
                        </svg>
                    </div>
                    <div class="document-info">
                        <h3 class="document-title">
                            {{ document.number || document.title || document.name || 'Безымянный документ' }}
                        </h3>
                        <p class="document-type">{{ getDocumentTypeName(document.type) }}</p>
                        <p class="document-date">{{ formatDate(document.date || document.createdAt ||
                            document.uploadDate) }}</p>
                        <p v-if="document.description" class="document-description">
                            {{ document.description }}
                        </p>
                        <p v-if="document.attorneyFullName" class="document-attorney">
                            Доверенный: {{ document.attorneyFullName }}
                        </p>
                        <p v-if="document.invoiceType" class="document-invoice-type">
                            Тип: {{ document.invoiceType }}
                        </p>
                    </div>
                    <div class="document-actions">
                        <v-btn icon variant="text" color="primary" @click="viewDocument(document)"
                            :title="'Просмотр документа'">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" :total-visible="7"
                        color="primary" />
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<style scoped>
.documents-section {
    width: 100%;
    padding-top: 30px;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 8px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
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

/* Documents Loading Skeleton */
.documents-skeleton {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.document-skeleton {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
}

.skeleton-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--skeleton-bg);
    animation: shimmer 1.5s infinite;
    flex-shrink: 0;
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

/* Documents Error */
.documents-error {
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

/* Documents Content */
.documents-content {
    margin-top: 24px;
}

.documents-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: var(--text-color-light);
    font-size: 14px;
}

.documents-count {
    font-weight: 500;
}

.page-info {
    color: var(--text-color-light);
}

/* Empty Documents */
.documents-empty {
    text-align: center;
    padding: 48px 32px;
}

.documents-empty svg {
    color: var(--text-color-light);
    margin-bottom: 16px;
}

.documents-empty h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-color);
}

.documents-empty p {
    color: var(--text-color-light);
    margin: 0;
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

/* Documents Pagination */
.documents-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
}

.pagination-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color-light);
    transition: all 0.2s ease;
    cursor: pointer;
}

.pagination-btn:hover:not(:disabled) {
    color: var(--primary-color);
    border-color: var(--primary-color);
    background: rgba(72, 101, 255, 0.06);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-info {
    font-size: 14px;
    color: var(--text-color-light);
    font-weight: 500;
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