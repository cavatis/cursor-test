<script setup lang="ts">
import { useRouter } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const router = useRouter()

function goToDashboard() {
  router.push('/')
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="goToDashboard">
          {{ $t('app.title') }}
        </q-toolbar-title>
        <q-space />
        <q-btn flat to="/students" :label="$t('app.students')" icon="people" />
        <q-btn flat to="/classes" :label="$t('app.classes')" icon="school" />
        <DarkModeToggle />
        <LanguageSwitcher />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>


