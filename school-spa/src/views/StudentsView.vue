<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudentsSupabaseStore } from '@/stores/students-supabase'

const store = useStudentsSupabaseStore()
const firstName = ref('')
const lastName = ref('')
const editId = ref<string | null>(null)

const students = computed(() => store.students)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

onMounted(() => {
  store.fetchStudents()
})

function resetForm() {
  firstName.value = ''
  lastName.value = ''
  editId.value = null
}

async function submit() {
  if (!firstName.value.trim() || !lastName.value.trim()) return
  
  try {
    if (editId.value) {
      await store.updateStudent(editId.value, firstName.value, lastName.value)
    } else {
      await store.addStudent(firstName.value, lastName.value)
    }
    resetForm()
  } catch (err) {
    // Error is handled in the store
  }
}

function startEdit(id: string) {
  const s = store.studentsById[id]
  if (!s) return
  editId.value = id
  firstName.value = s.first_name
  lastName.value = s.last_name
}

async function remove(id: string) {
  try {
    await store.removeStudent(id)
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
        <div class="col-12 col-sm-6 col-md-4">
          <q-input v-model="firstName" :label="$t('students.firstName')" dense :disable="loading" />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-input v-model="lastName" :label="$t('students.lastName')" dense :disable="loading" />
        </div>
        <div class="col-12 col-sm-12 col-md-4">
          <div class="row q-gutter-sm">
            <q-btn 
              color="primary" 
              :label="editId ? $t('students.update') : $t('students.add')" 
              @click="submit" 
              :loading="loading"
              :disable="loading"
            />
            <q-btn flat :label="$t('students.clear')" @click="resetForm" :disable="loading" />
          </div>
        </div>
      </div>
    </div>

    <q-table 
      :rows="students" 
      :columns="[
        { name: 'first_name', label: $t('students.firstName'), field: 'first_name' },
        { name: 'last_name', label: $t('students.lastName'), field: 'last_name' },
        { name: 'actions', label: $t('students.actions'), field: 'id' }
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
            :icon="editId === props.row.id ? 'close' : 'edit'" 
            :color="editId === props.row.id ? 'negative' : 'primary'" 
            @click="editId === props.row.id ? resetForm() : startEdit(props.row.id)"
            :disable="loading"
          />
          <q-btn 
            dense 
            flat 
            icon="delete" 
            color="negative" 
            @click="remove(props.row.id)"
            :disable="loading"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<style scoped>
</style>


