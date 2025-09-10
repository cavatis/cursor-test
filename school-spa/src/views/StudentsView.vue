<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'

const studentsStore = useStudentsStore()
const classesStore = useClassesStore()

const firstName = ref('')
const lastName = ref('')
const editId = ref<string | null>(null)
const selectedClassId = ref<string | null>(null)

const students = computed(() => studentsStore.studentsWithClassNames)
const classes = computed(() => classesStore.classes)

function resetForm() {
  firstName.value = ''
  lastName.value = ''
  editId.value = null
  selectedClassId.value = null
}

function submit() {
  if (!firstName.value.trim() || !lastName.value.trim()) return
  if (editId.value) {
    studentsStore.updateStudent(editId.value, { 
      id: editId.value, 
      firstName: firstName.value, 
      lastName: lastName.value,
      classId: selectedClassId.value || undefined
    })
  } else {
    studentsStore.addStudent({ 
      firstName: firstName.value, 
      lastName: lastName.value,
      classId: selectedClassId.value || undefined
    })
  }
  resetForm()
}

function startEdit(id: string) {
  const s = studentsStore.studentsById[id]
  if (!s) return
  editId.value = id
  firstName.value = s.firstName
  lastName.value = s.lastName
  selectedClassId.value = s.classId || null
}

function remove(id: string) {
  studentsStore.removeStudent(id)
}

function assignToClass(studentId: string, classId: string) {
  classesStore.assignStudentToClass(classId, studentId)
}

function removeFromClass(studentId: string) {
  const student = studentsStore.studentsById[studentId]
  if (student?.classId) {
    classesStore.removeStudentFromClass(student.classId, studentId)
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center q-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-input v-model="firstName" :label="$t('students.firstName')" dense />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-input v-model="lastName" :label="$t('students.lastName')" dense />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-select 
            v-model="selectedClassId" 
            :options="classes.map(c => ({ label: c.name, value: c.id }))" 
            :label="$t('classes.title')" 
            dense 
            emit-value 
            map-options
            clearable
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
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
        { name: 'className', label: $t('classes.title'), field: 'className' },
        { name: 'actions', label: $t('students.actions'), field: 'id' }
      ]" 
      row-key="id" 
      flat
      :rows-per-page-options="[10, 25, 50]"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #body-cell-className="props">
        <q-td :props="props">
          <div v-if="props.row.className" class="text-primary">
            {{ props.row.className }}
          </div>
          <div v-else class="text-grey-6">
            {{ $t('common.noClass') }}
          </div>
        </q-td>
      </template>
      
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense flat :icon="editId === props.row.id ? 'close' : 'edit'" 
                 :color="editId === props.row.id ? 'negative' : 'primary'" 
                 @click="editId === props.row.id ? resetForm() : startEdit(props.row.id)" />
          <q-btn dense flat icon="delete" color="negative" @click="remove(props.row.id)" />
          <q-btn-dropdown dense flat icon="school" color="secondary">
            <q-list>
              <q-item 
                v-for="c in classes" 
                :key="c.id" 
                clickable 
                v-close-popup
                @click="assignToClass(props.row.id, c.id)"
                :class="{ 'bg-primary text-white': props.row.classId === c.id }"
              >
                <q-item-section>
                  <q-item-label>{{ c.name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="removeFromClass(props.row.id)">
                <q-item-section>
                  <q-item-label>{{ $t('common.removeFromClass') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<style scoped>
</style>


