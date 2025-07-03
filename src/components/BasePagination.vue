<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
    current: { type: Number, required: true },
    total: { type: Number, required: true }
})
const emit = defineEmits(['change'])
</script>
<template>
    <div v-if="total > 1" class="pagination">
        <button @click="$emit('change', current - 1)" :disabled="current === 1" class="pagination-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6" />
            </svg>
        </button>
        <span class="pagination-info">
            {{ current }} / {{ total }}
        </span>
        <button @click="$emit('change', current + 1)" :disabled="current === total" class="pagination-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,6 15,12 9,18" />
            </svg>
        </button>
    </div>
</template>
<style scoped>
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
</style>