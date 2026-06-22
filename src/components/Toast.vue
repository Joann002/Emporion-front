<template>
  <transition name="toast">
    <div v-if="visible" :class="['toast', type]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success',
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const visible = ref(false);

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, props.duration);
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  font-weight: 500;
  color: white;
}

.toast.success {
  background-color: #4CAF50;
}

.toast.error {
  background-color: #f44336;
}

.toast.warning {
  background-color: #ff9800;
}

.toast.info {
  background-color: #2196F3;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
