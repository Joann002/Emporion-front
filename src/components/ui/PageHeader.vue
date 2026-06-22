<template>
  <header class="page-header">
    <div class="page-header__text">
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.page-header__title {
  font-size: 24px;
  font-weight: 700;
}
.page-header__subtitle {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 14px;
}
.page-header__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
