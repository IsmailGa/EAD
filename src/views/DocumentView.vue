<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useDocumentStore } from '@/stores/documentStore'

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()

const loading = ref(true)
const error = ref(null)

const documentId = route.params.id

const fetchDocument = async () => {
    try {
        loading.value = true
        error.value = null
        await documentStore.fetchDocument(documentId)
    } catch (err) {
        error.value = err.message || 'Не удалось загрузить документ'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchDocument()
})

const goBack = () => {
    router.push('/documents')
}
</script>
<template>
    <div class="document-view-page">
        <div class="container">
            <!-- Кнопка назад -->
            <v-btn variant="text" color="primary" @click="goBack">
                <v-icon>mdi-arrow-left</v-icon>
                Назад к списку документов
            </v-btn>
            <!-- Скелетон загрузки -->
            <div v-if="loading" class="loading-container">
                <v-skeleton-loader type="card" :loading="true" :count="1" />
            </div>
            <!-- Ошибка -->
            <div v-else-if="error" class="error-container">
                <v-alert type="error" prominent border="start" :text="error" @click:close="fetchDocument" closable />
            </div>
            <!-- Пустое состояние -->
            <div v-else-if="!documentStore.document" class="empty-container">
                <v-alert type="info" border="start" prominent
                    text="Документ не найден. Возможно, он был удалён или не существует." />
            </div>
            <!-- Детали документа -->
            <div v-else class="document-details-card">
                <div class="document-header">
                    <v-icon size="48">mdi-file-document</v-icon>
                    <div>
                        <h1 class="document-title">{{ documentStore.document.title || documentStore.document.name ||
                            'Безымянный документ' }}</h1>
                        <div v-if="documentStore.document.name && documentStore.document.title" class="document-name">
                            Имя: {{ documentStore.document.name }}</div>
                        <div class="document-type">Тип: {{ documentStore.document.type || 'Не указан' }}</div>
                        <div class="document-date">Дата: {{ documentStore.document.date ||
                            documentStore.document.createdAt || documentStore.document.uploadDate || 'Не указана' }}
                        </div>
                    </div>
                </div>
                <div class="document-info-block">
                    <div v-if="documentStore.document.number"><b>Номер:</b> {{ documentStore.document.number }}</div>
                    <div v-if="documentStore.document.description"><b>Описание:</b> {{
                        documentStore.document.description }}</div>
                    <div v-if="documentStore.document.attorneyFullName"><b>Доверенный:</b> {{
                        documentStore.document.attorneyFullName }}</div>
                    <div v-if="documentStore.document.invoiceType"><b>Тип счёта:</b> {{
                        documentStore.document.invoiceType }}</div>
                    <div v-if="documentStore.document.employeeId">
                        <b>ID сотрудника:</b>
                        <RouterLink :to="`/employees/${documentStore.document.employeeId}`" class="employee-link">
                            {{ documentStore.document.employeeId }}
                        </RouterLink>
                    </div>
                    <div v-if="documentStore.document.status"><b>Статус:</b> {{ documentStore.document.status }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.document-view-page {
    width: 100%;
    padding-top: 30px;
}

.container {
    max-width: 700px;
    margin: 0 auto;
    padding: 24px;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color-light);
    padding: 10px 18px;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.back-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.document-details-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.document-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
}

.document-header svg {
    color: var(--primary-color);
}

.document-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 8px;
}

.document-type,
.document-date {
    color: var(--text-color-light);
    font-size: 15px;
    margin-bottom: 4px;
}

.document-info-block {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 16px;
    color: var(--text-color);
}

.empty-container {
    margin-top: 40px;
}

.document-name {
    color: var(--text-color-light);
    font-size: 16px;
    margin-bottom: 4px;
}

.employee-link {
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
    margin-left: 4px;
}

.employee-link:hover {
    color: #3b52d9;
}
</style>