<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClassesSupabaseStore } from '@/stores/classes-supabase'
import { useStudentsSupabaseStore } from '@/stores/students-supabase'

const route = useRoute()
const classesStore = useClassesSupabaseStore()
const studentsStore = useStudentsSupabaseStore()

const classId = route.params.id as string

const klass = computed(() => classesStore.classesById[classId])
const assigned = computed(() => classesStore.getClassStudents(classId))
const allStudents = computed(() => studentsStore.students)
const selectedToAdd = ref<string | null>(null)
const loading = computed(() => classesStore.loading || studentsStore.loading)
const error = computed(() => classesStore.error || studentsStore.error)

onMounted(async () => {
  await Promise.all([
    classesStore.fetchClasses(),
    classesStore.fetchClassStudents(),
    studentsStore.fetchStudents()
  ])
})

async function addStudent() {
  if (!selectedToAdd.value) return
  
  try {
    await classesStore.assignStudentToClass(classId, selectedToAdd.value)
    selectedToAdd.value = null
  } catch (err) {
    // Error is handled in the store
  }
}

async function removeStudent(id: string) {
  try {
    await classesStore.removeStudentFromClass(classId, id)
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

    <div v-if="klass">
      <div class="text-h5 q-mb-md">{{ $t('classes.classDetails') }}: {{ klass.name }}</div>

      <div class="row items-center q-gutter-md q-mb-lg">
        <div class="col-12 col-sm-8 col-md-6">
          <q-select 
            v-model="selectedToAdd" 
            :options="allStudents.map(s => ({ label: s.first_name + ' ' + s.last_name, value: s.id }))" 
            :label="$t('students.title')" 
            dense 
            emit-value 
            map-options 
            :disable="loading"
          />
        </div>
        <div class="col-12 col-sm-4 col-md-6">
          <q-btn color="primary" :label="$t('classes.assign')" @click="addStudent" :loading="loading" :disable="loading" />
        </div>
      </div>

      <q-table 
        :rows="assigned" 
        :columns="[
          { name: 'first_name', label: $t('students.firstName'), field: 'first_name' },
          { name: 'last_name', label: $t('students.lastName'), field: 'last_name' },
          { name: 'actions', label: $t('classes.actions'), field: 'id' }
        ]" 
        row-key="id" 
        flat
        :rows-per-page-options="[10, 25, 50]"
        :pagination="{ rowsPerPage: 10 }"
        :loading="loading"
      >
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn 
              dense 
              flat 
              icon="remove_circle" 
              color="negative" 
              @click="removeStudent(props.row.id)"
              :disable="loading"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style scoped></style>


