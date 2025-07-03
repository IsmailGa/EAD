<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    icon: { type: String, default: 'person' },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
})
</script>
<template>
    <div class="empty-state">
        <svg v-if="icon === 'person'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
        <svg v-else-if="icon === 'document'" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
        </svg>
        <h3>{{ title }}</h3>
        <p>{{ subtitle }}</p>
    </div>
</template>
<style scoped>
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
</style>