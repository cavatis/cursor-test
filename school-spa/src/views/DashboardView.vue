<script setup lang="ts">
import { computed, ref } from 'vue'
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
const numberOfClasses = ref(6)
const numberOfStudents = ref(48)

function clearAllData() {
  if (confirm('Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.')) {
    studentsStore.$reset()
    classesStore.$reset()
    localStorage.removeItem('students')
    localStorage.removeItem('classes')
  }
}

function generateSampleData() {
  if (confirm(`Czy na pewno chcesz wypełnić aplikację ${numberOfClasses.value} klasami i ${numberOfStudents.value} uczniami? Istniejące dane zostaną zastąpione.`)) {
    // Clear existing data
    studentsStore.$reset()
    classesStore.$reset()
    
    // Create classes
    const createdClasses: string[] = []
    for (let i = 0; i < numberOfClasses.value; i++) {
      const className = i < classNames.length ? classNames[i] : `Klasa ${i + 1}`
      classesStore.addClass({ name: className })
      const classId = classesStore.classes[classesStore.classes.length - 1].id
      createdClasses.push(classId)
    }
    
    // Generate students
    const studentsPerClass = Math.floor(numberOfStudents.value / numberOfClasses.value)
    const extraStudents = numberOfStudents.value % numberOfClasses.value
    
    for (let i = 0; i < numberOfStudents.value; i++) {
      const firstName = polishFirstNames[Math.floor(Math.random() * polishFirstNames.length)]
      const lastName = polishLastNames[Math.floor(Math.random() * polishLastNames.length)]
      
      // Distribute students evenly across classes
      let classIndex = Math.floor(i / studentsPerClass)
      if (classIndex >= numberOfClasses.value) {
        classIndex = numberOfClasses.value - 1
      }
      
      // Handle extra students by distributing them to first classes
      if (i >= studentsPerClass * numberOfClasses.value) {
        classIndex = i - (studentsPerClass * numberOfClasses.value)
      }
      
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
              <div class="row q-gutter-sm q-mb-md">
                <div class="col-6">
                  <q-input
                    v-model.number="numberOfClasses"
                    :label="$t('dashboard.numberOfClasses')"
                    type="number"
                    min="1"
                    max="20"
                    dense
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-model.number="numberOfStudents"
                    :label="$t('dashboard.numberOfStudents')"
                    type="number"
                    min="1"
                    max="200"
                    dense
                  />
                </div>
              </div>
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
