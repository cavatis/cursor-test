<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isDark = ref(false)

onMounted(() => {
  // Load dark mode preference from localStorage
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true'
  } else {
    // Default to system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Apply the dark mode
  $q.dark.set(isDark.value)
})

function toggleDarkMode() {
  isDark.value = !isDark.value
  $q.dark.set(isDark.value)
  localStorage.setItem('darkMode', isDark.value.toString())
}
</script>

<template>
  <q-btn
    flat
    round
    :icon="isDark ? 'light_mode' : 'dark_mode'"
    @click="toggleDarkMode"
    class="q-ml-sm"
  />
</template>

<style scoped>
</style>
