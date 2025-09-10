<script setup lang="ts"></script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>School SPA</q-toolbar-title>
        <q-space />
        <q-btn flat to="/students" label="Students" />
        <q-btn flat to="/classes" label="Classes" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>


