<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClassesStore } from '@/stores/classes'
import { useStudentsStore } from '@/stores/students'

const route = useRoute()
const classesStore = useClassesStore()
const studentsStore = useStudentsStore()

const classId = route.params.id as string

const klass = computed(() => classesStore.classesById[classId])
const assigned = computed(() => classesStore.classStudents(classId))
const allStudents = computed(() => studentsStore.students)
const selectedToAdd = ref<string | null>(null)

function addStudent() {
  if (selectedToAdd.value) {
    classesStore.assignStudentToClass(classId, selectedToAdd.value)
    selectedToAdd.value = null
  }
}

function removeStudent(id: string) {
  classesStore.removeStudentFromClass(classId, id)
}
</script>

<template>
  <q-page padding>
    <div v-if="klass">
      <div class="text-h5 q-mb-md">Class: {{ klass.name }}</div>

      <div class="row items-center q-gutter-md q-mb-lg">
        <q-select v-model="selectedToAdd" :options="allStudents.map(s => ({ label: s.firstName + ' ' + s.lastName, value: s.id }))" label="Student" dense emit-value map-options />
        <q-btn color="primary" label="Assign" @click="addStudent" />
      </div>

      <q-table :rows="assigned" :columns="[
        { name: 'firstName', label: 'First name', field: 'firstName' },
        { name: 'lastName', label: 'Last name', field: 'lastName' },
        { name: 'actions', label: 'Actions', field: 'id' }
      ]" row-key="id" flat>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense flat icon="remove_circle" color="negative" @click="removeStudent(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style scoped></style>


