<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'

const store = useStudentsStore()
const firstName = ref('')
const lastName = ref('')
const editId = ref<string | null>(null)

const students = computed(() => store.students)

function resetForm() {
  firstName.value = ''
  lastName.value = ''
  editId.value = null
}

function submit() {
  if (!firstName.value.trim() || !lastName.value.trim()) return
  if (editId.value) {
    store.updateStudent(editId.value, { id: editId.value, firstName: firstName.value, lastName: lastName.value })
  } else {
    store.addStudent({ firstName: firstName.value, lastName: lastName.value })
  }
  resetForm()
}

function startEdit(id: string) {
  const s = store.studentsById[id]
  if (!s) return
  editId.value = id
  firstName.value = s.firstName
  lastName.value = s.lastName
}

function remove(id: string) {
  store.removeStudent(id)
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center q-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <q-input v-model="firstName" :label="$t('students.firstName')" dense />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-input v-model="lastName" :label="$t('students.lastName')" dense />
        </div>
        <div class="col-12 col-sm-12 col-md-4">
          <div class="row q-gutter-sm">
            <q-btn color="primary" :label="editId ? $t('students.update') : $t('students.add')" @click="submit" />
            <q-btn flat :label="$t('students.clear')" @click="resetForm" />
          </div>
        </div>
      </div>
    </div>

    <q-table 
      :rows="students" 
      :columns="[
        { name: 'firstName', label: $t('students.firstName'), field: 'firstName' },
        { name: 'lastName', label: $t('students.lastName'), field: 'lastName' },
        { name: 'actions', label: $t('students.actions'), field: 'id' }
      ]" 
      row-key="id" 
      flat
      :rows-per-page-options="[10, 25, 50]"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat :icon="editId === props.row.id ? 'close' : 'edit'" 
                 :color="editId === props.row.id ? 'negative' : 'primary'" 
                 @click="editId === props.row.id ? resetForm() : startEdit(props.row.id)" />
          <q-btn dense flat icon="delete" color="negative" @click="remove(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<style scoped>
</style>


