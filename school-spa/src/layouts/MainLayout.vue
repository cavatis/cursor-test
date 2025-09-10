<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ $t('app.title') }}</q-toolbar-title>
        <q-space />
        <q-btn flat to="/students" :label="$t('app.students')" />
        <q-btn flat to="/classes" :label="$t('app.classes')" />
        <LanguageSwitcher />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>


