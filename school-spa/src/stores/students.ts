import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { useClassesStore } from './classes'

export type Student = {
  id: string
  firstName: string
  lastName: string
  classId?: string
}

type NewStudent = Omit<Student, 'id'>

export const useStudentsStore = defineStore('students', {
  state: () => {
    // Load from localStorage on initialization
    const savedData = localStorage.getItem('school-students')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        return {
          studentsById: parsed.studentsById || {},
          order: parsed.order || [],
        }
      } catch (error) {
        console.error('Error loading students from localStorage:', error)
      }
    }
    
    return {
      studentsById: {} as Record<string, Student>,
      order: [] as string[],
    }
  },
  getters: {
    students(state): Student[] {
      return state.order.map((id: string) => state.studentsById[id])
    },
    studentsWithClassNames(): Array<Student & { className?: string }> {
      const classesStore = useClassesStore()
      return this.students.map(student => ({
        ...student,
        className: student.classId ? classesStore.classesById[student.classId]?.name : undefined
      }))
    },
  },
  actions: {
    saveToLocalStorage() {
      try {
        localStorage.setItem('school-students', JSON.stringify({
          studentsById: this.studentsById,
          order: this.order,
        }))
      } catch (error) {
        console.error('Error saving students to localStorage:', error)
      }
    },
    addStudent(student: NewStudent) {
      const id = nanoid()
      const s: Student = { id, ...student }
      this.studentsById[id] = s
      this.order.push(id)
      this.saveToLocalStorage()
    },
    updateStudent(id: string, student: Student) {
      if (!this.studentsById[id]) return
      this.studentsById[id] = { ...student, id }
      this.saveToLocalStorage()
    },
    removeStudent(id: string) {
      delete this.studentsById[id]
      this.order = this.order.filter((x: string) => x !== id)
      this.saveToLocalStorage()
    },
  },
})


