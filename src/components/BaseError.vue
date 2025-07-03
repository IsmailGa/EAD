<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
    message: { type: String, default: 'Произошла ошибка' },
    retryText: { type: String, default: 'Попробовать снова' }
})
const emit = defineEmits(['retry'])
</script>
<template>
    <div class="error-card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3>Ошибка</h3>
        <p>{{ message }}</p>
        <button @click="$emit('retry')" class="btn-retry">{{ retryText }}</button>
    </div>
</template>
<style scoped>
.error-card {
    text-align: center;
    padding: 48px;
    background: var(--bg-secondary);
    border-radius: 12px;
    max-width: 400px;
    margin: 0 auto;
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
</style>