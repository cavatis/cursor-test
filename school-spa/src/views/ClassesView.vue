<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useClassesSupabaseStore } from '@/stores/classes-supabase'

const store = useClassesSupabaseStore()
const className = ref('')

const classes = computed(() => store.classesWithCounts)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

onMounted(async () => {
  await Promise.all([
    store.fetchClasses(),
    store.fetchClassStudents()
  ])
})

async function add() {
  if (!className.value.trim()) return
  
  try {
    await store.addClass(className.value)
    className.value = ''
  } catch (err) {
    // Error is handled in the store
  }
}

async function remove(id: string) {
  try {
    await store.removeClass(id)
  } catch (err) {
    // Error is handled in the store
  }
}
</script>

<template>
  <q-page padding>
    <!-- Error Banner -->
    <q-banner v-if="error" class="bg-negative text-white q-mb-md">
      <template #avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
    </q-banner>

    <div class="q-pa-md">
      <div class="row items-center q-gutter-md">
        <div class="col-12 col-sm-8 col-md-6">
          <q-input v-model="className" :label="$t('classes.className')" dense :disable="loading" />
        </div>
        <div class="col-12 col-sm-4 col-md-6">
          <q-btn color="primary" :label="$t('classes.add')" @click="add" :loading="loading" :disable="loading" />
        </div>
      </div>
    </div>
    
    <q-list bordered separator>
      <q-item v-for="c in classes" :key="c.id" :to="`/classes/${c.id}`" clickable>
        <q-item-section>
          <q-item-label>{{ c.name }}</q-item-label>
          <q-item-label caption>{{ c.count }} {{ $t('classes.students') }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn dense flat icon="delete" color="negative" @click.stop="remove(c.id)" :disable="loading" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<style scoped></style>


