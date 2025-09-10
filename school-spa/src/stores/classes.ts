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
  state: () => ({
    classesById: {} as Record<string, Klass>,
    order: [] as string[],
  }),
  getters: {
    classes(state): Klass[] {
      return state.order.map(id => state.classesById[id])
    },
    classesWithCounts(): Array<Klass & { count: number }> {
      return this.classes.map(k => ({ ...k, count: k.studentIds.length }))
    },
  },
  actions: {
    addClass(input: NewClass) {
      const id = nanoid()
      this.classesById[id] = {
        id,
        name: input.name,
        studentIds: input.studentIds ? [...input.studentIds] : [],
      }
      this.order.push(id)
    },
    removeClass(id: string) {
      delete this.classesById[id]
      this.order = this.order.filter(x => x !== id)
    },
    assignStudentToClass(classId: string, studentId: string) {
      const k = this.classesById[classId]
      if (!k) return
      if (!k.studentIds.includes(studentId)) k.studentIds.push(studentId)
    },
    removeStudentFromClass(classId: string, studentId: string) {
      const k = this.classesById[classId]
      if (!k) return
      k.studentIds = k.studentIds.filter(id => id !== studentId)
    },
    classStudents(classId: string): Student[] {
      const studentsStore = useStudentsStore()
      const k = this.classesById[classId]
      if (!k) return []
      return k.studentIds
        .map(id => studentsStore.studentsById[id])
        .filter(Boolean) as Student[]
    },
  },
})


