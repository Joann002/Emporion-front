<template>
  <div class="stat-card">
    <div class="stat-card__icon" :class="`stat-card__icon--${tone}`">
      <AppIcon :name="icon" :size="22" />
    </div>
    <div class="stat-card__body">
      <span class="stat-card__label">{{ label }}</span>
      <span class="stat-card__value tabnum">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'box' },
  tone: { type: String, default: 'primary' }, // primary | success | warning | info
});
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.stat-card__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
}
.stat-card__icon--primary {
  background: var(--primary-soft);
  color: var(--primary-soft-fg);
}
.stat-card__icon--success {
  background: var(--success-soft);
  color: var(--success-fg);
}
.stat-card__icon--warning {
  background: var(--warning-soft);
  color: var(--warning-fg);
}
.stat-card__icon--info {
  background: var(--info-soft);
  color: var(--info-fg);
}
.stat-card__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.stat-card__label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}
.stat-card__value {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
</style>
