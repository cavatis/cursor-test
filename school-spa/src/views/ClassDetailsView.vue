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
const allClasses = computed(() => classesStore.classes.filter(c => c.id !== classId))
const selectedToAdd = ref<string | null>(null)
const showAssignForm = ref(false)

// Only show students who are not already assigned to this class
const availableStudents = computed(() => {
  const assignedIds = assigned.value.map(s => s.id)
  return allStudents.value.filter(s => !assignedIds.includes(s.id))
})

function addStudent() {
  if (selectedToAdd.value) {
    classesStore.assignStudentToClass(classId, selectedToAdd.value)
    selectedToAdd.value = null
    showAssignForm.value = false
  }
}

function removeStudent(id: string) {
  classesStore.removeStudentFromClass(classId, id)
}

function transferStudent(studentId: string, newClassId: string) {
  if (newClassId && newClassId !== classId) {
    classesStore.assignStudentToClass(newClassId, studentId)
  }
}
</script>

<template>
  <q-page padding>
    <div v-if="klass">
      <div class="text-body1 text-grey-7 q-mb-sm">{{ $t('classes.classDetails') }}</div>
      <div class="text-h4 q-mb-lg class-name-highlight">{{ klass.name }}</div>
      
      <div class="q-mb-md">
        <q-btn 
          v-if="!showAssignForm" 
          color="primary" 
          icon="person_add" 
          :label="$t('classes.assignStudentButton')" 
          @click="showAssignForm = true"
        />
      </div>
      
      <q-card v-if="showAssignForm" class="q-mb-md">
        <q-card-section>
          <div class="text-h6">{{ $t('classes.assignStudent') }}</div>
          <div class="row items-center q-gutter-md q-mt-md">
            <div class="col-12 col-sm-8 col-md-6">
              <q-select 
                v-model="selectedToAdd" 
                :options="availableStudents.map(s => ({ label: s.firstName + ' ' + s.lastName, value: s.id }))" 
                :label="$t('students.title')" 
                dense 
                emit-value 
                map-options 
                clearable
              />
            </div>
            <div class="col-12 col-sm-4 col-md-6">
              <div class="row q-gutter-sm">
                <q-btn color="primary" :label="$t('classes.assign')" @click="addStudent" :disable="!selectedToAdd" />
                <q-btn flat :label="$t('students.clear')" @click="showAssignForm = false" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('classes.studentsInClass') }} ({{ assigned.length }})</div>
          
          <q-table 
            v-if="assigned.length > 0"
            :rows="assigned" 
            :columns="[
              { name: 'firstName', label: $t('students.firstName'), field: 'firstName' },
              { name: 'lastName', label: $t('students.lastName'), field: 'lastName' },
              { name: 'actions', label: $t('classes.actions'), field: 'id' }
            ]" 
            row-key="id" 
            flat
            :rows-per-page-options="[10, 25, 50]"
            :pagination="{ rowsPerPage: 10 }"
            :rows-per-page-label="$t('common.recordsPerPage')"
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn-dropdown dense flat icon="swap_horiz" color="primary" :label="$t('classes.transfer')">
                  <q-list>
                    <q-item 
                      v-for="c in allClasses" 
                      :key="c.id" 
                      clickable 
                      v-close-popup
                      @click="transferStudent(props.row.id, c.id)"
                    >
                      <q-item-section>
                        <q-item-label>{{ c.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn dense flat icon="remove_circle" color="negative" @click="removeStudent(props.row.id)" />
              </q-td>
            </template>
          </q-table>
          
          <div v-else class="text-center text-grey-6 q-pa-lg">
            {{ $t('classes.noStudentsInClass') }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
.class-name-highlight {
  font-weight: bold;
  color: #1976d2;
}
</style>


