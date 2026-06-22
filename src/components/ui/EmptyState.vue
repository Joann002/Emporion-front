<template>
  <div class="empty">
    <div class="empty__icon">
      <AppIcon :name="icon" :size="26" />
    </div>
    <p class="empty__title">{{ title }}</p>
    <p v-if="description" class="empty__desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'inbox' },
});
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding: 48px 24px;
}
.empty__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 6px;
  border-radius: var(--radius-lg);
  background: var(--surface-2);
  color: var(--text-subtle);
}
.empty__title {
  font-weight: 600;
  color: var(--text);
}
.empty__desc {
  font-size: 14px;
  color: var(--text-muted);
  max-width: 360px;
}
.empty__action {
  margin-top: 12px;
}
</style>
