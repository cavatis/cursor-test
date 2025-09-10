import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export type Student = {
  id: string
  firstName: string
  lastName: string
  classId?: string
}

type NewStudent = Omit<Student, 'id'>

export const useStudentsStore = defineStore('students', {
  state: () => ({
    studentsById: {} as Record<string, Student>,
    order: [] as string[],
  }),
  getters: {
    students(state): Student[] {
      return state.order.map((id: string) => state.studentsById[id])
    },
  },
  actions: {
    addStudent(student: NewStudent) {
      const id = nanoid()
      const s: Student = { id, ...student }
      this.studentsById[id] = s
      this.order.push(id)
    },
    updateStudent(id: string, student: Student) {
      if (!this.studentsById[id]) return
      this.studentsById[id] = { ...student, id }
    },
    removeStudent(id: string) {
      delete this.studentsById[id]
      this.order = this.order.filter((x: string) => x !== id)
    },
  },
  persist: true,
})


