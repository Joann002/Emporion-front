<template>
  <span class="badge" :class="`badge--${tone}`">
    <span class="dot" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: { type: String, required: true },
});

const map = {
  pending: { label: 'En attente', tone: 'warning' },
  paid: { label: 'Payée', tone: 'success' },
  cancelled: { label: 'Annulée', tone: 'danger' },
};

const label = computed(() => map[props.status]?.label || props.status);
const tone = computed(() => map[props.status]?.tone || 'neutral');
</script>
