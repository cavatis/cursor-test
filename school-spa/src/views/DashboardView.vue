<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'

const router = useRouter()
const studentsStore = useStudentsStore()
const classesStore = useClassesStore()

const totalStudents = computed(() => studentsStore.students.length)
const totalClasses = computed(() => classesStore.classes.length)
const studentsWithClass = computed(() => 
  studentsStore.students.filter(s => s.classId).length
)
const studentsWithoutClass = computed(() => 
  studentsStore.students.filter(s => !s.classId).length
)

const classesWithCounts = computed(() => classesStore.classesWithCounts)
const recentStudents = computed(() => 
  studentsStore.students.slice(-5).reverse()
)

function navigateToStudents() {
  router.push('/students')
}

function navigateToClasses() {
  router.push('/classes')
}

function navigateToClass(classId: string) {
  router.push(`/classes/${classId}`)
}
</script>

<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">{{ $t('dashboard.title') }}</div>
    
    <!-- Statistics Cards -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-primary text-white cursor-pointer" @click="navigateToStudents">
          <q-card-section>
            <div class="text-h6">{{ $t('dashboard.totalStudents') }}</div>
            <div class="text-h3">{{ totalStudents }}</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-secondary text-white cursor-pointer" @click="navigateToClasses">
          <q-card-section>
            <div class="text-h6">{{ $t('dashboard.totalClasses') }}</div>
            <div class="text-h3">{{ totalClasses }}</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h6">{{ $t('dashboard.studentsWithClass') }}</div>
            <div class="text-h3">{{ studentsWithClass }}</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-warning text-white">
          <q-card-section>
            <div class="text-h6">{{ $t('dashboard.studentsWithoutClass') }}</div>
            <div class="text-h3">{{ studentsWithoutClass }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Students and Classes Overview -->
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ $t('dashboard.recentStudents') }}</div>
            <q-list v-if="recentStudents.length > 0" separator>
              <q-item v-for="student in recentStudents" :key="student.id">
                <q-item-section>
                  <q-item-label>{{ student.firstName }} {{ student.lastName }}</q-item-label>
                  <q-item-label caption v-if="student.classId">
                    {{ classesStore.classesById[student.classId]?.name || $t('common.noClass') }}
                  </q-item-label>
                  <q-item-label caption v-else>{{ $t('common.noClass') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center text-grey-6 q-pa-md">
              {{ $t('dashboard.noStudents') }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ $t('dashboard.classesOverview') }}</div>
            <q-list v-if="classesWithCounts.length > 0" separator>
              <q-item 
                v-for="klass in classesWithCounts" 
                :key="klass.id" 
                clickable 
                @click="navigateToClass(klass.id)"
              >
                <q-item-section>
                  <q-item-label>{{ klass.name }}</q-item-label>
                  <q-item-label caption>{{ klass.count }} {{ $t('classes.students') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="arrow_forward_ios" />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center text-grey-6 q-pa-md">
              {{ $t('dashboard.noClasses') }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
