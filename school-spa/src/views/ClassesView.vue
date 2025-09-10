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
    <div class="q-pa-md">
      <div class="row items-center q-gutter-md">
        <div class="col-12 col-sm-8 col-md-6">
          <q-input v-model="className" :label="$t('classes.className')" dense />
        </div>
        <div class="col-12 col-sm-4 col-md-6">
          <q-btn color="primary" :label="$t('classes.add')" @click="add" />
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
          <q-btn dense flat icon="delete" color="negative" @click.stop="remove(c.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<style scoped></style>


