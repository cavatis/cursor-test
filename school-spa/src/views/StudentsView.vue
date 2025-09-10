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
        <q-input v-model="firstName" label="First name" dense />
        <q-input v-model="lastName" label="Last name" dense />
        <q-btn color="primary" :label="editId ? 'Update' : 'Add'" @click="submit" />
        <q-btn flat label="Clear" @click="resetForm" />
      </div>
    </div>

    <q-table :rows="students" :columns="[
      { name: 'firstName', label: 'First name', field: 'firstName' },
      { name: 'lastName', label: 'Last name', field: 'lastName' },
      { name: 'actions', label: 'Actions', field: 'id' }
    ]" row-key="id" flat>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat icon="edit" @click="startEdit(props.row.id)" />
          <q-btn dense flat icon="delete" color="negative" @click="remove(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
  
</template>

<style scoped>
</style>


