<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
    icon: { type: String, default: 'eye' }, // 'eye', 'retry', etc.
    title: { type: String, default: '' }
})
const emit = defineEmits(['click'])
</script>
<template>
    <button class="btn-action" :title="title" @click="$emit('click')">
        <svg v-if="icon === 'eye'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else-if="icon === 'retry'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        <slot v-else />
    </button>
</template>
<style scoped>
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
    border: none;
    cursor: pointer;
}

.btn-action:hover {
    background: var(--primary-color);
    color: white;
}
</style>