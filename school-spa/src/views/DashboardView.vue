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

// Sample Polish names
const polishFirstNames = [
  'Adam', 'Anna', 'Bartosz', 'Barbara', 'Cezary', 'Celina', 'Damian', 'Diana',
  'Emil', 'Ewa', 'Filip', 'Franciszka', 'Grzegorz', 'Gabriela', 'Hubert', 'Helena',
  'Igor', 'Izabela', 'Jakub', 'Joanna', 'Kamil', 'Katarzyna', 'Łukasz', 'Lucyna',
  'Marcin', 'Maria', 'Norbert', 'Natalia', 'Oskar', 'Olga', 'Patryk', 'Paulina',
  'Robert', 'Renata', 'Sebastian', 'Sylwia', 'Tomasz', 'Teresa', 'Wiktor', 'Wiktoria',
  'Zbigniew', 'Zofia', 'Artur', 'Agnieszka', 'Krzysztof', 'Karolina', 'Paweł', 'Patrycja'
]

const polishLastNames = [
  'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński',
  'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk',
  'Piotrowski', 'Grabowski', 'Nowakowski', 'Pawłowski', 'Michalski', 'Nowicki', 'Adamczyk', 'Dudek',
  'Zajączkowski', 'Wieczorek', 'Jabłoński', 'Król', 'Majewski', 'Olszewski', 'Jaworski', 'Wróbel',
  'Malinowski', 'Pawlak', 'Witkowski', 'Walczak', 'Stępień', 'Górski', 'Rutkowski', 'Michalak',
  'Sikora', 'Ostrowski', 'Baran', 'Duda', 'Szewczyk', 'Tomaszewski', 'Pietrzak', 'Marciniak'
]

const classNames = ['1A', '1B', '2A', '2B', '3A', '3B']

function clearAllData() {
  if (confirm('Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.')) {
    studentsStore.$reset()
    classesStore.$reset()
    localStorage.removeItem('students')
    localStorage.removeItem('classes')
  }
}

function generateSampleData() {
  if (confirm('Czy na pewno chcesz wypełnić aplikację przykładowymi danymi? Istniejące dane zostaną zastąpione.')) {
    // Clear existing data
    studentsStore.$reset()
    classesStore.$reset()
    
    // Create 6 classes
    const createdClasses: string[] = []
    classNames.forEach(name => {
      classesStore.addClass({ name })
      const classId = classesStore.classes[classesStore.classes.length - 1].id
      createdClasses.push(classId)
    })
    
    // Generate 48 students (8 per class)
    for (let i = 0; i < 48; i++) {
      const firstName = polishFirstNames[Math.floor(Math.random() * polishFirstNames.length)]
      const lastName = polishLastNames[Math.floor(Math.random() * polishLastNames.length)]
      const classIndex = Math.floor(i / 8) // 8 students per class
      const classId = createdClasses[classIndex]
      
      studentsStore.addStudent({ firstName, lastName, classId })
      const studentId = studentsStore.students[studentsStore.students.length - 1].id
      classesStore.assignStudentToClass(classId, studentId)
    }
  }
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

    <!-- Data Management Section -->
    <div class="q-mb-lg">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">{{ $t('dashboard.dataManagement') }}</div>
          <div class="row q-gutter-md">
            <div class="col-12 col-sm-6">
              <q-btn 
                color="positive" 
                icon="add_circle" 
                :label="$t('dashboard.generateSampleData')" 
                @click="generateSampleData"
                class="full-width"
              />
              <div class="text-caption text-grey-6 q-mt-sm">
                {{ $t('dashboard.sampleDataDescription') }}
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <q-btn 
                color="negative" 
                icon="delete_forever" 
                :label="$t('dashboard.clearAllData')" 
                @click="clearAllData"
                class="full-width"
              />
              <div class="text-caption text-grey-6 q-mt-sm">
                {{ $t('dashboard.clearDataDescription') }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
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
