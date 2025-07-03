<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    count: { type: Number, default: 3 },
    type: { type: String, default: 'card' } // 'card' или 'line'
})
</script>
<template>
    <div v-if="type === 'card'" class="skeleton-grid">
        <div v-for="i in count" :key="i" class="skeleton-card">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-content">
                <div class="skeleton-line skeleton-line-title"></div>
                <div class="skeleton-line skeleton-line-subtitle"></div>
                <div class="skeleton-line skeleton-line-text"></div>
            </div>
        </div>
    </div>
    <div v-else-if="type === 'line'">
        <div v-for="i in count" :key="i" class="skeleton-line skeleton-line-title"></div>
    </div>
</template>
<style scoped>
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
</style>