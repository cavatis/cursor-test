import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { Student } from './students'
import { useStudentsStore } from './students'

export type Klass = {
  id: string
  name: string
  studentIds: string[]
}

type NewClass = Omit<Klass, 'id' | 'studentIds'> & { studentIds?: string[] }

export const useClassesStore = defineStore('classes', {
  state: () => {
    // Load from localStorage on initialization
    const savedData = localStorage.getItem('school-classes')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        return {
          classesById: parsed.classesById || {},
          order: parsed.order || [],
        }
      } catch (error) {
        console.error('Error loading classes from localStorage:', error)
      }
    }
    
    return {
      classesById: {} as Record<string, Klass>,
      order: [] as string[],
    }
  },
  getters: {
    classes(state): Klass[] {
      return state.order.map((id: string) => state.classesById[id])
    },
    classesWithCounts(): Array<Klass & { count: number }> {
      return this.classes.map(k => ({ ...k, count: k.studentIds.length }))
    },
  },
  actions: {
    saveToLocalStorage() {
      try {
        localStorage.setItem('school-classes', JSON.stringify({
          classesById: this.classesById,
          order: this.order,
        }))
      } catch (error) {
        console.error('Error saving classes to localStorage:', error)
      }
    },
    addClass(input: NewClass) {
      const id = nanoid()
      this.classesById[id] = {
        id,
        name: input.name,
        studentIds: input.studentIds ? [...input.studentIds] : [],
      }
      this.order.push(id)
      this.saveToLocalStorage()
    },
    removeClass(id: string) {
      delete this.classesById[id]
      this.order = this.order.filter((x: string) => x !== id)
      this.saveToLocalStorage()
    },
    assignStudentToClass(classId: string, studentId: string) {
      const k = this.classesById[classId]
      if (!k) return
      
      // Remove student from any other class first
      this.removeStudentFromAllClasses(studentId)
      
      // Add to new class
      if (!k.studentIds.includes(studentId)) {
        k.studentIds.push(studentId)
      }
      
      // Update student's classId
      const studentsStore = useStudentsStore()
      if (studentsStore.studentsById[studentId]) {
        studentsStore.studentsById[studentId].classId = classId
      }
      
      this.saveToLocalStorage()
      studentsStore.saveToLocalStorage()
    },
    removeStudentFromClass(classId: string, studentId: string) {
      const k = this.classesById[classId]
      if (!k) return
      k.studentIds = k.studentIds.filter((id: string) => id !== studentId)
      
      // Remove classId from student
      const studentsStore = useStudentsStore()
      if (studentsStore.studentsById[studentId]) {
        studentsStore.studentsById[studentId].classId = undefined
      }
      
      this.saveToLocalStorage()
      studentsStore.saveToLocalStorage()
    },
    removeStudentFromAllClasses(studentId: string) {
      // Remove from all classes
      for (const classId in this.classesById) {
        const klass = this.classesById[classId]
        klass.studentIds = klass.studentIds.filter((id: string) => id !== studentId)
      }
      
      // Remove classId from student
      const studentsStore = useStudentsStore()
      if (studentsStore.studentsById[studentId]) {
        studentsStore.studentsById[studentId].classId = undefined
      }
      
      this.saveToLocalStorage()
      studentsStore.saveToLocalStorage()
    },
    classStudents(classId: string): Student[] {
      const studentsStore = useStudentsStore()
      const k = this.classesById[classId]
      if (!k) return []
      return k.studentIds
        .map((id: string) => studentsStore.studentsById[id])
        .filter(Boolean) as Student[]
    },
  },
})


