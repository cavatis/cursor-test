<template>
  <q-btn-dropdown
    flat
    :label="currentLanguage"
    icon="language"
    class="q-ml-md"
  >
    <q-list>
      <q-item
        v-for="locale in availableLocales"
        :key="locale.code"
        clickable
        v-close-popup
        @click="changeLanguage(locale.code)"
        :active="locale.code === $i18n.locale"
      >
        <q-item-section>
          <q-item-label>{{ locale.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' }
]

const currentLanguage = computed(() => {
  const current = availableLocales.find(l => l.code === locale.value)
  return current ? current.name : 'English'
})

function changeLanguage(lang: string) {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>

<style scoped>
</style>
