<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast" :class="`toast--${type}`" role="alert" aria-live="polite">
        <AppIcon :name="iconName" :size="18" />
        <span>{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AppIcon from './ui/AppIcon.vue';

const props = defineProps({
  message: String,
  type: { type: String, default: 'success' },
  duration: { type: Number, default: 3000 },
});

const visible = ref(false);

const iconName = computed(
  () => ({ success: 'check', error: 'alert', warning: 'alert', info: 'inbox' }[props.type] || 'check')
);

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  }
);
</script>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--shadow-lg);
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}
.toast--success {
  border-left: 4px solid var(--success);
}
.toast--success :deep(.icon) {
  color: var(--success);
}
.toast--error {
  border-left: 4px solid var(--danger);
}
.toast--error :deep(.icon) {
  color: var(--danger);
}
.toast--warning {
  border-left: 4px solid var(--warning);
}
.toast--warning :deep(.icon) {
  color: var(--warning);
}
.toast--info {
  border-left: 4px solid var(--info);
}
.toast--info :deep(.icon) {
  color: var(--info);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  transform: translateX(120%);
  opacity: 0;
}
</style>
