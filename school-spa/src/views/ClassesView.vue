<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClassesStore } from '@/stores/classes'

const store = useClassesStore()
const className = ref('')

const classes = computed(() => store.classesWithCounts)

function add() {
  if (!className.value.trim()) return
  store.addClass({ name: className.value })
  className.value = ''
}

function remove(id: string) {
  store.removeClass(id)
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md row items-center q-gutter-md">
      <q-input v-model="className" label="Class name" dense />
      <q-btn color="primary" label="Add" @click="add" />
    </div>
    <q-list bordered separator>
      <q-item v-for="c in classes" :key="c.id" :to="`/classes/${c.id}`" clickable>
        <q-item-section>
          <q-item-label>{{ c.name }}</q-item-label>
          <q-item-label caption>{{ c.count }} students</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn dense flat icon="delete" color="negative" @click.stop="remove(c.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<style scoped></style>


